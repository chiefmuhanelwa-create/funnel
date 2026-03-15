import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Admin emails that can use this endpoint
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

// Product bundles - when someone buys a bundle, they get all products in it
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': [
    'starter-kit',
    'content-foundations',
    'influencers-code',
    'tax-guide',
    'niche-finder',
    'paids-workbook',
  ],
};

function getProductsToGrant(purchasedProductKeys: string[]): string[] {
  const productsToGrant = new Set<string>();
  for (const productKey of purchasedProductKeys) {
    productsToGrant.add(productKey);
    const bundledProducts = PRODUCT_BUNDLES[productKey];
    if (bundledProducts) {
      bundledProducts.forEach(key => productsToGrant.add(key));
    }
  }
  return Array.from(productsToGrant);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { adminEmail, specificEmail } = req.body || {};

    // Simple admin check
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase().trim())) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const sql = neon(databaseUrl);
    const results: any[] = [];

    // Find all completed orders that might be missing access
    let ordersQuery;
    if (specificEmail) {
      // Repair specific email
      ordersQuery = await sql`
        SELECT o.id as order_id, o.order_number, o.customer_email,
               array_agg(oi.product_key) as product_keys
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.payment_status = 'completed'
          AND o.customer_email = ${specificEmail.toLowerCase().trim()}
        GROUP BY o.id, o.order_number, o.customer_email
      `;
    } else {
      // Repair all
      ordersQuery = await sql`
        SELECT o.id as order_id, o.order_number, o.customer_email,
               array_agg(oi.product_key) as product_keys
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.payment_status = 'completed'
        GROUP BY o.id, o.order_number, o.customer_email
      `;
    }

    for (const order of ordersQuery) {
      const customerEmail = order.customer_email.toLowerCase().trim();
      const purchasedProducts = order.product_keys || [];
      const allProductsToGrant = getProductsToGrant(purchasedProducts);

      let accessGranted = 0;
      let accessSkipped = 0;

      for (const productKey of allProductsToGrant) {
        // Check if product exists
        const productResult = await sql`
          SELECT id FROM products WHERE product_key = ${productKey}
        `;

        if (productResult.length === 0) {
          console.log(`[REPAIR] Product not in DB: ${productKey} - creating it`);
          // Auto-create the product if it doesn't exist
          await sql`
            INSERT INTO products (product_key, name, price_cents, is_active, level)
            VALUES (${productKey}, ${productKey}, 0, true, 'all')
            ON CONFLICT (product_key) DO NOTHING
          `;
          // Re-fetch the product
          const newProductResult = await sql`
            SELECT id FROM products WHERE product_key = ${productKey}
          `;
          if (newProductResult.length === 0) continue;
        }

        const productId = (await sql`SELECT id FROM products WHERE product_key = ${productKey}`)[0]?.id;
        if (!productId) continue;

        // Check if access already exists
        const existingAccess = await sql`
          SELECT id FROM customer_access
          WHERE customer_email = ${customerEmail} AND product_id = ${productId}
        `;

        if (existingAccess.length > 0) {
          accessSkipped++;
          continue;
        }

        // Grant access
        await sql`
          INSERT INTO customer_access (customer_email, product_id, order_id)
          VALUES (${customerEmail}, ${productId}, ${order.order_id})
        `;
        accessGranted++;
      }

      if (accessGranted > 0) {
        results.push({
          email: customerEmail,
          orderNumber: order.order_number,
          productsGranted: accessGranted,
          productsSkipped: accessSkipped,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Repaired access for ${results.length} orders`,
      details: results,
    });

  } catch (error: any) {
    console.error('[REPAIR] Error:', error);
    return res.status(500).json({
      error: 'Repair failed',
      details: error?.message,
    });
  }
}
