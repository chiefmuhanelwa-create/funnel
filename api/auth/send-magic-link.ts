import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import crypto from 'crypto';

// Product bundles for auto-repair
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': [
    'starter-kit',
    'content-foundations',
    'influencers-code',
    'tax-guide',
    'niche-finder',
    'paids-workbook',
  ],
};

function getProductsToGrant(purchasedProductKeys: string[]): string[] {
  const productsToGrant = new Set<string>();
  for (const productKey of purchasedProductKeys) {
    productsToGrant.add(productKey);
    const bundledProducts = PRODUCT_BUNDLES[productKey];
    if (bundledProducts) {
      bundledProducts.forEach(key => productsToGrant.add(key));
    }
  }
  return Array.from(productsToGrant);
}

// Lazy load Resend to avoid crashes if API key is missing
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.error('[AUTH] RESEND_API_KEY not configured');
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (entry.count >= 3) return false; // Max 3 attempts per minute
  entry.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Rate limiting
  if (!checkRateLimit(normalizedEmail)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    // Check if user has any purchases in customer_access
    let purchases = await sql`
      SELECT COUNT(*) as count
      FROM customer_access
      WHERE customer_email = ${normalizedEmail}
    `;

    // If no access records found, check for completed orders and auto-repair
    if (!purchases[0] || purchases[0].count === 0) {
      console.log(`[AUTH] No access records for ${normalizedEmail}, checking for completed orders...`);

      // Check if there are completed orders for this email
      const completedOrders = await sql`
        SELECT o.id as order_id, o.order_number,
               array_agg(oi.product_key) as product_keys
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.payment_status = 'completed'
          AND o.customer_email = ${normalizedEmail}
        GROUP BY o.id, o.order_number
      `;

      if (completedOrders.length > 0) {
        console.log(`[AUTH] Found ${completedOrders.length} completed orders for ${normalizedEmail}, auto-repairing access...`);

        // Auto-repair: grant access for all products from completed orders
        for (const order of completedOrders) {
          const purchasedProducts = order.product_keys || [];
          const allProductsToGrant = getProductsToGrant(purchasedProducts);

          for (const productKey of allProductsToGrant) {
            try {
              // First ensure product exists
              const productResult = await sql`
                SELECT id FROM products WHERE product_key = ${productKey}
              `;

              if (productResult.length === 0) {
                // Create product if it doesn't exist
                await sql`
                  INSERT INTO products (product_key, name, price_cents, is_active, level)
                  VALUES (${productKey}, ${productKey}, 0, true, 'all')
                  ON CONFLICT (product_key) DO NOTHING
                `;
              }

              const productId = (await sql`SELECT id FROM products WHERE product_key = ${productKey}`)[0]?.id;
              if (!productId) continue;

              // Grant access if not already exists
              await sql`
                INSERT INTO customer_access (customer_email, product_id, order_id)
                VALUES (${normalizedEmail}, ${productId}, ${order.order_id})
                ON CONFLICT (customer_email, product_id) DO NOTHING
              `;
            } catch (grantError) {
              console.error(`[AUTH] Error granting ${productKey}:`, grantError);
            }
          }
        }

        // Re-check access count after repair
        purchases = await sql`
          SELECT COUNT(*) as count
          FROM customer_access
          WHERE customer_email = ${normalizedEmail}
        `;
        console.log(`[AUTH] After repair, ${normalizedEmail} has ${purchases[0]?.count || 0} access records`);
      }
    }

    if (!purchases[0] || purchases[0].count === 0) {
      // No purchases found even after repair attempt
      return res.status(200).json({
        message: 'If you have purchases with this email, you will receive a verification code.',
        sent: false
      });
    }

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store verification code
    await sql`
      INSERT INTO email_verifications (email, code, expires_at)
      VALUES (${normalizedEmail}, ${verificationCode}, ${expiresAt.toISOString()})
      ON CONFLICT (email) DO UPDATE SET
        code = ${verificationCode},
        expires_at = ${expiresAt.toISOString()},
        attempts = 0
    `;

    // Send email with code
    const resend = getResend();
    if (!resend) {
      return res.status(500).json({ error: 'Email service not configured. Please contact support.' });
    }

    try {
      await resend.emails.send({
        from: 'Contentpreneur Hub <noreply@contentpreneurhub.online>',
        to: normalizedEmail,
        subject: 'Your Login Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #f59e0b; margin: 0;">Contentpreneur Hub</h1>
            </div>

            <div style="background: #f9fafb; border-radius: 12px; padding: 30px; text-align: center;">
              <h2 style="margin: 0 0 20px;">Your Verification Code</h2>
              <p style="margin: 0 0 20px; color: #666;">
                Enter this code to access your member area:
              </p>
              <div style="background: #fff; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111;">
                  ${verificationCode}
                </span>
              </div>
              <p style="margin: 0; color: #999; font-size: 14px;">
                This code expires in 15 minutes.
              </p>
            </div>

            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
              <p>If you didn't request this code, you can safely ignore this email.</p>
              <p>© ${new Date().getFullYear()} Contentpreneur Hub</p>
            </div>
          </body>
          </html>
        `,
      });
      console.log(`[AUTH] Verification code sent to ${normalizedEmail}`);
    } catch (emailError: any) {
      console.error('[AUTH] Resend email error:', emailError?.message || emailError);
      return res.status(500).json({
        error: 'Failed to send email. Please try again or contact support.',
        details: emailError?.message
      });
    }

    return res.status(200).json({
      message: 'Verification code sent to your email.',
      sent: true
    });

  } catch (error: any) {
    console.error('[AUTH] Error:', error?.message || error);

    // Check for specific errors
    if (error?.message?.includes('email_verifications')) {
      return res.status(500).json({
        error: 'Database table missing. Please run migrations.',
        details: 'email_verifications table not found'
      });
    }

    return res.status(500).json({
      error: 'Failed to send verification code',
      details: error?.message
    });
  }
}
