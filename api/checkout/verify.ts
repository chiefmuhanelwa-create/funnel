import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, orders } from '../../lib/db';
import { eq } from 'drizzle-orm';

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

    // Get order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paystackReference, reference));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status if payment successful
    if (paymentStatus === 'completed' && order.paymentStatus !== 'completed') {
      await db
        .update(orders)
        .set({ paymentStatus: 'completed', updatedAt: new Date() })
        .where(eq(orders.id, order.id));
    }

    return res.status(200).json({
      success: paymentStatus === 'completed',
      order: {
        order_number: order.orderNumber,
        payment_status: paymentStatus,
        total_amount_cents: order.totalAmountCents,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}
