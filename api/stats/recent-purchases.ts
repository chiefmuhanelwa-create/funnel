import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Cache recent purchases for 5 minutes to reduce DB load
let cachedPurchases: any[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// South African cities for location display
const SA_CITIES = [
  'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
  'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300'); // CDN cache for 5 min

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      // Return empty array if no DB - graceful degradation
      return res.status(200).json({ purchases: [], count24h: 0, isRealData: false });
    }

    // Check cache
    if (Date.now() - cacheTimestamp < CACHE_TTL && cachedPurchases.length > 0) {
      return res.status(200).json({
        purchases: cachedPurchases,
        count24h: cachedPurchases.length,
        isRealData: true,
        cached: true
      });
    }

    const sql = neon(databaseUrl);

    // Get real purchases from last 24 hours
    const recentOrders = await sql`
      SELECT
        o.customer_name,
        o.customer_email,
        o.created_at,
        array_agg(oi.product_key) as products
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      WHERE o.payment_status = 'completed'
        AND o.created_at > NOW() - INTERVAL '24 hours'
      GROUP BY o.id, o.customer_name, o.customer_email, o.created_at
      ORDER BY o.created_at DESC
      LIMIT 20
    `;

    // Format for frontend - anonymize customer data
    const purchases = recentOrders.map((order: any) => {
      // Get first name or first letter of email
      let displayName = 'Someone';
      if (order.customer_name) {
        const firstName = order.customer_name.split(' ')[0];
        displayName = firstName.length > 1 ? `${firstName.charAt(0)}${firstName.slice(1).replace(/./g, '*').slice(0, 3)}` : firstName.charAt(0) + '.';
      } else if (order.customer_email) {
        displayName = order.customer_email.charAt(0).toUpperCase() + '.';
      }

      // Calculate time ago
      const createdAt = new Date(order.created_at);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      let timeAgo = 'just now';
      if (diffMins > 0 && diffMins < 60) {
        timeAgo = `${diffMins} min ago`;
      } else if (diffHours > 0 && diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      }

      // Random city (we don't collect location data)
      const city = SA_CITIES[Math.floor(Math.random() * SA_CITIES.length)];

      // Get primary product name
      const productKey = order.products[0];
      const productNames: Record<string, string> = {
        'starter-kit': 'Starter Kit',
        'influencers-code': "Influencer's Code",
        'content-foundations': 'Content Foundations',
        'tax-guide': 'Tax Guide',
        'niche-finder': 'Niche Finder',
        'paids-workbook': 'PAIDS Workbook',
        'content-arsenal': 'Content Arsenal',
      };

      return {
        name: displayName,
        location: city,
        product: productNames[productKey] || 'Product',
        time: timeAgo,
        timestamp: order.created_at
      };
    });

    // Update cache
    cachedPurchases = purchases;
    cacheTimestamp = Date.now();

    return res.status(200).json({
      purchases,
      count24h: purchases.length,
      isRealData: true
    });

  } catch (error: any) {
    console.error('[STATS] Error fetching recent purchases:', error);
    // Graceful degradation - return empty rather than error
    return res.status(200).json({ purchases: [], count24h: 0, isRealData: false });
  }
}
