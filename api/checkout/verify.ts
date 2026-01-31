import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

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

  // Check database URL
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
        metadata: { order_id: number; order_number: string };
      };
    };

    if (!paystackData.status) {
      return res.status(400).json({ error: 'Failed to verify payment' });
    }

    const paymentStatus = paystackData.data.status === 'success' ? 'completed' : 'pending';

    // Create raw SQL connection
    const sql = neon(databaseUrl);

    // Get order
    const orderResult = await sql`
      SELECT id, order_number, payment_status, total_amount_cents, currency
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
    }

    // Get order items
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
