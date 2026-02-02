import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { email, productKey, action, metadata } = req.body;

    if (!email || !productKey || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sql = neon(databaseUrl);

    // Check if this is an abandoned cart or checkout completion
    if (action === 'checkout_started') {
      // Track that user started checkout
      await sql`
        INSERT INTO cart_tracking (email, product_key, status, metadata, created_at)
        VALUES (${normalizedEmail}, ${productKey}, 'started', ${JSON.stringify(metadata || {})}, NOW())
        ON CONFLICT (email, product_key)
        DO UPDATE SET status = 'started', metadata = ${JSON.stringify(metadata || {})}, updated_at = NOW()
      `;

      console.log('[CART] Checkout started:', normalizedEmail, productKey);
    } else if (action === 'checkout_completed') {
      // Mark as completed (not abandoned)
      await sql`
        UPDATE cart_tracking
        SET status = 'completed', updated_at = NOW()
        WHERE email = ${normalizedEmail} AND product_key = ${productKey}
      `;

      console.log('[CART] Checkout completed:', normalizedEmail, productKey);
    } else if (action === 'checkout_abandoned') {
      // Mark as abandoned for follow-up
      await sql`
        UPDATE cart_tracking
        SET status = 'abandoned', updated_at = NOW()
        WHERE email = ${normalizedEmail} AND product_key = ${productKey} AND status = 'started'
      `;

      console.log('[CART] Checkout abandoned:', normalizedEmail, productKey);

      // TODO: Trigger ConvertKit abandoned cart sequence here
      // This could call the subscribe endpoint with abandoned_cart tag
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[CART] Error:', error);
    return res.status(500).json({ error: 'Failed to track cart' });
  }
}
