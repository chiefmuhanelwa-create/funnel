import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ConvertKit configuration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const CONVERTKIT_TAG_ABANDONED = process.env.CONVERTKIT_TAG_ABANDONED_CART || '';

// Product configurations for abandonment emails
const PRODUCTS: Record<string, { name: string; price: string; discount: string; url: string }> = {
  'starter-kit': { name: 'Contentpreneur Starter Kit', price: 'R699', discount: '10% OFF', url: '/checkout/starter-kit' },
  'influencers-code': { name: "The Influencer's Code", price: 'R249', discount: '10% OFF', url: '/checkout/influencers-code' },
  'niche-finder': { name: 'Niche Finder Workbook', price: 'R199', discount: 'Special Offer', url: '/checkout/niche-finder' },
  'paids-workbook': { name: 'PAIDS Framework Workbook', price: 'R199', discount: 'Special Offer', url: '/checkout/paids-workbook' },
  'tax-guide': { name: 'Tax Guide for Contentpreneurs', price: 'R449', discount: '10% OFF', url: '/checkout/tax-guide' },
  'content-foundations': { name: 'Content Foundations Course', price: 'R399', discount: '10% OFF', url: '/checkout/content-foundations' },
  'content-arsenal': { name: 'Content Arsenal Pack', price: 'R399', discount: '10% OFF', url: '/checkout/content-arsenal' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { email, productKey, action, metadata } = req.body;

    if (!email || !productKey || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sql = neon(databaseUrl);

    // Check if this is an abandoned cart or checkout completion
    if (action === 'checkout_started') {
      // Track that user started checkout
      await sql`
        INSERT INTO cart_tracking (email, product_key, status, metadata, created_at)
        VALUES (${normalizedEmail}, ${productKey}, 'started', ${JSON.stringify(metadata || {})}, NOW())
        ON CONFLICT (email, product_key)
        DO UPDATE SET status = 'started', metadata = ${JSON.stringify(metadata || {})}, updated_at = NOW()
      `;

      console.log('[CART] Checkout started:', normalizedEmail, productKey);
    } else if (action === 'checkout_completed') {
      // Mark as completed (not abandoned)
      await sql`
        UPDATE cart_tracking
        SET status = 'completed', updated_at = NOW()
        WHERE email = ${normalizedEmail} AND product_key = ${productKey}
      `;

      console.log('[CART] Checkout completed:', normalizedEmail, productKey);
    } else if (action === 'checkout_abandoned') {
      // Mark as abandoned for follow-up
      await sql`
        UPDATE cart_tracking
        SET status = 'abandoned', updated_at = NOW()
        WHERE email = ${normalizedEmail} AND product_key = ${productKey} AND status = 'started'
      `;

      console.log('[CART] Checkout abandoned:', normalizedEmail, productKey);

      // Trigger ConvertKit abandoned cart sequence
      if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
        try {
          const tags = CONVERTKIT_TAG_ABANDONED ? [parseInt(CONVERTKIT_TAG_ABANDONED)] : [];
          await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: CONVERTKIT_API_KEY,
              email: normalizedEmail,
              tags,
              fields: {
                abandoned_product: productKey,
                source: 'abandoned_cart',
              },
            }),
          });
          console.log('[CART] Added to ConvertKit abandoned sequence');
        } catch (ckError) {
          console.error('[CART] ConvertKit sync failed:', ckError);
        }
      }

      // Send immediate abandonment recovery email
      const product = PRODUCTS[productKey];
      if (product) {
        await sendAbandonmentEmail(normalizedEmail, product);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[CART] Error:', error);
    return res.status(500).json({ error: 'Failed to track cart' });
  }
}

async function sendAbandonmentEmail(
  email: string,
  product: { name: string; price: string; discount: string; url: string }
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentpreneurhub.online';

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject: `⏰ Your cart is waiting! ${product.discount}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
      <h1 style="color: #111; margin: 0; font-size: 26px;">You Left Something Behind!</h1>
    </div>

    <p style="font-size: 16px;">Hey there,</p>

    <p style="font-size: 16px;">I noticed you were checking out <strong>${product.name}</strong> but didn't complete your purchase. No worries — happens to the best of us!</p>

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 5px; font-size: 14px; color: #92400e; font-weight: bold;">${product.discount}</p>
      <p style="margin: 0 0 15px; font-size: 20px; color: #78350f; font-weight: bold;">${product.name}</p>
      <p style="margin: 0 0 20px; font-size: 28px; font-weight: bold; color: #111;">${product.price}</p>
      <a href="${appUrl}${product.url}?recovered=true" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        Complete My Order →
      </a>
    </div>

    <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <h3 style="margin: 0 0 10px; color: #374151; font-size: 16px;">💡 What you'll get:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
        <li style="margin: 8px 0;">Instant digital access (no waiting!)</li>
        <li style="margin: 8px 0;">Lifetime updates included</li>
        <li style="margin: 8px 0;">30-day money-back guarantee</li>
      </ul>
    </div>

    <p style="font-size: 16px;">If you had any questions or ran into issues during checkout, just reply to this email and I'll personally help you out.</p>

    <p style="font-size: 16px;">To your success,<br><strong>Mr. NoChill</strong></p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      You're receiving this because you started checkout on contentpreneurhub.online<br>
      © 2026 NOCHILL PTY LTD. All rights reserved.
    </p>
  </div>
</body>
</html>
      `,
    });
    console.log('[CART] Abandonment email sent to:', email);
  } catch (error) {
    console.error('[CART] Failed to send abandonment email:', error);
  }
}
