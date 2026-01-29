import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { products, orders, orderItems, abandonedCarts } from '../../lib/schema';

// Simple in-memory rate limiting for checkout
const checkoutAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = checkoutAttempts.get(ip);

  if (!entry || entry.resetAt < now) {
    checkoutAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

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
    return 18.5; // Fallback rate
  }
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first - always do this
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

  // Apply rate limiting
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Check for required environment variables BEFORE doing anything else
  const databaseUrl = process.env.DATABASE_URL;
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;

  if (!databaseUrl) {
    return res.status(500).json({
      error: 'Database not configured',
      code: 'NO_DATABASE_URL'
    });
  }

  if (!paystackKey) {
    return res.status(500).json({
      error: 'Payment provider not configured',
      code: 'NO_PAYSTACK_KEY'
    });
  }

  try {
    // Create database connection inside the try block
    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    // Parse request body
    const body = req.body || {};
    const { productKeys, includeOrderBumps, customerEmail, customerName } = body;

    if (!customerEmail || !productKeys || !Array.isArray(productKeys) || productKeys.length === 0) {
      return res.status(400).json({ error: 'Customer email and products are required' });
    }

    // Get all product keys (main products + order bumps)
    const allProductKeys: string[] = [
      ...productKeys,
      ...(Array.isArray(includeOrderBumps) ? includeOrderBumps : [])
    ];

    // Fetch products from database
    const productsList: any[] = [];
    for (const key of allProductKeys) {
      const result = await db
        .select()
        .from(products)
        .where(eq(products.productKey, key));

      if (result.length > 0 && result[0].isActive) {
        productsList.push(result[0]);
      }
    }

    if (productsList.length === 0) {
      return res.status(400).json({
        error: 'No valid products found',
        requestedKeys: allProductKeys
      });
    }

    // Calculate totals
    const totalUSD = productsList.reduce((sum, p) => sum + (p.priceCents || 0), 0);
    const exchangeRate = await getExchangeRate();
    const totalZAR = Math.round(totalUSD * exchangeRate);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${generateRandomString(6)}`;

    // Create order
    const orderResult = await db
      .insert(orders)
      .values({
        orderNumber,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerName: customerName || null,
        paymentStatus: 'pending',
        totalAmountCents: totalZAR,
        currency: 'ZAR',
      })
      .returning();

    if (!orderResult.length) {
      throw new Error('Failed to create order record');
    }

    const order = orderResult[0];

    // Create order items
    for (const product of productsList) {
      const priceZAR = Math.round((product.priceCents || 0) * exchangeRate);
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: product.id,
        productKey: product.productKey,
        priceCents: priceZAR,
      });
    }

    // Track abandoned cart (non-critical)
    try {
      await db
        .insert(abandonedCarts)
        .values({
          customerEmail: customerEmail.toLowerCase().trim(),
          productKeys: JSON.stringify(allProductKeys),
          totalAmountCents: totalZAR,
          currency: 'ZAR',
        })
        .onConflictDoUpdate({
          target: abandonedCarts.customerEmail,
          set: {
            productKeys: JSON.stringify(allProductKeys),
            totalAmountCents: totalZAR,
            updatedAt: new Date(),
          },
        });
    } catch (e) {
      // Non-critical, continue
    }

    // Initialize Paystack transaction
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
          order_id: order.id,
          order_number: orderNumber,
          product_keys: allProductKeys,
          custom_fields: [
            { display_name: 'Order Number', variable_name: 'order_number', value: orderNumber },
            { display_name: 'Customer Name', variable_name: 'customer_name', value: customerName || 'N/A' },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json() as any;

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      console.error('Paystack error:', paystackData);
      return res.status(500).json({
        error: 'Payment initialization failed',
        details: paystackData.message || 'Unknown Paystack error'
      });
    }

    // Update order with Paystack reference
    await db
      .update(orders)
      .set({ paystackReference: paystackData.data.reference })
      .where(eq(orders.id, order.id));

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
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
