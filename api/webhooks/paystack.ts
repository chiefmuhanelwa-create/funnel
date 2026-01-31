import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// STRICT Product bundles - ONLY these products get unlocked
// starter-kit ($67) = 9-module course + niche-finder + paids-workbook
// contentpreneur-pro = everything
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'content-foundations', 'influencers-code', 'tax-guide', 'niche-finder', 'paids-workbook'],
};

// Product display names for emails
const PRODUCT_NAMES: Record<string, string> = {
  'starter-kit': 'Contentpreneur Starter Kit (9-Module Course)',
  'niche-finder': 'Niche Finder Workbook',
  'paids-workbook': 'PAIDS Framework Workbook',
  'content-foundations': 'Content Foundations Course',
  'influencers-code': "The Influencer's Code eBook",
  'tax-guide': 'Tax Guide for Contentpreneurs',
  'contentpreneur-pro': 'Contentpreneur Pro Bundle',
  'strategy-call': '1:1 Coaching Session',
  'content-arsenal': 'Content Arsenal Pack',
};

// What's included in starter-kit for display
const STARTER_KIT_INCLUDES = [
  'Module 1: What is a Personal Brand',
  'Module 2: Blueprint to Build a Personal Brand',
  'Module 3: The 3Cs Framework',
  'Module 4: SWOT Analysis',
  'Module 5: 3Es Content Idea Formula',
  'Module 6: Understand Social Media Platforms',
  'Module 7: Community Building',
  'Module 8: PAIDS Framework',
  'Module 9: Formula to Create Online Asset',
  'Niche Finder Workbook (PDF)',
  'PAIDS Framework Workbook (PDF)',
  'NoChill Tool Stack Access',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!databaseUrl) {
    console.error('[WEBHOOK] DATABASE_URL not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    // Verify signature if webhook secret is configured
    const signature = req.headers['x-paystack-signature'] as string;

    if (webhookSecret && signature) {
      const rawBody = JSON.stringify(req.body);
      const hash = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');

      if (hash !== signature) {
        console.error('[WEBHOOK] Invalid signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
      console.log('[WEBHOOK] Signature verified');
    } else {
      // No webhook secret configured - verify event with Paystack API instead
      console.log('[WEBHOOK] No webhook secret - verifying via API');

      if (req.body?.data?.reference && paystackSecretKey) {
        const verifyResponse = await fetch(
          `https://api.paystack.co/transaction/verify/${req.body.data.reference}`,
          { headers: { 'Authorization': `Bearer ${paystackSecretKey}` } }
        );
        const verifyData = await verifyResponse.json() as any;

        if (!verifyData.status || verifyData.data?.status !== 'success') {
          console.error('[WEBHOOK] Payment verification failed');
          return res.status(400).json({ error: 'Payment not verified' });
        }
        console.log('[WEBHOOK] Payment verified via API');
      }
    }

    const event = req.body;
    console.log('[WEBHOOK] Event received:', event.event);

    if (event.event === 'charge.success') {
      const sql = neon(databaseUrl);
      const metadata = event.data.metadata || {};

      // Parse metadata
      const orderIdRaw = metadata.order_id;
      const orderNumber = metadata.order_number || 'N/A';
      const productKeysRaw = metadata.product_keys;
      const originalUsdCents = parseInt(metadata.original_usd_cents || '0', 10);
      const exchangeRate = parseFloat(metadata.exchange_rate || '18.5');

      const orderId = typeof orderIdRaw === 'string' ? parseInt(orderIdRaw, 10) : orderIdRaw;

      // Parse product keys - ONLY grant access to what was purchased
      let purchasedProducts: string[] = [];
      if (typeof productKeysRaw === 'string') {
        purchasedProducts = productKeysRaw.split(',').map(k => k.trim()).filter(k => k);
      } else if (Array.isArray(productKeysRaw)) {
        purchasedProducts = productKeysRaw;
      }

      const customerEmail = event.data.customer.email.toLowerCase().trim();
      const amountPaid = event.data.amount; // In ZAR cents

      console.log('[WEBHOOK] Processing:', { orderId, customerEmail, purchasedProducts, amountPaid });

      if (!orderId || isNaN(orderId)) {
        console.error('[WEBHOOK] Invalid order_id:', orderIdRaw);
        return res.status(400).json({ error: 'Invalid order_id' });
      }

      // Update order status
      await sql`
        UPDATE orders
        SET payment_status = 'completed', updated_at = NOW()
        WHERE id = ${orderId}
      `;

      // Get order details
      const orderResult = await sql`
        SELECT id, order_number, customer_email, customer_name, total_amount_cents, currency
        FROM orders WHERE id = ${orderId}
      `;

      if (orderResult.length === 0) {
        console.error('[WEBHOOK] Order not found:', orderId);
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderResult[0];

      // Grant ONLY purchased products + their bundles
      const productsToGrant = new Set<string>();

      for (const productKey of purchasedProducts) {
        productsToGrant.add(productKey);
        // Add bundle items if applicable
        if (PRODUCT_BUNDLES[productKey]) {
          PRODUCT_BUNDLES[productKey].forEach(k => productsToGrant.add(k));
        }
      }

      console.log('[WEBHOOK] Granting access to:', Array.from(productsToGrant));

      // Grant access to each product
      for (const productKey of productsToGrant) {
        try {
          const productResult = await sql`
            SELECT id FROM products WHERE product_key = ${productKey}
          `;

          if (productResult.length === 0) {
            console.log(`[WEBHOOK] Product not found in DB: ${productKey}`);
            continue;
          }

          const productId = productResult[0].id;

          // Check if access already exists
          const existingAccess = await sql`
            SELECT id FROM customer_access
            WHERE customer_email = ${customerEmail} AND product_id = ${productId}
          `;

          if (existingAccess.length > 0) {
            console.log(`[WEBHOOK] Access already exists: ${productKey}`);
            continue;
          }

          // Grant new access
          await sql`
            INSERT INTO customer_access (customer_email, product_id, order_id)
            VALUES (${customerEmail}, ${productId}, ${orderId})
          `;
          console.log(`[WEBHOOK] Granted: ${productKey} -> ${customerEmail}`);
        } catch (err) {
          console.error(`[WEBHOOK] Error granting ${productKey}:`, err);
        }
      }

      // Send order confirmation email with CORRECT content
      await sendOrderConfirmation(sql, {
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        purchasedProducts,
        amountPaidCents: amountPaid,
        currency: 'ZAR',
      });

      console.log('[WEBHOOK] Successfully processed order:', orderId);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error);
    return res.status(500).json({ error: 'Webhook processing failed', message: error?.message });
  }
}

async function sendOrderConfirmation(sql: any, params: {
  orderId: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string | null;
  purchasedProducts: string[];
  amountPaidCents: number;
  currency: string;
}) {
  const { orderId, orderNumber, customerEmail, customerName, purchasedProducts, amountPaidCents, currency } = params;

  // Check if already sent
  try {
    const existing = await sql`
      SELECT id FROM order_emails_sent
      WHERE order_id = ${orderId} AND email_type = 'order_confirmation'
    `;
    if (existing.length > 0) {
      console.log('[EMAIL] Already sent for order:', orderId);
      return;
    }
  } catch (e) {}

  // Format amount
  const formattedAmount = currency === 'ZAR'
    ? `R${(amountPaidCents / 100).toFixed(2)}`
    : `$${(amountPaidCents / 100).toFixed(2)}`;

  // Build product list HTML - show what they actually get
  let productListHtml = '';

  for (const productKey of purchasedProducts) {
    const productName = PRODUCT_NAMES[productKey] || productKey;

    if (productKey === 'starter-kit') {
      // Show full starter kit contents
      productListHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #f59e0b; margin: 0 0 10px 0;">${productName}</h3>
          <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Your complete content business system includes:</p>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            ${STARTER_KIT_INCLUDES.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      productListHtml += `<p style="margin: 5px 0;">✓ ${productName}</p>`;
    }

    // Show bundle items
    if (PRODUCT_BUNDLES[productKey] && productKey !== 'starter-kit') {
      PRODUCT_BUNDLES[productKey].forEach(bundleKey => {
        productListHtml += `<p style="margin: 5px 0; color: #666; font-size: 14px;">  + ${PRODUCT_NAMES[bundleKey] || bundleKey} (included)</p>`;
      });
    }
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">🎉</span>
      </div>
      <h1 style="color: #111; margin: 0; font-size: 24px;">Payment Confirmed!</h1>
      <p style="color: #666; margin: 10px 0 0;">Your content is ready</p>
    </div>

    <p>Hi ${customerName || 'there'},</p>

    <p>Welcome to the contentpreneur movement! Your investment just gave you access to proven systems that have helped build a 3M+ audience.</p>

    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <p style="margin: 0 0 5px; font-size: 14px; color: #666;">Order Number</p>
      <p style="margin: 0 0 15px; font-weight: bold; color: #111;">${orderNumber}</p>

      <p style="margin: 0 0 5px; font-size: 14px; color: #666;">Total Paid</p>
      <p style="margin: 0; font-weight: bold; color: #f59e0b; font-size: 20px;">${formattedAmount}</p>
    </div>

    <div style="margin: 25px 0;">
      <h2 style="color: #111; font-size: 18px; margin: 0 0 15px;">What You Get:</h2>
      ${productListHtml}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://contentpreneurhub.online/members" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: bold; font-size: 16px;">
        Access Your Content →
      </a>
    </div>

    <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>How to login:</strong> Go to the Members area and enter your email: <strong>${customerEmail}</strong>
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #666; font-size: 13px; text-align: center; margin: 0;">
      Questions? Reply to this email or contact info@nochill.co.za
    </p>
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
      to: customerEmail,
      subject: `Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });

    await sql`
      INSERT INTO order_emails_sent (order_id, email_type)
      VALUES (${orderId}, 'order_confirmation')
    `;
    console.log('[EMAIL] Sent confirmation to:', customerEmail);
  } catch (err) {
    console.error('[EMAIL] Failed:', err);
  }
}
