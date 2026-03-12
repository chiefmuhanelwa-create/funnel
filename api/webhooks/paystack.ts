import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { handlePurchaseResend } from '../../lib/resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// PDF Download URLs from Vercel Blob Storage
const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';
const PDF_DOWNLOADS: Record<string, string> = {
  'niche-finder': `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf`,
  'paids-workbook': `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf`,
  'tax-guide': `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf`,
  'influencers-code': `${BLOB_BASE}/books/the-influencer-s-code---cracking-the-secrets-of-personal-branding-and-influence-in-the-digital-age-2WYoudRZpZ5DzSn9rSIncT2QJ7RGZp.pdf`,
};

// COMPLETE Product Configuration with Icons
const PRODUCTS: Record<string, { name: string; icon: string; features?: string[]; accessLink?: string; downloadUrl?: string; isDownload?: boolean }> = {
  'starter-kit': {
    name: 'Contentpreneur Starter Kit',
    icon: '🚀',
    accessLink: '/members/starter-kit',
    features: [
      'Introduction Video',
      'Module 1: What is a Personal Brand',
      'Module 2: Blueprint to Build a Personal Brand',
      'Module 3: The 3Cs Framework - Mindset',
      'Module 4: SWOT Analysis',
      'Module 5: 3Es Content Idea Formula',
      'Module 6: Understand Social Media Platforms',
      'Module 7: Community Building',
      'Module 8: PAIDS Framework',
      'Bonus Module 9: Formula to Create Online Asset',
      'Niche Finder Workbook (PDF)',
      'PAIDS Framework Workbook (PDF)',
      'NoChill Tool Stack Access',
    ],
  },
  'niche-finder': {
    name: 'Niche Finder Workbook',
    icon: '🎯',
    accessLink: '/members',
    downloadUrl: PDF_DOWNLOADS['niche-finder'],
    isDownload: true,
  },
  'paids-workbook': {
    name: 'PAIDS Framework Workbook',
    icon: '💰',
    accessLink: '/members',
    downloadUrl: PDF_DOWNLOADS['paids-workbook'],
    isDownload: true,
  },
  'content-foundations': {
    name: 'Content Foundations Course',
    icon: '📚',
    accessLink: '/members/content-foundations',
    features: ['Module 1: Self Reflection', 'Module 2: SWOT Analysis', 'Module 3: Value Alignment'],
  },
  'influencers-code': {
    name: "The Influencer's Code",
    icon: '📖',
    accessLink: '/members',
    downloadUrl: PDF_DOWNLOADS['influencers-code'],
    isDownload: true,
    features: ['14 Chapters on Monetization', 'The 3Es Formula', 'PAIDS Method', 'DARES Scale System'],
  },
  'tax-guide': {
    name: 'Tax Guide for Contentpreneurs',
    icon: '📋',
    accessLink: '/members',
    downloadUrl: PDF_DOWNLOADS['tax-guide'],
    isDownload: true,
    features: ['Tax Deductions', 'Business Structures', 'SA Tax Laws', 'Legal Protection'],
  },
  'social-media-intro': {
    name: 'Introduction to Social Media',
    icon: '📱',
    accessLink: '/members/social-media-intro',
    features: ['Module 1: Social Media Landscape', 'Module 2: Platform Selection', 'Module 3: Content Creation'],
  },
  'contentpreneur-pro': { name: 'Contentpreneur Pro Bundle', icon: '👑', accessLink: '/members' },
  'contentpreneur-book-ebook': { name: 'Contentpreneur Guide (eBook)', icon: '📱', accessLink: '/members' },
  'contentpreneur-book-hardcopy': { name: 'Contentpreneur Guide (Hardcopy + eBook)', icon: '📚', accessLink: '/members' },
  'content-arsenal': { name: 'Content Arsenal Expansion Pack', icon: '🛠️', accessLink: '/members' },
  'coaching-session': { name: '1:1 Strategy Call', icon: '📞', accessLink: '/consultation' },
};

// Bundle configurations - STRICT: only these products get unlocked
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'content-foundations', 'influencers-code', 'tax-guide', 'niche-finder', 'paids-workbook'],
};

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
      // No webhook secret - verify via Paystack API
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

      const orderId = typeof orderIdRaw === 'string' ? parseInt(orderIdRaw, 10) : orderIdRaw;

      // Parse purchased products
      let purchasedProducts: string[] = [];
      if (typeof productKeysRaw === 'string') {
        purchasedProducts = productKeysRaw.split(',').map(k => k.trim()).filter(k => k);
      } else if (Array.isArray(productKeysRaw)) {
        purchasedProducts = productKeysRaw;
      }

      const customerEmail = event.data.customer.email.toLowerCase().trim();
      const amountPaid = event.data.amount; // ZAR cents

      console.log('[WEBHOOK] Processing:', { orderId, customerEmail, purchasedProducts, amountPaid });

      if (!orderId || isNaN(orderId)) {
        console.error('[WEBHOOK] Invalid order_id:', orderIdRaw);
        return res.status(400).json({ error: 'Invalid order_id' });
      }

      // Update order status
      await sql`UPDATE orders SET payment_status = 'completed', updated_at = NOW() WHERE id = ${orderId}`;

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

      // Calculate ALL products to grant (purchased + bundles)
      const productsToGrant = new Set<string>();
      for (const productKey of purchasedProducts) {
        productsToGrant.add(productKey);
        if (PRODUCT_BUNDLES[productKey]) {
          PRODUCT_BUNDLES[productKey].forEach(k => productsToGrant.add(k));
        }
      }

      console.log('[WEBHOOK] Products to grant:', Array.from(productsToGrant));

      // Grant access to each product
      for (const productKey of productsToGrant) {
        try {
          const productResult = await sql`SELECT id FROM products WHERE product_key = ${productKey}`;
          if (productResult.length === 0) {
            console.log(`[WEBHOOK] Product not in DB: ${productKey}`);
            continue;
          }

          const productId = productResult[0].id;
          const existingAccess = await sql`
            SELECT id FROM customer_access WHERE customer_email = ${customerEmail} AND product_id = ${productId}
          `;

          if (existingAccess.length > 0) {
            console.log(`[WEBHOOK] Already has: ${productKey}`);
            continue;
          }

          await sql`INSERT INTO customer_access (customer_email, product_id, order_id) VALUES (${customerEmail}, ${productId}, ${orderId})`;
          console.log(`[WEBHOOK] Granted: ${productKey}`);
        } catch (err) {
          console.error(`[WEBHOOK] Error granting ${productKey}:`, err);
        }
      }

      // Send order confirmation email
      await sendOrderEmail({
        orderNumber: order.order_number,
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        purchasedProducts,
        allGrantedProducts: Array.from(productsToGrant),
        amountPaidCents: amountPaid,
      });

      // Add to Resend audiences
      try {
        await handlePurchaseResend(
          customerEmail,
          order.customer_name,
          Array.from(productsToGrant)
        );
        console.log('[WEBHOOK] Resend audience integration complete');
      } catch (resendError) {
        // Don't fail the webhook if Resend fails
        console.error('[WEBHOOK] Resend error (non-fatal):', resendError);
      }

      // Schedule welcome sequence emails
      try {
        await scheduleWelcomeSequence(sql, customerEmail);
        console.log('[WEBHOOK] Welcome sequence scheduled');
      } catch (seqError) {
        console.error('[WEBHOOK] Sequence scheduling error (non-fatal):', seqError);
      }

      console.log('[WEBHOOK] Order processed successfully:', orderId);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error);
    return res.status(500).json({ error: 'Webhook failed', message: error?.message });
  }
}

async function sendOrderEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName: string | null;
  purchasedProducts: string[];
  allGrantedProducts: string[];
  amountPaidCents: number;
}) {
  const { orderNumber, customerEmail, customerName, purchasedProducts, allGrantedProducts, amountPaidCents } = params;

  const formattedAmount = `R${(amountPaidCents / 100).toFixed(2)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://funnel-nochill.vercel.app';

  // Build product list HTML with icons
  let productListHtml = '';

  for (const key of purchasedProducts) {
    const product = PRODUCTS[key];
    if (!product) continue;

    const accessUrl = product.accessLink ? `${appUrl}${product.accessLink}` : `${appUrl}/members`;

    productListHtml += `
      <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #f59e0b;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 28px;">${product.icon}</span>
          <h3 style="margin: 0; color: #111; font-size: 18px;">${product.name}</h3>
        </div>
    `;

    if (product.features && product.features.length > 0) {
      productListHtml += `<ul style="margin: 0; padding-left: 20px; color: #444; font-size: 14px;">`;
      for (const feature of product.features) {
        productListHtml += `<li style="margin: 6px 0;">✓ ${feature}</li>`;
      }
      productListHtml += `</ul>`;
    }

    // Add direct access/download link for each product
    productListHtml += `<div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">`;

    // If it's a downloadable PDF, add download button
    if (product.isDownload && product.downloadUrl) {
      productListHtml += `
          <a href="${product.downloadUrl}" style="display: inline-block; background: #10b981; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">
            📥 Download PDF
          </a>
      `;
    }

    // Always add access link
    productListHtml += `
          <a href="${accessUrl}" style="display: inline-block; background: #f59e0b; color: #000; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px;">
            Access ${product.name} →
          </a>
        </div>
    `;

    productListHtml += `</div>`;
  }

  // Show bundled products separately with download links
  const bundledProducts = allGrantedProducts.filter(k => !purchasedProducts.includes(k));
  if (bundledProducts.length > 0) {
    productListHtml += `
      <div style="background: #ecfdf5; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 10px; font-weight: 600; color: #065f46;">🎁 Bonus - Included with your purchase:</p>
    `;
    for (const key of bundledProducts) {
      const product = PRODUCTS[key];
      if (product) {
        productListHtml += `
          <div style="margin: 8px 0; display: flex; align-items: center; gap: 10px;">
            <span>${product.icon} ${product.name}</span>
        `;
        // Add download link for PDFs
        if (product.isDownload && product.downloadUrl) {
          productListHtml += `
            <a href="${product.downloadUrl}" style="background: #10b981; color: #fff; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600;">
              Download
            </a>
          `;
        }
        productListHtml += `</div>`;
      }
    }
    productListHtml += `</div>`;
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h1 style="color: #111; margin: 0; font-size: 26px;">Payment Confirmed!</h1>
      <p style="color: #666; margin: 10px 0 0;">Your content is ready to access</p>
    </div>

    <p style="font-size: 16px;">Hi ${customerName || 'there'},</p>

    <p style="font-size: 16px;">Welcome to the contentpreneur movement! Your investment just gave you access to the exact systems that helped build a 3M+ audience and multiple income streams.</p>

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 5px; font-size: 14px; color: #92400e;">Order Number</p>
      <p style="margin: 0 0 15px; font-weight: bold; color: #78350f; font-size: 16px;">${orderNumber}</p>
      <p style="margin: 0 0 5px; font-size: 14px; color: #92400e;">Total Paid</p>
      <p style="margin: 0; font-weight: bold; color: #78350f; font-size: 28px;">${formattedAmount}</p>
    </div>

    <h2 style="color: #111; font-size: 20px; margin: 30px 0 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
      📦 What You Get
    </h2>

    ${productListHtml}

    <div style="text-align: center; margin: 35px 0;">
      <a href="${appUrl}/members" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        🚀 Access Your Content Now
      </a>
    </div>

    <div style="background: #fef3c7; border: 2px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">🔑 How to Login</h3>
      <ol style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
        <li style="margin: 8px 0;">Go to <a href="${appUrl}/members" style="color: #b45309;">${appUrl}/members</a></li>
        <li style="margin: 8px 0;">Enter your email: <strong>${customerEmail}</strong></li>
        <li style="margin: 8px 0;">Click "Access My Content"</li>
      </ol>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <div style="text-align: center;">
      <p style="color: #666; font-size: 14px; margin: 0 0 10px;">Questions? We're here to help!</p>
      <a href="mailto:info@nochill.co.za" style="color: #f59e0b; font-weight: 600;">info@nochill.co.za</a>
    </div>

    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
      © 2026 NOCHILL PTY LTD. All rights reserved.
    </p>
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
      to: customerEmail,
      subject: `🎉 Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });
    console.log('[EMAIL] Sent to:', customerEmail);
  } catch (err) {
    console.error('[EMAIL] Failed:', err);
  }
}

/**
 * Schedule welcome sequence emails for a new customer
 */
async function scheduleWelcomeSequence(sql: any, email: string) {
  const schedules = [
    { days: 1, emailNumber: 1 },
    { days: 2, emailNumber: 2 },
    { days: 3, emailNumber: 3 },
    { days: 7, emailNumber: 7 },
    { days: 14, emailNumber: 14 },
    { days: 21, emailNumber: 21 },
    { days: 30, emailNumber: 30 },
  ];

  for (const schedule of schedules) {
    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + schedule.days);

    await sql`
      INSERT INTO email_sequences (
        customer_email,
        sequence_type,
        email_number,
        scheduled_for,
        is_sent
      )
      VALUES (
        ${email},
        'welcome',
        ${schedule.emailNumber},
        ${scheduledFor.toISOString()},
        false
      )
      ON CONFLICT DO NOTHING
    `;
  }

  console.log(`[WEBHOOK] Scheduled ${schedules.length} welcome emails for ${email}`);
}
