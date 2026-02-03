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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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
    const { customerEmail, productKeys } = req.body;

    if (!customerEmail || !productKeys || !Array.isArray(productKeys)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        usage: 'POST with { customerEmail: string, productKeys: string[] }' 
      });
    }

    const sql = neon(databaseUrl);
    const normalizedEmail = customerEmail.toLowerCase().trim();
    const results: { granted: string[]; skipped: string[]; notFound: string[] } = {
      granted: [],
      skipped: [],
      notFound: [],
    };

    for (const productKey of productKeys) {
      // Find product
      const productResult = await sql`
        SELECT id, name FROM products WHERE product_key = ${productKey}
      `;

      if (productResult.length === 0) {
        results.notFound.push(productKey);
        continue;
      }

      const product = productResult[0];

      // Check if access already exists
      const existingAccess = await sql`
        SELECT id FROM customer_access 
        WHERE customer_email = ${normalizedEmail} AND product_id = ${product.id}
      `;

      if (existingAccess.length > 0) {
        results.skipped.push(productKey);
        continue;
      }

      // Grant access
      await sql`
        INSERT INTO customer_access (customer_email, product_id)
        VALUES (${normalizedEmail}, ${product.id})
      `;

      results.granted.push(productKey);
    }

    console.log(`[ADMIN] Grant access for ${normalizedEmail}:`, results);

    return res.status(200).json({
      success: true,
      customerEmail: normalizedEmail,
      results,
    });
  } catch (error: any) {
    console.error('[ADMIN] Grant access error:', error);
    return res.status(500).json({ error: 'Failed to grant access', message: error?.message });
  }
}
