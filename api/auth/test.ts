import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check environment variables
    const checks: Record<string, any> = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    };

    // Try database connection
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`SELECT 1 as connected`;
        checks.database = result[0]?.connected === 1 ? 'connected' : 'failed';

        // Check tables exist
        const tables = await sql`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name IN ('customer_access', 'email_verifications', 'products')
        `;
        checks.tables = tables.map((t: any) => t.table_name);
      } catch (err: any) {
        checks.database = `error: ${err.message}`;
      }
    } else {
      checks.database = 'DATABASE_URL not set';
    }

    return res.status(200).json({ status: 'ok', ...checks });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
