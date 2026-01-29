import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Simple in-memory rate limiting
const checkoutAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = checkoutAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    checkoutAttempts.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

async function getExchangeRate(): Promise<number> {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR');
    const data = await response.json() as { rates: { ZAR: number } };
    return data.rates.ZAR;
  } catch {
    return 18.5;
  }
}

function generateOrderNumber(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${Date.now()}-${suffix}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  if (!checkRateLimit(getClientIP(req))) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Check env vars
  const databaseUrl = process.env.DATABASE_URL;
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;

  if (!databaseUrl) return res.status(500).json({ error: 'Database not configured' });
  if (!paystackKey) return res.status(500).json({ error: 'Payment not configured' });

  try {
    // Create raw SQL connection (no ORM)
    const sql = neon(databaseUrl);

    const body = req.body || {};
    const { productKeys, includeOrderBumps, customerEmail, customerName } = body;

    if (!customerEmail || !productKeys || !Array.isArray(productKeys) || productKeys.length === 0) {
      return res.status(400).json({ error: 'Customer email and products are required' });
    }

    // Combine product keys
    const allProductKeys: string[] = [
      ...productKeys,
      ...(Array.isArray(includeOrderBumps) ? includeOrderBumps : [])
    ];

    // Fetch products using raw SQL
    const productsList: any[] = [];
    for (const key of allProductKeys) {
      const result = await sql`
        SELECT id, product_key, name, price_cents, is_active
        FROM products
        WHERE product_key = ${key} AND is_active = true
      `;
      if (result.length > 0) {
        productsList.push(result[0]);
      }
    }

    if (productsList.length === 0) {
      return res.status(400).json({ error: 'No valid products found', requestedKeys: allProductKeys });
    }

    // Calculate totals
    const totalUSD = productsList.reduce((sum, p) => sum + (p.price_cents || 0), 0);
    const exchangeRate = await getExchangeRate();
    const totalZAR = Math.round(totalUSD * exchangeRate);
    const orderNumber = generateOrderNumber();
    const email = customerEmail.toLowerCase().trim();

    // Create order using raw SQL
    const orderResult = await sql`
      INSERT INTO orders (order_number, customer_email, customer_name, payment_status, total_amount_cents, currency)
      VALUES (${orderNumber}, ${email}, ${customerName || null}, 'pending', ${totalZAR}, 'ZAR')
      RETURNING id
    `;

    const orderId = orderResult[0].id;

    // Create order items
    for (const product of productsList) {
      const priceZAR = Math.round((product.price_cents || 0) * exchangeRate);
      await sql`
        INSERT INTO order_items (order_id, product_id, product_key, price_cents)
        VALUES (${orderId}, ${product.id}, ${product.product_key}, ${priceZAR})
      `;
    }

    // Initialize Paystack
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contentpreneurhub.online';
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: totalZAR,
        currency: 'ZAR',
        callback_url: `${appUrl}/checkout/success`,
        metadata: {
          order_id: orderId,
          order_number: orderNumber,
          product_keys: allProductKeys,
        },
      }),
    });

    const paystackData = await paystackResponse.json() as any;

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      return res.status(500).json({ error: 'Payment initialization failed', details: paystackData.message });
    }

    // Update order with Paystack reference
    await sql`
      UPDATE orders SET paystack_reference = ${paystackData.data.reference} WHERE id = ${orderId}
    `;

    return res.status(200).json({
      checkoutUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      orderNumber,
      totalUSD,
      totalZAR,
      exchangeRate,
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      error: 'Checkout failed',
      message: error?.message || 'Unknown error',
    });
  }
}
