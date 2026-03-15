import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

// Rate limiting for verification attempts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(email, { count: 1, resetAt: now + 300000 }); // 5 minute window
    return true;
  }

  if (entry.count >= 10) return false; // Max 10 attempts per 5 minutes
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

  const { email, code } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!code || typeof code !== 'string' || code.length !== 6) {
    return res.status(400).json({ error: 'Valid 6-digit code is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Rate limiting
  if (!checkRateLimit(normalizedEmail)) {
    return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    // Get verification record
    const records = await sql`
      SELECT code, expires_at, attempts
      FROM email_verifications
      WHERE email = ${normalizedEmail}
    `;

    if (records.length === 0) {
      return res.status(400).json({ error: 'No verification code found. Please request a new one.' });
    }

    const record = records[0];

    // Check if expired
    if (new Date(record.expires_at) < new Date()) {
      await sql`DELETE FROM email_verifications WHERE email = ${normalizedEmail}`;
      return res.status(400).json({ error: 'Code expired. Please request a new one.' });
    }

    // Check attempts
    if (record.attempts >= 5) {
      await sql`DELETE FROM email_verifications WHERE email = ${normalizedEmail}`;
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new code.' });
    }

    // Verify code (timing-safe comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(code),
      Buffer.from(record.code)
    );

    if (!isValid) {
      await sql`
        UPDATE email_verifications
        SET attempts = attempts + 1
        WHERE email = ${normalizedEmail}
      `;
      return res.status(400).json({ error: 'Invalid code. Please try again.' });
    }

    // Code is valid - delete verification record
    await sql`DELETE FROM email_verifications WHERE email = ${normalizedEmail}`;

    // Get user's products
    const products = await sql`
      SELECT p.id, p.product_key, p.name
      FROM customer_access ca
      JOIN products p ON ca.product_id = p.id
      WHERE ca.customer_email = ${normalizedEmail}
    `;

    // Generate a session token (optional - for additional security)
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store session
    await sql`
      INSERT INTO member_sessions (email, token, expires_at)
      VALUES (${normalizedEmail}, ${sessionToken}, ${sessionExpiry.toISOString()})
      ON CONFLICT (email) DO UPDATE SET
        token = ${sessionToken},
        expires_at = ${sessionExpiry.toISOString()}
    `;

    console.log(`[AUTH] User verified: ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      email: normalizedEmail,
      products: products,
      sessionToken,
      expiresAt: sessionExpiry.toISOString()
    });

  } catch (error: any) {
    console.error('[AUTH] Error verifying code:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
