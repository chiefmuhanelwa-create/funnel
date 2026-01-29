import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple test endpoint to verify API is working
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Check environment variables
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasPaystack = !!process.env.PAYSTACK_SECRET_KEY;

    // Test neon import
    let neonImportOk = false;
    try {
      const { neon } = await import('@neondatabase/serverless');
      neonImportOk = typeof neon === 'function';
    } catch (e) {
      neonImportOk = false;
    }

    // Test drizzle import
    let drizzleImportOk = false;
    try {
      const { drizzle } = await import('drizzle-orm/neon-http');
      drizzleImportOk = typeof drizzle === 'function';
    } catch (e) {
      drizzleImportOk = false;
    }

    // Test schema import
    let schemaImportOk = false;
    let schemaError = null;
    try {
      const schema = await import('../../lib/schema');
      schemaImportOk = !!schema.products && !!schema.orders;
    } catch (e: any) {
      schemaImportOk = false;
      schemaError = e?.message || String(e);
    }

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: {
        hasDatabase,
        hasPaystack,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
      },
      imports: {
        neonImportOk,
        drizzleImportOk,
        schemaImportOk,
        schemaError,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Unknown error',
      stack: error?.stack,
    });
  }
}
