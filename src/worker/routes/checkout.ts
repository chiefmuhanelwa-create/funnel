import { Hono } from 'hono';
import type { Env, Product, Order } from '../types';
import { PRODUCT_BUNDLES } from '../types';

const app = new Hono<{ Bindings: Env }>();

// POST /api/checkout/create-session - Create payment session
app.post('/create-session', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    productKeys: string[];
    includeOrderBumps?: string[];
    customerEmail: string;
    customerName: string;
  }>();

  if (!body.customerEmail || !body.productKeys?.length) {
    return c.json({ error: 'Customer email and products are required' }, 400);
  }

  try {
    // Get all products
    const allProductKeys = [...body.productKeys, ...(body.includeOrderBumps || [])];
    const products: Product[] = [];

    for (const key of allProductKeys) {
      const product = await db.prepare(
        'SELECT * FROM products WHERE product_key = ? AND is_active = 1'
      ).bind(key).first<Product>();

      if (product) {
        products.push(product);
      }
    }

    if (products.length === 0) {
      return c.json({ error: 'No valid products found' }, 400);
    }

    // Calculate total in USD cents
    const totalUSD = products.reduce((sum, p) => sum + p.price_cents, 0);

    // Get exchange rate for ZAR
    const exchangeRate = await getExchangeRate();
    const totalZAR = Math.round(totalUSD * exchangeRate);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${generateRandomString(6)}`;

    // Create order record
    const orderResult = await db.prepare(`
      INSERT INTO orders (order_number, customer_email, customer_name, payment_status, total_amount_cents, currency)
      VALUES (?, ?, ?, 'pending', ?, 'ZAR')
    `).bind(
      orderNumber,
      body.customerEmail.toLowerCase().trim(),
      body.customerName,
      totalZAR
    ).run();

    const orderId = orderResult.meta.last_row_id;

    // Create order items
    for (const product of products) {
      const priceZAR = Math.round(product.price_cents * exchangeRate);
      await db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_key, price_cents)
        VALUES (?, ?, ?, ?)
      `).bind(orderId, product.id, product.product_key, priceZAR).run();
    }

    // Track as potential abandoned cart
    await db.prepare(`
      INSERT INTO abandoned_carts (customer_email, product_keys, total_amount_cents, currency)
      VALUES (?, ?, ?, 'ZAR')
      ON CONFLICT(customer_email) DO UPDATE SET
        product_keys = excluded.product_keys,
        total_amount_cents = excluded.total_amount_cents,
        updated_at = datetime('now')
    `).bind(
      body.customerEmail.toLowerCase().trim(),
      JSON.stringify(allProductKeys),
      totalZAR
    ).run();

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.customerEmail,
        amount: totalZAR, // Paystack uses kobo (cents)
        currency: 'ZAR',
        callback_url: `https://contentpreneurhub.online/checkout/success`,
        metadata: {
          order_id: orderId,
          order_number: orderNumber,
          product_keys: allProductKeys,
          custom_fields: [
            { display_name: 'Order Number', variable_name: 'order_number', value: orderNumber },
            { display_name: 'Customer Name', variable_name: 'customer_name', value: body.customerName },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json() as {
      status: boolean;
      data: { authorization_url: string; reference: string };
    };

    if (!paystackData.status) {
      throw new Error('Failed to initialize Paystack transaction');
    }

    // Update order with Paystack reference
    await db.prepare(`
      UPDATE orders SET paystack_reference = ? WHERE id = ?
    `).bind(paystackData.data.reference, orderId).run();

    return c.json({
      checkoutUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      orderNumber,
      totalUSD,
      totalZAR,
      exchangeRate,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// GET /api/checkout/verify - Verify payment status
app.get('/verify', async (c) => {
  const db = c.env.DB;
  const reference = c.req.query('reference');

  if (!reference) {
    return c.json({ error: 'Reference is required' }, 400);
  }

  try {
    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${c.env.PAYSTACK_SECRET_KEY}`,
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
      return c.json({ error: 'Failed to verify payment' }, 400);
    }

    const paymentStatus = paystackData.data.status === 'success' ? 'completed' : 'pending';

    // Get order
    const order = await db.prepare(
      'SELECT * FROM orders WHERE paystack_reference = ?'
    ).bind(reference).first<Order>();

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Update order status if payment successful
    if (paymentStatus === 'completed' && order.payment_status !== 'completed') {
      await db.prepare(`
        UPDATE orders SET payment_status = 'completed', updated_at = datetime('now')
        WHERE id = ?
      `).bind(order.id).run();
    }

    return c.json({
      success: paymentStatus === 'completed',
      order: {
        order_number: order.order_number,
        payment_status: paymentStatus,
        total_amount_cents: order.total_amount_cents,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

// Current rate ~16.93 ZAR/USD (March 2026), fallback slightly higher for volatility
const FALLBACK_RATE = 18.00;

async function getExchangeRate(): Promise<number> {
  // Try primary API (Frankfurter)
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR');
    if (response.ok) {
      const data = await response.json() as { rates: { ZAR: number } };
      if (data.rates?.ZAR && data.rates.ZAR > 0) {
        return data.rates.ZAR;
      }
    }
  } catch {
    // Try backup
  }

  // Try backup API
  try {
    const backupResponse = await fetch('https://open.er-api.com/v6/latest/USD');
    if (backupResponse.ok) {
      const backupData = await backupResponse.json() as { rates: { ZAR: number } };
      if (backupData.rates?.ZAR && backupData.rates.ZAR > 0) {
        return backupData.rates.ZAR;
      }
    }
  } catch {
    // Use fallback
  }

  return FALLBACK_RATE;
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { app as checkoutRoutes };
