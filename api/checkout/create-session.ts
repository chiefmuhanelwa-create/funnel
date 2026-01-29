import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Define tables inline to avoid import issues
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productKey: text('product_key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  isActive: boolean('is_active').default(true),
  level: text('level'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  paymentStatus: text('payment_status').default('pending'),
  totalAmountCents: integer('total_amount_cents').notNull(),
  currency: text('currency').notNull().default('USD'),
  paymentIntentId: text('payment_intent_id'),
  paystackReference: text('paystack_reference'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id'),
  productKey: text('product_key').notNull(),
  priceCents: integer('price_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

const abandonedCarts = pgTable('abandoned_carts', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull().unique(),
  productKeys: text('product_keys').notNull(),
  totalAmountCents: integer('total_amount_cents').notNull(),
  currency: text('currency').default('USD'),
  recoveryEmailSent: boolean('recovery_email_sent').default(false),
  recovered: boolean('recovered').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

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

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
    const sql = neon(databaseUrl);
    const db = drizzle(sql);

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

    // Fetch products
    const productsList: any[] = [];
    for (const key of allProductKeys) {
      const result = await db.select().from(products).where(eq(products.productKey, key));
      if (result.length > 0 && result[0].isActive) {
        productsList.push(result[0]);
      }
    }

    if (productsList.length === 0) {
      return res.status(400).json({ error: 'No valid products found', requestedKeys: allProductKeys });
    }

    // Calculate totals
    const totalUSD = productsList.reduce((sum, p) => sum + (p.priceCents || 0), 0);
    const exchangeRate = await getExchangeRate();
    const totalZAR = Math.round(totalUSD * exchangeRate);
    const orderNumber = `ORD-${Date.now()}-${generateRandomString(6)}`;

    // Create order
    const orderResult = await db.insert(orders).values({
      orderNumber,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: customerName || null,
      paymentStatus: 'pending',
      totalAmountCents: totalZAR,
      currency: 'ZAR',
    }).returning();

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

    // Track abandoned cart (optional)
    try {
      await db.insert(abandonedCarts).values({
        customerEmail: customerEmail.toLowerCase().trim(),
        productKeys: JSON.stringify(allProductKeys),
        totalAmountCents: totalZAR,
        currency: 'ZAR',
      }).onConflictDoUpdate({
        target: abandonedCarts.customerEmail,
        set: {
          productKeys: JSON.stringify(allProductKeys),
          totalAmountCents: totalZAR,
          updatedAt: new Date(),
        },
      });
    } catch (e) { /* non-critical */ }

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
          order_id: order.id,
          order_number: orderNumber,
          product_keys: allProductKeys,
        },
      }),
    });

    const paystackData = await paystackResponse.json() as any;

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      return res.status(500).json({ error: 'Payment initialization failed', details: paystackData.message });
    }

    // Update order with reference
    await db.update(orders).set({ paystackReference: paystackData.data.reference }).where(eq(orders.id, order.id));

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
