import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { db, orders, orderItems, customerAccess, products, abandonedCarts, orderEmailsSent, emailSequences } from '../../lib/db';
import { eq, and } from 'drizzle-orm';
import { PRODUCT_BUNDLES } from '../../lib/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-paystack-signature'] as string;

    // Verify signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Paystack webhook event:', event.event);

    if (event.event === 'charge.success') {
      const { order_id, order_number, product_keys } = event.data.metadata;
      const customerEmail = event.data.customer.email.toLowerCase().trim();

      // Update order status
      await db
        .update(orders)
        .set({ paymentStatus: 'completed', updatedAt: new Date() })
        .where(eq(orders.id, order_id));

      // Get order details
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, order_id));

      if (!order) {
        console.error('Order not found:', order_id);
        return res.status(404).json({ error: 'Order not found' });
      }

      // Grant product access (including bundles)
      await grantProductAccess(customerEmail, product_keys, order_id);

      // Mark abandoned cart as recovered
      await db
        .update(abandonedCarts)
        .set({ recovered: true, updatedAt: new Date() })
        .where(eq(abandonedCarts.customerEmail, customerEmail));

      // Send order confirmation email
      await sendOrderConfirmationEmail(order, product_keys);

      // Check if first purchase and send welcome email
      const previousOrders = await db
        .select()
        .from(orders)
        .where(and(
          eq(orders.customerEmail, customerEmail),
          eq(orders.paymentStatus, 'completed')
        ));

      if (previousOrders.length === 1) {
        await sendWelcomeEmail(customerEmail, order.customerName || 'there');
        await scheduleWelcomeSequence(customerEmail);
      }

      // Sync to ConvertKit (optional)
      await syncToConvertKit(customerEmail, order.customerName || '', product_keys, order_number);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function grantProductAccess(email: string, productKeys: string[], orderId: number) {
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
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.productKey, key));

      if (!product) continue;

      // Check existing access
      const [existing] = await db
        .select()
        .from(customerAccess)
        .where(and(
          eq(customerAccess.customerEmail, email),
          eq(customerAccess.productId, product.id)
        ));

      if (existing) continue;

      // Grant access
      await db.insert(customerAccess).values({
        customerEmail: email,
        productId: product.id,
        orderId,
      });
    } catch (error) {
      console.error(`Failed to grant access for ${key}:`, error);
    }
  }
}

async function sendOrderConfirmationEmail(order: any, productKeys: string[]) {
  // Check if already sent (deduplication)
  const [existing] = await db
    .select()
    .from(orderEmailsSent)
    .where(and(
      eq(orderEmailsSent.orderId, order.id),
      eq(orderEmailsSent.emailType, 'order_confirmation')
    ));

  if (existing) {
    console.log('Order confirmation already sent for order:', order.id);
    return;
  }

  const currencySymbol = order.currency === 'ZAR' ? 'R' : '$';
  const formattedTotal = `${currencySymbol}${(order.totalAmountCents / 100).toFixed(2)}`;

  const productList = productKeys.map(key => formatProductName(key)).join(', ');

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>Your payment has been confirmed.</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Products:</strong> ${productList}</p>
        <p><strong>Total:</strong> ${formattedTotal}</p>
        <p><a href="https://contentpreneurhub.online/members">Access Your Content</a></p>
      `,
    });

    // Record that email was sent
    await db.insert(orderEmailsSent).values({
      orderId: order.id,
      emailType: 'order_confirmation',
    });
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
  }
}

async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject: 'Welcome to Contentpreneur Hub!',
      html: `
        <h1>Welcome to the Contentpreneur Family!</h1>
        <p>Hi ${name},</p>
        <p>Welcome! I'm so excited to have you here.</p>
        <p>You've just taken the first step towards building a successful content creation business.</p>
        <p><a href="https://contentpreneurhub.online/members">Start Learning Now</a></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

async function scheduleWelcomeSequence(email: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.insert(emailSequences).values({
    customerEmail: email,
    sequenceType: 'welcome',
    emailNumber: 2,
    scheduledFor: tomorrow,
  });
}

async function syncToConvertKit(email: string, firstName: string, productKeys: string[], orderNumber: string) {
  if (!process.env.CONVERTKIT_API_SECRET) return;

  try {
    await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: process.env.CONVERTKIT_API_SECRET,
        email,
        first_name: firstName,
        fields: {
          products_purchased: productKeys.join(', '),
          last_purchase_date: new Date().toISOString().split('T')[0],
        },
      }),
    });
  } catch (error) {
    console.error('ConvertKit sync error:', error);
  }
}

function formatProductName(productKey: string): string {
  const names: Record<string, string> = {
    'starter-kit': 'Contentpreneur Starter Kit',
    'influencers-code': "The Influencer's Code",
    'tax-guide': 'Creator Tax Guide SA',
    'niche-finder': 'Niche Finder Workbook',
    'paids-workbook': 'PAIDS Framework Workbook',
    'content-foundations': 'Content Foundations Masterclass',
    'contentpreneur-pro': 'Contentpreneur Pro Bundle',
    'coaching-session': '1-on-1 Coaching Session',
  };
  return names[productKey] || productKey;
}
