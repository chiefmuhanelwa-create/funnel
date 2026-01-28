import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, products, customerAccess } from '../lib/db';
import { eq } from 'drizzle-orm';

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

    // Get all access records for this email with product info
    const accessRecords = await db
      .select({
        productId: customerAccess.productId,
        productKey: products.productKey,
        name: products.name,
      })
      .from(customerAccess)
      .innerJoin(products, eq(customerAccess.productId, products.id))
      .where(eq(customerAccess.customerEmail, normalizedEmail));

    const productIds = accessRecords.map(r => r.productId);
    const productsList = accessRecords.map(r => ({
      id: r.productId,
      product_key: r.productKey,
      name: r.name,
    }));

    return res.status(200).json({ productIds, products: productsList });
  } catch (error) {
    console.error('Check access error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
