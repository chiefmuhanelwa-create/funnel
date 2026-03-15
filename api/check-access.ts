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
      console.error('[AUTH] DATABASE_URL not configured');
      // If admin and no database, allow access
      if (isAdmin) {
        console.log(`[AUTH] Admin login (no DB): ${normalizedEmail}`);
        return res.status(200).json({
          productIds: [0],
          products: [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }],
          isAdmin: true,
        });
      }

      // Return user-friendly error for non-admins
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Please try again in a few moments',
        debug: 'database_not_configured',
      });
    }

    // Create raw SQL connection
    let sql;
    try {
      sql = neon(databaseUrl);
      // Test connection
      await sql`SELECT 1`;
    } catch (connError: any) {
      console.error('[AUTH] Database connection failed:', connError?.message);
      if (isAdmin) {
        return res.status(200).json({
          productIds: [0],
          products: [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }],
          isAdmin: true,
          warning: 'Database connection failed',
        });
      }
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Please try again in a few moments',
        debug: 'database_connection_failed',
      });
    }

    // Get products for this email
    let accessRecords;
    try {
      accessRecords = await sql`
        SELECT
          ca.product_id,
          p.product_key,
          p.name
        FROM customer_access ca
        INNER JOIN products p ON ca.product_id = p.id
        WHERE ca.customer_email = ${normalizedEmail}
      `;
    } catch (queryError: any) {
      console.error('[AUTH] Query failed:', queryError?.message);
      // Check if it's a missing table error
      if (queryError?.message?.includes('does not exist')) {
        if (isAdmin) {
          return res.status(200).json({
            productIds: [0],
            products: [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }],
            isAdmin: true,
            warning: 'Database tables not set up',
          });
        }
        return res.status(503).json({
          error: 'Service not fully configured',
          message: 'Please contact support',
          debug: 'tables_not_created',
        });
      }
      throw queryError;
    }

    const productsList = accessRecords.map(r => ({
      id: r.product_id,
      product_key: r.product_key,
      name: r.name,
    }));

    // Get the list of product keys for filtering duplicates on checkout
    const ownedProductKeys = productsList.map(p => p.product_key);

    // If admin and no products, still allow access
    if (isAdmin && productsList.length === 0) {
      console.log(`[AUTH] Admin login: ${normalizedEmail}`);
      productsList.push({ id: 0, product_key: 'admin-access', name: 'Admin Access' });
    }

    // If regular user with no products, return empty (not an error)
    if (!isAdmin && productsList.length === 0) {
      console.log(`[AUTH] No products for: ${normalizedEmail}`);
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
      ownedProductKeys, // Used by checkout to prevent duplicate purchases
      isAdmin,
    });
  } catch (error: any) {
    console.error('[AUTH] Check access error:', error?.message || error);
    return res.status(500).json({
      error: 'Something went wrong',
      message: 'Please try again or contact support',
      debug: error?.message,
    });
  }
}
