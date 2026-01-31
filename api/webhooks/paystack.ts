import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Product bundles configuration (inline to avoid import issues)
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'influencers-code', 'tax-guide', 'content-foundations', 'niche-finder', 'paids-workbook'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check required environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

  if (!databaseUrl) {
    console.error('DATABASE_URL not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (!webhookSecret) {
    console.error('PAYSTACK_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-paystack-signature'] as string;

    // Verify signature
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack webhook signature');
      console.error('Expected:', hash);
      console.error('Received:', signature);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Paystack webhook event:', event.event);

    if (event.event === 'charge.success') {
      const sql = neon(databaseUrl);

      // Extract metadata - handle both string and array formats
      const metadata = event.data.metadata || {};
      const orderIdRaw = metadata.order_id;
      const orderNumber = metadata.order_number;
      const productKeysRaw = metadata.product_keys;

      // Parse order_id (might be string from metadata)
      const orderId = typeof orderIdRaw === 'string' ? parseInt(orderIdRaw, 10) : orderIdRaw;

      // Parse product_keys (might be comma-separated string or array)
      let productKeysList: string[];
      if (typeof productKeysRaw === 'string') {
        productKeysList = productKeysRaw.split(',').map(k => k.trim()).filter(k => k);
      } else if (Array.isArray(productKeysRaw)) {
        productKeysList = productKeysRaw;
      } else {
        productKeysList = [];
      }

      const customerEmail = event.data.customer.email.toLowerCase().trim();

      console.log('[WEBHOOK] Processing order:', { orderId, orderNumber, customerEmail, productKeysList });

      if (!orderId || isNaN(orderId)) {
        console.error('Invalid order_id in metadata:', orderIdRaw);
        return res.status(400).json({ error: 'Invalid order_id' });
      }

      // Update order status
      await sql`
        UPDATE orders
        SET payment_status = 'completed', updated_at = NOW()
        WHERE id = ${orderId}
      `;
      console.log('[WEBHOOK] Updated order status to completed');

      // Get order details
      const orderResult = await sql`
        SELECT id, order_number, customer_email, customer_name, total_amount_cents, currency, discount_code
        FROM orders
        WHERE id = ${orderId}
      `;

      if (orderResult.length === 0) {
        console.error('Order not found:', orderId);
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderResult[0];

      // Grant product access (including bundles)
      await grantProductAccess(sql, customerEmail, productKeysList, orderId);

      // Mark abandoned cart as recovered
      try {
        await sql`
          UPDATE abandoned_carts
          SET recovered = true, updated_at = NOW()
          WHERE customer_email = ${customerEmail}
        `;
      } catch (e) {
        // Ignore - cart might not exist
      }

      // Increment discount code usage if one was used
      if (order.discount_code) {
        try {
          await sql`
            UPDATE discount_codes
            SET current_uses = current_uses + 1
            WHERE code = ${order.discount_code.toUpperCase()}
          `;
          console.log(`[DISCOUNT] Incremented usage for code: ${order.discount_code}`);
        } catch (e) {
          console.error('Failed to increment discount usage:', e);
        }
      }

      // Send order confirmation email
      await sendOrderConfirmationEmail(sql, order, productKeysList);

      // Check if first purchase and send welcome email
      const previousOrdersResult = await sql`
        SELECT id FROM orders
        WHERE customer_email = ${customerEmail} AND payment_status = 'completed'
      `;

      if (previousOrdersResult.length === 1) {
        await sendWelcomeEmail(customerEmail, order.customer_name || 'there');
        await scheduleWelcomeSequence(sql, customerEmail);
      }

      // Sync to ConvertKit (optional)
      await syncToConvertKit(customerEmail, order.customer_name || '', productKeysList, orderNumber);

      console.log('[WEBHOOK] Successfully processed charge.success for order:', orderId);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed', message: error?.message });
  }
}

async function grantProductAccess(sql: any, email: string, productKeys: string[], orderId: number) {
  // Expand product keys to include bundles
  const allKeys = new Set<string>();
  for (const key of productKeys) {
    allKeys.add(key);
    if (PRODUCT_BUNDLES[key]) {
      PRODUCT_BUNDLES[key].forEach(k => allKeys.add(k));
    }
  }

  console.log('[ACCESS] Granting access to products:', Array.from(allKeys));

  for (const key of allKeys) {
    try {
      // Get product by key
      const productResult = await sql`
        SELECT id FROM products WHERE product_key = ${key}
      `;

      if (productResult.length === 0) {
        console.log(`[ACCESS] Product not found: ${key}`);
        continue;
      }

      const productId = productResult[0].id;

      // Check existing access
      const existingResult = await sql`
        SELECT id FROM customer_access
        WHERE customer_email = ${email} AND product_id = ${productId}
      `;

      if (existingResult.length > 0) {
        console.log(`[ACCESS] Already has access to ${key}`);
        continue;
      }

      // Grant access
      await sql`
        INSERT INTO customer_access (customer_email, product_id, order_id)
        VALUES (${email}, ${productId}, ${orderId})
      `;

      console.log(`[ACCESS] Granted access to ${key} for ${email}`);
    } catch (error) {
      console.error(`Failed to grant access for ${key}:`, error);
    }
  }
}

async function sendOrderConfirmationEmail(sql: any, order: any, productKeys: string[]) {
  // Check if already sent (deduplication)
  try {
    const existingResult = await sql`
      SELECT id FROM order_emails_sent
      WHERE order_id = ${order.id} AND email_type = 'order_confirmation'
    `;

    if (existingResult.length > 0) {
      console.log('Order confirmation already sent for order:', order.id);
      return;
    }
  } catch (e) {
    // Continue if check fails
  }

  const currencySymbol = order.currency === 'ZAR' ? 'R' : '$';
  const formattedTotal = `${currencySymbol}${(order.total_amount_cents / 100).toFixed(2)}`;

  const productList = productKeys.map((key: string) => formatProductName(key)).join(', ');

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
      to: order.customer_email,
      subject: `Order Confirmation - ${order.order_number}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0;">Thank You For Your Order!</h1>
          </div>

          <p>Hi ${order.customer_name || 'there'},</p>

          <p>Your payment has been confirmed and your content is ready to access!</p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
            <p style="margin: 0 0 10px 0;"><strong>Products:</strong> ${productList}</p>
            <p style="margin: 0;"><strong>Total:</strong> ${formattedTotal}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://contentpreneurhub.online/members" style="display: inline-block; background: linear-gradient(to right, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Access Your Content Now
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Simply use your purchase email (${order.customer_email}) to log in and access your content.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="color: #666; font-size: 12px; text-align: center;">
            Questions? Reply to this email or contact support@contentpreneurhub.online
          </p>
        </body>
        </html>
      `,
    });

    // Record that email was sent
    await sql`
      INSERT INTO order_emails_sent (order_id, email_type)
      VALUES (${order.id}, 'order_confirmation')
    `;

    console.log('[EMAIL] Order confirmation sent to:', order.customer_email);
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0;">Welcome to the Contentpreneur Family!</h1>
          </div>

          <p>Hi ${name},</p>

          <p>Welcome! I'm so excited to have you here.</p>

          <p>You've just taken the first step towards building a successful content creation business. This is going to be a game-changer for you.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://contentpreneurhub.online/members" style="display: inline-block; background: linear-gradient(to right, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Start Learning Now
            </a>
          </div>

          <p>Here's what you should do first:</p>
          <ol>
            <li>Log in to your member dashboard</li>
            <li>Start with Module 1 of your course</li>
            <li>Download your workbooks</li>
          </ol>

          <p>Remember: Consistency beats intensity. Even 30 minutes a day will transform your business.</p>

          <p>Let's build something amazing together!</p>

          <p style="margin-top: 30px;">
            - Mr NoChill<br>
            <span style="color: #666;">Contentpreneur Hub</span>
          </p>
        </body>
        </html>
      `,
    });
    console.log('[EMAIL] Welcome email sent to:', email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

async function scheduleWelcomeSequence(sql: any, email: string) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await sql`
      INSERT INTO email_sequences (customer_email, sequence_type, email_number, scheduled_for)
      VALUES (${email}, 'welcome', 2, ${tomorrow.toISOString()})
    `;
  } catch (e) {
    console.error('Failed to schedule welcome sequence:', e);
  }
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
    'content-arsenal': 'Content Arsenal Expansion Pack',
    'contentpreneur-book': 'Contentpreneur Book',
  };
  return names[productKey] || productKey;
}
