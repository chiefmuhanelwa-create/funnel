import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Admin emails that can log in without purchases
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is admin - admins can log in without purchases
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    // Check database URL
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      // If admin and no database, allow access
      if (isAdmin) {
        console.log(`[AUTH] Admin login (no DB): ${normalizedEmail}`);
        return res.status(200).json({
          productIds: [0],
          products: [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }],
          isAdmin: true,
        });
      }

      return res.status(200).json({
        productIds: [],
        products: [],
        isAdmin: false,
        message: 'Database not configured',
      });
    }

    // Create raw SQL connection
    const sql = neon(databaseUrl);

    // Get products for this email
    const accessRecords = await sql`
      SELECT
        ca.product_id,
        p.product_key,
        p.name
      FROM customer_access ca
      INNER JOIN products p ON ca.product_id = p.id
      WHERE ca.customer_email = ${normalizedEmail}
    `;

    const productsList = accessRecords.map(r => ({
      id: r.product_id,
      product_key: r.product_key,
      name: r.name,
    }));

    // If admin and no products, still allow access
    if (isAdmin && productsList.length === 0) {
      console.log(`[AUTH] Admin login: ${normalizedEmail}`);
      productsList.push({ id: 0, product_key: 'admin-access', name: 'Admin Access' });
    }

    // If regular user with no products, return empty
    if (!isAdmin && productsList.length === 0) {
      return res.status(200).json({
        productIds: [],
        products: [],
        isAdmin: false,
      });
    }

    console.log(`[AUTH] Login success: ${normalizedEmail}, products: ${productsList.length}`);

    return res.status(200).json({
      productIds: productsList.map(p => p.id),
      products: productsList,
      isAdmin,
    });
  } catch (error) {
    console.error('[AUTH] Check access error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
