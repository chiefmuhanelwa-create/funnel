import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { getProductsToGrant } from '../../lib/bundles';

const resend = new Resend(process.env.RESEND_API_KEY);

// COMPLETE Product Configuration with Icons
const PRODUCTS: Record<string, { name: string; icon: string; features?: string[] }> = {
  'starter-kit': {
    name: 'Contentpreneur Starter Kit',
    icon: '🚀',
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
      'NoChill Tool Stack Access',
    ],
  },
  'niche-finder': { name: 'Niche Finder Workbook', icon: '🎯' },
  'paids-workbook': { name: 'PAIDS Framework Workbook', icon: '💰' },
  'content-foundations': {
    name: 'Content Foundations Course',
    icon: '📚',
    features: ['Module 1: Self Reflection', 'Module 2: SWOT Analysis', 'Module 3: Value Alignment'],
  },
  'influencers-code': {
    name: "The Influencer's Code",
    icon: '📖',
    features: ['14 Chapters on Monetization', 'The 3Es Formula', 'PAIDS Method', 'DARES Scale System'],
  },
  'tax-guide': {
    name: 'Tax Guide for Contentpreneurs',
    icon: '📋',
    features: ['Tax Deductions', 'Business Structures', 'SA Tax Laws', 'Legal Protection'],
  },
  'contentpreneur-pro': { name: 'Contentpreneur Pro Bundle', icon: '👑' },
  'contentpreneur-book-ebook': { name: 'Contentpreneur Guide (eBook)', icon: '📱' },
  'contentpreneur-book-hardcopy': { name: 'Contentpreneur Guide (Hardcopy + eBook)', icon: '📚' },
  'content-arsenal': { name: 'Content Arsenal Expansion Pack', icon: '🛠️' },
  'coaching-session': { name: '1:1 Strategy Call', icon: '📞' },
};

// Product bundles imported from lib/bundles.ts (single source of truth)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Reference is required' });
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json() as {
      status: boolean;
      data: {
        status: string;
        amount: number;
        customer: { email: string };
        metadata: { order_id: number; order_number: string; product_keys: string };
      };
    };

    if (!paystackData.status) {
      return res.status(400).json({ error: 'Failed to verify payment' });
    }

    const paymentStatus = paystackData.data.status === 'success' ? 'completed' : 'pending';
    const sql = neon(databaseUrl);

    // Get order
    const orderResult = await sql`
      SELECT id, order_number, payment_status, total_amount_cents, currency, customer_email
      FROM orders
      WHERE paystack_reference = ${reference}
    `;

    if (orderResult.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult[0];

    // Update order status if payment successful
    if (paymentStatus === 'completed' && order.payment_status !== 'completed') {
      await sql`
        UPDATE orders
        SET payment_status = 'completed', updated_at = NOW()
        WHERE id = ${order.id}
      `;

      // BACKUP ACCESS GRANT: If webhook failed, grant access here
      console.log('[VERIFY] Payment successful - checking if access needs to be granted');

      const customerEmail = (order.customer_email || paystackData.data.customer.email).toLowerCase().trim();

      // Get order items to determine what products were purchased
      const orderItems = await sql`
        SELECT product_key FROM order_items WHERE order_id = ${order.id}
      `;

      const purchasedProducts = orderItems.map((item: any) => item.product_key);

      // Calculate all products to grant (including bundles)
      const productsToGrant = new Set<string>();
      const allProductsToGrant = getProductsToGrant(purchasedProducts);
      allProductsToGrant.forEach(k => productsToGrant.add(k));

      console.log('[VERIFY] Products to grant:', Array.from(productsToGrant));

      // Grant access to each product (skip if already exists)
      let accessGranted = 0;
      for (const productKey of productsToGrant) {
        try {
          const productResult = await sql`SELECT id FROM products WHERE product_key = ${productKey}`;
          if (productResult.length === 0) {
            console.log(`[VERIFY] Product not in DB: ${productKey}`);
            continue;
          }

          const productId = productResult[0].id;

          // Check if access already exists
          const existingAccess = await sql`
            SELECT id FROM customer_access
            WHERE customer_email = ${customerEmail} AND product_id = ${productId}
          `;

          if (existingAccess.length > 0) {
            console.log(`[VERIFY] Already has access: ${productKey}`);
            continue;
          }

          // Grant new access
          await sql`
            INSERT INTO customer_access (customer_email, product_id, order_id)
            VALUES (${customerEmail}, ${productId}, ${order.id})
          `;
          console.log(`[VERIFY] Granted access: ${productKey}`);
          accessGranted++;
        } catch (err) {
          console.error(`[VERIFY] Error granting ${productKey}:`, err);
        }
      }

      if (accessGranted > 0) {
        console.log(`[VERIFY] Backup access grant: ${accessGranted} products granted`);

        // Send order confirmation email (backup - if webhook didn't send it)
        await sendOrderEmail({
          sql,
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail,
          customerName: null, // We don't have name in order
          purchasedProducts,
          allGrantedProducts: Array.from(productsToGrant),
          amountPaidCents: order.total_amount_cents,
        });
      }
    }

    // Get order items for response
    const orderItems = await sql`
      SELECT oi.product_key, oi.price_cents, p.name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
    `;

    const items = orderItems.map((item: any) => ({
      item_id: item.product_key,
      item_name: item.name || item.product_key,
      price: item.price_cents / 100,
    }));

    return res.status(200).json({
      success: paymentStatus === 'completed',
      order: {
        order_number: order.order_number,
        payment_status: paymentStatus,
        total_amount_cents: order.total_amount_cents,
        currency: order.currency,
      },
      items,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
}

async function sendOrderEmail(params: {
  sql: any;
  orderId: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string | null;
  purchasedProducts: string[];
  allGrantedProducts: string[];
  amountPaidCents: number;
}) {
  const { sql, orderId, orderNumber, customerEmail, customerName, purchasedProducts, allGrantedProducts, amountPaidCents } = params;

  const formattedAmount = `R${(amountPaidCents / 100).toFixed(2)}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentpreneurhub.online';

  // Build product list HTML with icons
  let productListHtml = '';

  for (const key of purchasedProducts) {
    const product = PRODUCTS[key];
    if (!product) continue;

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

    productListHtml += `</div>`;
  }

  // Show bundled products separately
  const bundledProducts = allGrantedProducts.filter(k => !purchasedProducts.includes(k));
  if (bundledProducts.length > 0) {
    productListHtml += `
      <div style="background: #ecfdf5; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0 0 10px; font-weight: 600; color: #065f46;">🎁 Bonus - Included with your purchase:</p>
        <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px;">
    `;
    for (const key of bundledProducts) {
      const product = PRODUCTS[key];
      if (product) {
        productListHtml += `<li style="margin: 6px 0;">${product.icon} ${product.name}</li>`;
      }
    }
    productListHtml += `</ul></div>`;
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

  const subject = `🎉 Order Confirmed - ${orderNumber}`;

  // Store email in database for admin viewing
  try {
    await sql`
      INSERT INTO sent_emails (
        order_id,
        customer_email,
        customer_name,
        email_type,
        subject,
        products_purchased,
        products_granted,
        amount_paid_cents,
        currency,
        email_html
      ) VALUES (
        ${orderId},
        ${customerEmail},
        ${customerName},
        'order_confirmation',
        ${subject},
        ${purchasedProducts},
        ${allGrantedProducts},
        ${amountPaidCents},
        'ZAR',
        ${emailHtml}
      )
    `;
    console.log('[VERIFY EMAIL] Stored in database for:', customerEmail);
  } catch (err) {
    console.error('[VERIFY EMAIL] Failed to store in database:', err);
    // Don't fail - continue to send email
  }

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
      to: customerEmail,
      subject,
      html: emailHtml,
    });
    console.log('[VERIFY EMAIL] Sent to:', customerEmail);
  } catch (err) {
    console.error('[VERIFY EMAIL] Failed:', err);
  }
}
