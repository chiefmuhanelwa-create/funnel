import { Hono } from 'hono';
import type { Env, Order, Product } from '../types';
import { PRODUCT_BUNDLES } from '../types';
import { sendOrderConfirmationEmail, sendWelcomeEmail } from '../emails/index';
import { syncToConvertKit } from '../utils/convertkit';

const app = new Hono<{ Bindings: Env }>();

// POST /api/webhooks/paystack - Paystack webhook handler
app.post('/paystack', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('x-paystack-signature');

  // Verify signature
  if (!verifyPaystackSignature(body, signature || '', c.env.PAYSTACK_WEBHOOK_SECRET)) {
    console.error('Invalid Paystack webhook signature');
    return c.json({ error: 'Invalid signature' }, 400);
  }

  const event = JSON.parse(body) as {
    event: string;
    data: {
      reference: string;
      status: string;
      amount: number;
      currency: string;
      customer: { email: string };
      metadata: {
        order_id: number;
        order_number: string;
        product_keys: string[];
      };
    };
  };

  console.log('Paystack webhook event:', event.event);

  if (event.event === 'charge.success') {
    const db = c.env.DB;
    const { order_id, order_number, product_keys } = event.data.metadata;
    const customerEmail = event.data.customer.email.toLowerCase().trim();

    try {
      // Update order status
      await db.prepare(`
        UPDATE orders SET payment_status = 'completed', updated_at = datetime('now')
        WHERE id = ?
      `).bind(order_id).run();

      // Get order details
      const order = await db.prepare('SELECT * FROM orders WHERE id = ?')
        .bind(order_id).first<Order>();

      if (!order) {
        console.error('Order not found:', order_id);
        return c.json({ error: 'Order not found' }, 404);
      }

      // Grant product access (including bundles)
      const grantResult = await grantProductAccess(db, customerEmail, product_keys, order_id);
      console.log('Access granted:', grantResult);

      // Mark abandoned cart as recovered
      await db.prepare(`
        UPDATE abandoned_carts SET recovered = 1, updated_at = datetime('now')
        WHERE customer_email = ?
      `).bind(customerEmail).run();

      // Send order confirmation email
      await sendOrderConfirmationEmail(c.env, order, product_keys);

      // Check if first purchase and send welcome email
      const previousOrders = await db.prepare(`
        SELECT COUNT(*) as count FROM orders
        WHERE customer_email = ? AND payment_status = 'completed' AND id != ?
      `).bind(customerEmail, order_id).first<{ count: number }>();

      if (!previousOrders || previousOrders.count === 0) {
        await sendWelcomeEmail(c.env, customerEmail, order.customer_name || 'there');

        // Schedule welcome sequence
        await scheduleWelcomeSequence(db, customerEmail);
      }

      // Sync to ConvertKit
      await syncToConvertKit(c.env, {
        email: customerEmail,
        firstName: order.customer_name || '',
        tags: ['customer', `purchased-${order_number}`, ...product_keys],
        customFields: {
          last_purchase_date: new Date().toISOString().split('T')[0],
          total_spent: String(order.total_amount_cents / 100),
          products_purchased: product_keys.join(', '),
        },
      });

      return c.json({ success: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return c.json({ error: 'Webhook processing failed' }, 500);
    }
  }

  return c.json({ received: true });
});

// POST /api/webhooks/stripe - Stripe webhook handler
app.post('/stripe', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('stripe-signature');

  // Verify signature (simplified - use Stripe SDK in production)
  if (!signature || !c.env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ error: 'Missing signature or secret' }, 400);
  }

  try {
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      // Handle Stripe checkout completion similar to Paystack
      console.log('Stripe checkout completed:', event.data.object);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

function verifyPaystackSignature(body: string, signature: string, secret: string): boolean {
  const crypto = require('crypto') as typeof import('crypto');
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  return hash === signature;
}

async function grantProductAccess(
  db: D1Database,
  email: string,
  productKeys: string[],
  orderId: number
): Promise<{ granted: string[]; skipped: string[]; failed: string[] }> {
  const result = { granted: [] as string[], skipped: [] as string[], failed: [] as string[] };

  // Expand product keys to include bundles
  const allKeys = new Set<string>();
  for (const key of productKeys) {
    allKeys.add(key);
    if (PRODUCT_BUNDLES[key]) {
      PRODUCT_BUNDLES[key].forEach(k => allKeys.add(k));
    }
  }

  for (const key of allKeys) {
    try {
      const product = await db.prepare('SELECT * FROM products WHERE product_key = ?')
        .bind(key).first<Product>();

      if (!product) {
        result.failed.push(key);
        continue;
      }

      // Check existing access
      const existing = await db.prepare(`
        SELECT * FROM customer_access WHERE customer_email = ? AND product_id = ?
      `).bind(email, product.id).first();

      if (existing) {
        result.skipped.push(key);
        continue;
      }

      // Grant access
      await db.prepare(`
        INSERT INTO customer_access (customer_email, product_id, order_id)
        VALUES (?, ?, ?)
      `).bind(email, product.id, orderId).run();

      result.granted.push(key);
    } catch (error) {
      console.error(`Failed to grant access for ${key}:`, error);
      result.failed.push(key);
    }
  }

  return result;
}

async function scheduleWelcomeSequence(db: D1Database, email: string): Promise<void> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.prepare(`
    INSERT INTO email_sequences (customer_email, sequence_type, email_number, scheduled_for)
    VALUES (?, 'welcome', 2, ?)
  `).bind(email, tomorrow.toISOString()).run();
}

type D1Database = import('@cloudflare/workers-types').D1Database;

export { app as webhookRoutes };
