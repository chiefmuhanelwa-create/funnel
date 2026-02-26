import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PRODUCTS: Record<string, { name: string; price: string; url: string }> = {
  'starter-kit': { name: 'Contentpreneur Starter Kit', price: '$67', url: '/contentpreneur-starter-kit' },
  'influencers-code': { name: "The Influencer's Code", price: '$19', url: '/checkout/influencers-code' },
  'niche-finder': { name: 'Niche Finder Workbook', price: '$17', url: '/checkout/niche-finder' },
  'paids-workbook': { name: 'PAIDS Framework Workbook', price: '$17', url: '/checkout/paids-workbook' },
  'tax-guide': { name: 'Tax Guide for Contentpreneurs', price: '$47', url: '/checkout/tax-guide' },
  'content-foundations': { name: 'Content Foundations Course', price: '$37', url: '/checkout/content-foundations' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET (Vercel cron format)
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return res.status(500).json({ error: 'Database not configured' });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://www.contentpreneurhub.online';

  const sql = neon(databaseUrl);

  let sentCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];

  try {
    // Find carts abandoned > 1 hour ago, not yet recovered, recovery email not sent
    const abandoned = await sql`
      SELECT *
      FROM abandoned_carts
      WHERE updated_at <= NOW() - INTERVAL '1 hour'
        AND recovery_email_sent = false
        AND recovered = false
      ORDER BY updated_at ASC
      LIMIT 50
    `;

    for (const cart of abandoned) {
      try {
        // Parse first product key from the stored list
        const productKeys: string[] = cart.product_keys
          ? cart.product_keys.split(',').map((k: string) => k.trim())
          : [];
        const primaryKey = productKeys[0];
        const product = PRODUCTS[primaryKey];
        const customerEmail = cart.customer_email as string;

        if (!product || !customerEmail) {
          skippedCount++;
          continue;
        }

        // Send abandonment recovery email
        await resend.emails.send({
          from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
          to: customerEmail,
          subject: `⏰ You left ${product.name} in your cart`,
          html: buildRecoveryEmail({ email: customerEmail, product, appUrl }),
        });

        // Mark recovery email sent
        await sql`
          UPDATE abandoned_carts
          SET recovery_email_sent = true,
              updated_at = NOW()
          WHERE id = ${cart.id}
        `;

        // Add to ConvertKit abandoned cart sequence
        const ckApiKey = process.env.CONVERTKIT_API_KEY;
        const ckFormId = process.env.CONVERTKIT_FORM_ID;
        const ckTagAbandoned = process.env.CONVERTKIT_TAG_ABANDONED_CART;

        if (ckApiKey && ckFormId) {
          const tags = ckTagAbandoned ? [parseInt(ckTagAbandoned)] : [];
          await fetch(`https://api.convertkit.com/v3/forms/${ckFormId}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: ckApiKey,
              email: customerEmail,
              tags,
              fields: { abandoned_product: primaryKey, source: 'cron_abandoned_cart' },
            }),
          }).catch((err) => console.error('[CRON] ConvertKit error:', err));
        }

        sentCount++;
        console.log(`[CRON] Recovery email sent to ${customerEmail}`);
      } catch (cartError: unknown) {
        const msg = cartError instanceof Error ? cartError.message : 'Unknown error';
        errors.push(`${cart.customer_email}: ${msg}`);
        console.error('[CRON] Error processing cart:', msg);
      }
    }

    return res.status(200).json({
      success: true,
      processed: abandoned.length,
      sent: sentCount,
      skipped: skippedCount,
      errors,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CRON] Abandoned cart cron failed:', message);
    return res.status(500).json({ error: message });
  }
}

function buildRecoveryEmail({
  email,
  product,
  appUrl,
}: {
  email: string;
  product: { name: string; price: string; url: string };
  appUrl: string;
}): string {
  const recoveryUrl = `${appUrl}${product.url}?ref=cart_recovery&email=${encodeURIComponent(email)}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;background:#f3f4f6;">
  <div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#111;margin:0;font-size:26px;">You Left Something Behind!</h1>
    </div>

    <p style="font-size:16px;">Hey,</p>
    <p style="font-size:16px;">
      You were this close to getting <strong>${product.name}</strong> —
      and you still can. Your spot is still here.
    </p>

    <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:25px;margin:25px 0;text-align:center;">
      <p style="margin:0 0 8px;font-size:22px;font-weight:bold;color:#111;">${product.name}</p>
      <p style="margin:0 0 20px;font-size:28px;font-weight:bold;color:#d97706;">${product.price}</p>
      <a href="${recoveryUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:bold;font-size:16px;">
        Complete My Order →
      </a>
    </div>

    <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:25px 0;">
      <h3 style="margin:0 0 10px;color:#374151;font-size:16px;">What you get:</h3>
      <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;">
        <li style="margin:8px 0;">Instant digital access</li>
        <li style="margin:8px 0;">Lifetime updates included</li>
        <li style="margin:8px 0;">30-day money-back guarantee</li>
      </ul>
    </div>

    <p style="font-size:16px;">
      Had any issues during checkout? Just reply and I'll sort it out personally.
    </p>
    <p style="font-size:16px;">— Mr. NoChill</p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
    <p style="color:#9ca3af;font-size:12px;text-align:center;">
      You're receiving this because you started checkout on contentpreneurhub.online<br>
      © 2026 NOCHILL PTY LTD. All rights reserved.
    </p>
  </div>
</body>
</html>`;
}
