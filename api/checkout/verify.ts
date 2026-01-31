import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Product bundles - what products get unlocked when purchasing
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Reference is required' });
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json() as {
      status: boolean;
      data: {
        status: string;
        amount: number;
        customer: { email: string };
        metadata: { order_id: number; order_number: string; product_keys: string };
      };
    };

    if (!paystackData.status) {
      return res.status(400).json({ error: 'Failed to verify payment' });
    }

    const paymentStatus = paystackData.data.status === 'success' ? 'completed' : 'pending';
    const sql = neon(databaseUrl);

    // Get order
    const orderResult = await sql`
      SELECT id, order_number, payment_status, total_amount_cents, currency, customer_email
      FROM orders
      WHERE paystack_reference = ${reference}
    `;

    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult[0];

    // Update order status if payment successful
    if (paymentStatus === 'completed' && order.payment_status !== 'completed') {
      await sql`
        UPDATE orders
        SET payment_status = 'completed', updated_at = NOW()
        WHERE id = ${order.id}
      `;

      // BACKUP ACCESS GRANT: If webhook failed, grant access here
      console.log('[VERIFY] Payment successful - checking if access needs to be granted');

      const customerEmail = (order.customer_email || paystackData.data.customer.email).toLowerCase().trim();

      // Get order items to determine what products were purchased
      const orderItems = await sql`
        SELECT product_key FROM order_items WHERE order_id = ${order.id}
      `;

      const purchasedProducts = orderItems.map((item: any) => item.product_key);

      // Calculate all products to grant (including bundles)
      const productsToGrant = new Set<string>();
      for (const productKey of purchasedProducts) {
        productsToGrant.add(productKey);
        if (PRODUCT_BUNDLES[productKey]) {
          PRODUCT_BUNDLES[productKey].forEach(k => productsToGrant.add(k));
        }
      }

      console.log('[VERIFY] Products to grant:', Array.from(productsToGrant));

      // Grant access to each product (skip if already exists)
      let accessGranted = 0;
      for (const productKey of productsToGrant) {
        try {
          const productResult = await sql`SELECT id FROM products WHERE product_key = ${productKey}`;
          if (productResult.length === 0) {
            console.log(`[VERIFY] Product not in DB: ${productKey}`);
            continue;
          }

          const productId = productResult[0].id;

          // Check if access already exists
          const existingAccess = await sql`
            SELECT id FROM customer_access
            WHERE customer_email = ${customerEmail} AND product_id = ${productId}
          `;

          if (existingAccess.length > 0) {
            console.log(`[VERIFY] Already has access: ${productKey}`);
            continue;
          }

          // Grant new access
          await sql`
            INSERT INTO customer_access (customer_email, product_id, order_id)
            VALUES (${customerEmail}, ${productId}, ${order.id})
          `;
          console.log(`[VERIFY] Granted access: ${productKey}`);
          accessGranted++;
        } catch (err) {
          console.error(`[VERIFY] Error granting ${productKey}:`, err);
        }
      }

      if (accessGranted > 0) {
        console.log(`[VERIFY] Backup access grant: ${accessGranted} products granted`);
      }
    }

    // Get order items for response
    const orderItems = await sql`
      SELECT oi.product_key, oi.price_cents, p.name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
    `;

    const items = orderItems.map((item: any) => ({
      item_id: item.product_key,
      item_name: item.name || item.product_key,
      price: item.price_cents / 100,
    }));

    return res.status(200).json({
      success: paymentStatus === 'completed',
      order: {
        order_number: order.order_number,
        payment_status: paymentStatus,
        total_amount_cents: order.total_amount_cents,
        currency: order.currency,
      },
      items,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}
