import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, products, orders, orderItems, abandonedCarts } from '../../lib/db';
import { eq } from 'drizzle-orm';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not configured');
    return res.status(500).json({
      error: 'Database not configured. Please set DATABASE_URL environment variable.',
      setup_required: true
    });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error('PAYSTACK_SECRET_KEY is not configured');
    return res.status(500).json({
      error: 'Payment provider not configured. Please set PAYSTACK_SECRET_KEY environment variable.',
      setup_required: true
    });
  }

  try {
    const { productKeys, includeOrderBumps, customerEmail, customerName, discountCode } = req.body;

    if (!customerEmail || !productKeys?.length) {
      return res.status(400).json({ error: 'Customer email and products are required' });
    }

    // Get all products
    const allProductKeys = [...productKeys, ...(includeOrderBumps || [])];
    const productsList: any[] = [];

    for (const key of allProductKeys) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.productKey, key));

      if (product && product.isActive) {
        productsList.push(product);
      }
    }

    if (productsList.length === 0) {
      return res.status(400).json({ error: 'No valid products found' });
    }

    // Calculate total in USD cents
    const totalUSD = productsList.reduce((sum, p) => sum + p.priceCents, 0);

    // Get exchange rate for ZAR
    const exchangeRate = await getExchangeRate();
    const totalZAR = Math.round(totalUSD * exchangeRate);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${generateRandomString(6)}`;

    // Create order record
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerName,
        paymentStatus: 'pending',
        totalAmountCents: totalZAR,
        currency: 'ZAR',
        discountCode: discountCode || null, // Save discount code if provided
      })
      .returning();

    // Create order items
    for (const product of productsList) {
      const priceZAR = Math.round(product.priceCents * exchangeRate);
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: product.id,
        productKey: product.productKey,
        priceCents: priceZAR,
      });
    }

    // Track as potential abandoned cart
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

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: totalZAR, // Paystack uses kobo (cents)
        currency: 'ZAR',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contentpreneurhub.online'}/checkout/success`,
        metadata: {
          order_id: order.id,
          order_number: orderNumber,
          product_keys: allProductKeys,
          custom_fields: [
            { display_name: 'Order Number', variable_name: 'order_number', value: orderNumber },
            { display_name: 'Customer Name', variable_name: 'customer_name', value: customerName },
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
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
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
