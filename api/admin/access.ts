import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

// Product bundles for granting access
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

  const sql = neon(databaseUrl);

  try {
    // GET - List all customer access records
    if (req.method === 'GET') {
      const { email } = req.query;

      if (email && typeof email === 'string') {
        // Get access for specific customer
        const access = await sql`
          SELECT ca.id, ca.customer_email, ca.created_at,
                 p.product_key, p.name as product_name
          FROM customer_access ca
          JOIN products p ON ca.product_id = p.id
          WHERE ca.customer_email = ${email.toLowerCase()}
          ORDER BY ca.created_at DESC
        `;
        return res.status(200).json({ access });
      }

      // Get all access records grouped by email
      const access = await sql`
        SELECT ca.customer_email,
               array_agg(p.product_key) as product_keys,
               array_agg(p.name) as product_names,
               MIN(ca.created_at) as first_access,
               COUNT(*) as product_count
        FROM customer_access ca
        JOIN products p ON ca.product_id = p.id
        GROUP BY ca.customer_email
        ORDER BY first_access DESC
        LIMIT 100
      `;

      return res.status(200).json({ access });
    }

    // POST - Grant access to a customer
    if (req.method === 'POST') {
      const { email, productKey, includeBundles } = req.body;

      if (!email || !productKey) {
        return res.status(400).json({ error: 'Email and productKey are required' });
      }

      const customerEmail = email.toLowerCase().trim();

      // Calculate products to grant
      const productsToGrant = new Set<string>([productKey]);
      if (includeBundles !== false && PRODUCT_BUNDLES[productKey]) {
        PRODUCT_BUNDLES[productKey].forEach(k => productsToGrant.add(k));
      }

      let granted = 0;
      let skipped = 0;

      for (const key of productsToGrant) {
        // Get product ID
        const productResult = await sql`
          SELECT id FROM products WHERE product_key = ${key}
        `;

        if (productResult.length === 0) {
          console.log(`Product not found: ${key}`);
          continue;
        }

        const productId = productResult[0].id;

        // Check if already has access
        const existing = await sql`
          SELECT id FROM customer_access
          WHERE customer_email = ${customerEmail} AND product_id = ${productId}
        `;

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Grant access
        await sql`
          INSERT INTO customer_access (customer_email, product_id)
          VALUES (${customerEmail}, ${productId})
        `;
        granted++;
      }

      return res.status(200).json({
        success: true,
        message: `Granted access to ${granted} products (${skipped} already existed)`,
        productsGranted: Array.from(productsToGrant),
      });
    }

    // DELETE - Revoke access from a customer
    if (req.method === 'DELETE') {
      const { email, productKey, revokeAll } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const customerEmail = email.toLowerCase().trim();

      if (revokeAll) {
        // Revoke all access
        const result = await sql`
          DELETE FROM customer_access
          WHERE customer_email = ${customerEmail}
          RETURNING id
        `;
        return res.status(200).json({
          success: true,
          message: `Revoked all access (${result.length} products)`,
        });
      }

      if (!productKey) {
        return res.status(400).json({ error: 'productKey or revokeAll is required' });
      }

      // Get product ID
      const productResult = await sql`
        SELECT id FROM products WHERE product_key = ${productKey}
      `;

      if (productResult.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const productId = productResult[0].id;

      // Revoke specific access
      const result = await sql`
        DELETE FROM customer_access
        WHERE customer_email = ${customerEmail} AND product_id = ${productId}
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Access not found' });
      }

      return res.status(200).json({
        success: true,
        message: `Revoked access to ${productKey}`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin access error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
