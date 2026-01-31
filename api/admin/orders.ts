import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authorization
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.customer_email,
        o.customer_name,
        o.payment_status,
        o.total_amount_cents,
        o.currency,
        o.created_at,
        array_agg(oi.product_key) as products
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `;

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Admin orders error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
