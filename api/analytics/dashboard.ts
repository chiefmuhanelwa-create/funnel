import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { ADMIN_EMAILS } from '../../lib/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Admin-only
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return res.status(500).json({ error: 'Database not configured' });

  try {
    const days = parseInt((req.query.days as string) || '7', 10);
    const sql = neon(databaseUrl);

    // --- Summary metrics ---
    const [visitors, pageViews, videoPlays, formSubmissions, purchases, orders] = await Promise.all([
      // Unique sessions
      sql`
        SELECT COUNT(DISTINCT session_id) AS count
        FROM analytics_events
        WHERE created_at >= NOW() - (${days} || ' days')::interval
      `,
      // Page views
      sql`
        SELECT COUNT(*) AS count
        FROM analytics_events
        WHERE event_type = 'page_view'
          AND created_at >= NOW() - (${days} || ' days')::interval
      `,
      // Video plays
      sql`
        SELECT COUNT(*) AS count
        FROM analytics_events
        WHERE event_type = 'video_play'
          AND created_at >= NOW() - (${days} || ' days')::interval
      `,
      // Form submissions
      sql`
        SELECT COUNT(*) AS count
        FROM analytics_events
        WHERE event_type = 'form_submit'
          AND created_at >= NOW() - (${days} || ' days')::interval
      `,
      // Purchases from analytics_events
      sql`
        SELECT COUNT(*) AS count
        FROM analytics_events
        WHERE event_type = 'purchase'
          AND created_at >= NOW() - (${days} || ' days')::interval
      `,
      // Revenue from orders table
      sql`
        SELECT
          COUNT(*) AS count,
          COALESCE(SUM(total_amount_cents), 0) AS revenue_cents
        FROM orders
        WHERE payment_status = 'completed'
          AND created_at >= NOW() - (${days} || ' days')::interval
      `,
    ]);

    const totalVisitors = parseInt(visitors[0]?.count as string || '0', 10);
    const totalPurchases = parseInt(orders[0]?.count as string || '0', 10);
    const revenueCents = parseInt(orders[0]?.revenue_cents as string || '0', 10);
    const conversionRate =
      totalVisitors > 0
        ? ((totalPurchases / totalVisitors) * 100).toFixed(2)
        : '0.00';

    // --- Traffic sources ---
    const trafficSources = await sql`
      SELECT
        COALESCE(utm_source, 'Direct') AS source,
        COUNT(DISTINCT session_id) AS visitors
      FROM analytics_events
      WHERE created_at >= NOW() - (${days} || ' days')::interval
      GROUP BY utm_source
      ORDER BY visitors DESC
      LIMIT 10
    `;

    // --- Daily stats ---
    const dailyStats = await sql`
      SELECT
        DATE(created_at) AS date,
        COUNT(DISTINCT session_id) AS visitors,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN session_id END) AS purchases
      FROM analytics_events
      WHERE created_at >= NOW() - (${days} || ' days')::interval
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // --- Top pages ---
    const topPages = await sql`
      SELECT
        page_url,
        COUNT(*) AS views
      FROM analytics_events
      WHERE event_type = 'page_view'
        AND page_url IS NOT NULL
        AND created_at >= NOW() - (${days} || ' days')::interval
      GROUP BY page_url
      ORDER BY views DESC
      LIMIT 10
    `;

    // --- Recent orders ---
    const recentOrders = await sql`
      SELECT
        order_number,
        customer_email,
        customer_name,
        total_amount_cents,
        currency,
        payment_status,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return res.status(200).json({
      summary: {
        visitors: totalVisitors,
        pageViews: parseInt(pageViews[0]?.count as string || '0', 10),
        videoPlays: parseInt(videoPlays[0]?.count as string || '0', 10),
        formSubmissions: parseInt(formSubmissions[0]?.count as string || '0', 10),
        purchases: totalPurchases,
        revenueUsd: (revenueCents / 100).toFixed(2),
        conversionRate: parseFloat(conversionRate),
      },
      trafficSources,
      dailyStats,
      topPages,
      recentOrders,
      period: { days },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ANALYTICS DASHBOARD] Error:', message);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
