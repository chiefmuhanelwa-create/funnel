import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, products, customerAccess, ADMIN_EMAILS } from '../lib/db';
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

    // Check if user is admin - admins can log in without purchases
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);

    // Get all access records for this email with product info
    let accessRecords: Array<{ productId: number; productKey: string; name: string }> = [];

    if (db) {
      accessRecords = await db
        .select({
          productId: customerAccess.productId,
          productKey: products.productKey,
          name: products.name,
        })
        .from(customerAccess)
        .innerJoin(products, eq(customerAccess.productId, products.id))
        .where(eq(customerAccess.customerEmail, normalizedEmail));
    }

    const productIds = accessRecords.map(r => r.productId);
    const productsList = accessRecords.map(r => ({
      id: r.productId,
      product_key: r.productKey,
      name: r.name,
    }));

    // If admin with no products, still return success with admin flag
    if (isAdmin && productsList.length === 0) {
      return res.status(200).json({
        productIds: [],
        products: [{ id: 0, product_key: 'admin-access', name: 'Admin Access' }],
        isAdmin: true,
      });
    }

    return res.status(200).json({
      productIds,
      products: productsList,
      isAdmin,
    });
  } catch (error) {
    console.error('Check access error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
