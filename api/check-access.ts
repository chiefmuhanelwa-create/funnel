import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    // If admin, allow access immediately (even without database)
    if (isAdmin) {
      console.log(`[AUTH] Admin login: ${normalizedEmail}`);

      // Try to get products from database if available
      let productsList: Array<{ id: number; product_key: string; name: string }> = [];

      if (process.env.DATABASE_URL) {
        try {
          const { db, products, customerAccess } = await import('../lib/db');
          const { eq } = await import('drizzle-orm');

          if (db) {
            const accessRecords = await db
              .select({
                productId: customerAccess.productId,
                productKey: products.productKey,
                name: products.name,
              })
              .from(customerAccess)
              .innerJoin(products, eq(customerAccess.productId, products.id))
              .where(eq(customerAccess.customerEmail, normalizedEmail));

            productsList = accessRecords.map(r => ({
              id: r.productId,
              product_key: r.productKey,
              name: r.name,
            }));
          }
        } catch (dbError) {
          console.error('[AUTH] Database error (admin will still have access):', dbError);
        }
      }

      // Admin always gets access, even if no products found
      if (productsList.length === 0) {
        productsList = [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }];
      }

      return res.status(200).json({
        productIds: productsList.map(p => p.id),
        products: productsList,
        isAdmin: true,
      });
    }

    // For non-admins, database is required
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({
        productIds: [],
        products: [],
        isAdmin: false,
        message: 'Database not configured',
      });
    }

    // Get products for non-admin users
    const { db, products, customerAccess } = await import('../lib/db');
    const { eq } = await import('drizzle-orm');

    if (!db) {
      return res.status(200).json({
        productIds: [],
        products: [],
        isAdmin: false,
      });
    }

    const accessRecords = await db
      .select({
        productId: customerAccess.productId,
        productKey: products.productKey,
        name: products.name,
      })
      .from(customerAccess)
      .innerJoin(products, eq(customerAccess.productId, products.id))
      .where(eq(customerAccess.customerEmail, normalizedEmail));

    const productsList = accessRecords.map(r => ({
      id: r.productId,
      product_key: r.productKey,
      name: r.name,
    }));

    return res.status(200).json({
      productIds: productsList.map(p => p.id),
      products: productsList,
      isAdmin: false,
    });
  } catch (error) {
    console.error('[AUTH] Check access error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
