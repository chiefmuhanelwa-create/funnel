import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check if user has any purchases
    const purchases = await sql`
      SELECT COUNT(*) as count
      FROM customer_access
      WHERE customer_email = ${normalizedEmail}
    `;

    if (!purchases[0] || purchases[0].count === 0) {
      // Don't reveal if email exists - just say we sent it
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentpreneurhub.online';

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

    console.log(`[AUTH] Magic link sent to ${normalizedEmail}`);

    return res.status(200).json({
      message: 'Verification code sent to your email.',
      sent: true
    });

  } catch (error: any) {
    console.error('[AUTH] Error sending magic link:', error);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
}
