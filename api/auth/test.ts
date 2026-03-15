import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check environment variables
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  };

  // Try database connection
  let dbStatus = 'not tested';
  if (process.env.DATABASE_URL) {
    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT 1 as connected`;
      dbStatus = result[0]?.connected === 1 ? 'connected' : 'failed';

      // Check tables exist
      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('customer_access', 'email_verifications', 'products')
      `;
      (checks as any).tables = tables.map((t: any) => t.table_name);
    } catch (err: any) {
      dbStatus = `error: ${err.message}`;
    }
  }

  return res.status(200).json({
    status: 'ok',
    ...checks,
    database: dbStatus,
  });
}
