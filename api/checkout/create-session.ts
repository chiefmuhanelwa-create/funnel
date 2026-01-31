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
    if (!response.ok) {
      console.log('Exchange rate API returned non-OK status, using fallback');
      return 18.5;
    }
    const data = await response.json() as { rates: { ZAR: number } };
    return data.rates.ZAR || 18.5;
  } catch (error) {
    console.log('Exchange rate API error, using fallback:', error);
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

  // Step 1: Check environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;

  if (!databaseUrl) {
    console.error('DATABASE_URL not configured');
    return res.status(500).json({ error: 'Database not configured', step: 'env_check' });
  }
  if (!paystackKey) {
    console.error('PAYSTACK_SECRET_KEY not configured');
    return res.status(500).json({ error: 'Payment not configured', step: 'env_check' });
  }

  // Validate Paystack key format
  if (!paystackKey.startsWith('sk_')) {
    console.error('Invalid Paystack key format - should start with sk_');
    return res.status(500).json({ error: 'Invalid payment key format', step: 'env_check' });
  }

  let sql: ReturnType<typeof neon>;

  // Step 2: Connect to database
  try {
    sql = neon(databaseUrl);
  } catch (error: any) {
    console.error('Failed to create database connection:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      step: 'db_connect',
      message: error?.message
    });
  }

  // Step 3: Parse request body
  const body = req.body || {};
  const { productKeys, includeOrderBumps, customerEmail, customerName } = body;

  if (!customerEmail || typeof customerEmail !== 'string') {
    return res.status(400).json({ error: 'Customer email is required', step: 'validation' });
  }
  if (!productKeys || !Array.isArray(productKeys) || productKeys.length === 0) {
    return res.status(400).json({ error: 'Product keys are required', step: 'validation' });
  }

  // Combine product keys
  const allProductKeys: string[] = [
    ...productKeys,
    ...(Array.isArray(includeOrderBumps) ? includeOrderBumps : [])
  ];

  // Step 4: Fetch products from database
  let productsList: any[] = [];
  try {
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
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    return res.status(500).json({
      error: 'Failed to fetch products',
      step: 'fetch_products',
      message: error?.message,
      requestedKeys: allProductKeys
    });
  }

  if (productsList.length === 0) {
    // Try to get all products for debugging
    let allProducts: any[] = [];
    try {
      allProducts = await sql`SELECT product_key, is_active FROM products LIMIT 10`;
    } catch (e) {
      // Ignore
    }
    return res.status(400).json({
      error: 'No valid products found',
      step: 'fetch_products',
      requestedKeys: allProductKeys,
      availableProducts: allProducts.map(p => ({ key: p.product_key, active: p.is_active }))
    });
  }

  // Step 5: Calculate totals
  const totalUSD = productsList.reduce((sum, p) => sum + (p.price_cents || 0), 0);

  if (totalUSD <= 0) {
    return res.status(400).json({
      error: 'Invalid total amount',
      step: 'calculate_total',
      totalUSD,
      products: productsList.map(p => ({ key: p.product_key, price: p.price_cents }))
    });
  }

  const exchangeRate = await getExchangeRate();
  // Convert: USD cents * exchange rate = ZAR cents
  // e.g., 6700 USD cents ($67) * 18.5 = 123,950 ZAR cents (R1,239.50)
  const totalZAR = Math.round(totalUSD * exchangeRate);
  const orderNumber = generateOrderNumber();
  const email = customerEmail.toLowerCase().trim();

  // Step 6: Create order in database
  let orderId: number;
  try {
    const orderResult = await sql`
      INSERT INTO orders (order_number, customer_email, customer_name, payment_status, total_amount_cents, currency)
      VALUES (${orderNumber}, ${email}, ${customerName || null}, 'pending', ${totalZAR}, 'ZAR')
      RETURNING id
    `;

    if (!orderResult || orderResult.length === 0 || !orderResult[0].id) {
      throw new Error('Order insert did not return an ID');
    }

    orderId = orderResult[0].id;
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      step: 'create_order',
      message: error?.message
    });
  }

  // Step 7: Create order items
  try {
    for (const product of productsList) {
      const priceZAR = Math.round((product.price_cents || 0) * exchangeRate);
      await sql`
        INSERT INTO order_items (order_id, product_id, product_key, price_cents)
        VALUES (${orderId}, ${product.id}, ${product.product_key}, ${priceZAR})
      `;
    }
  } catch (error: any) {
    console.error('Failed to create order items:', error);
    return res.status(500).json({
      error: 'Failed to create order items',
      step: 'create_order_items',
      message: error?.message
    });
  }

  // Step 8: Initialize Paystack transaction
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contentpreneurhub.online';

  let paystackData: any;
  try {
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        amount: totalZAR, // Amount in ZAR cents
        currency: 'ZAR',
        callback_url: `${appUrl}/checkout/success`,
        metadata: {
          order_id: orderId.toString(),
          order_number: orderNumber,
          product_keys: allProductKeys.join(','),
          original_usd_cents: totalUSD.toString(),
          exchange_rate: exchangeRate.toString(),
        },
      }),
    });

    paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack API error:', paystackData);
      return res.status(500).json({
        error: 'Payment initialization failed',
        step: 'paystack_init',
        message: paystackData?.message || 'Unknown Paystack error',
        paystackStatus: paystackData?.status,
      });
    }

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      console.error('Invalid Paystack response:', paystackData);
      return res.status(500).json({
        error: 'Invalid payment response',
        step: 'paystack_init',
        message: paystackData?.message || 'Missing authorization URL',
      });
    }
  } catch (error: any) {
    console.error('Paystack API call failed:', error);
    return res.status(500).json({
      error: 'Payment service unavailable',
      step: 'paystack_init',
      message: error?.message
    });
  }

  // Step 9: Update order with Paystack reference
  try {
    await sql`
      UPDATE orders
      SET paystack_reference = ${paystackData.data.reference}
      WHERE id = ${orderId}
    `;
  } catch (error: any) {
    console.error('Failed to update order with reference:', error);
    // Don't fail the checkout for this - the reference is stored in metadata too
  }

  // Success!
  return res.status(200).json({
    checkoutUrl: paystackData.data.authorization_url,
    reference: paystackData.data.reference,
    orderNumber,
    totalUSD,
    totalZAR,
    exchangeRate,
  });
}
