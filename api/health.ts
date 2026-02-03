import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const checks: Record<string, { status: string; message?: string; data?: any }> = {};

  // Check environment variables
  checks.database_url = process.env.DATABASE_URL
    ? { status: 'ok', message: 'DATABASE_URL is configured' }
    : { status: 'error', message: 'DATABASE_URL is not set' };

  checks.paystack_key = process.env.PAYSTACK_SECRET_KEY
    ? { status: 'ok', message: 'PAYSTACK_SECRET_KEY is configured' }
    : { status: 'error', message: 'PAYSTACK_SECRET_KEY is not set' };

  checks.resend_key = process.env.RESEND_API_KEY
    ? { status: 'ok', message: 'RESEND_API_KEY is configured' }
    : { status: 'warning', message: 'RESEND_API_KEY is not set (emails will not work)' };

  checks.convertkit_key = process.env.CONVERTKIT_API_KEY
    ? { status: 'ok', message: 'CONVERTKIT_API_KEY is configured' }
    : { status: 'warning', message: 'CONVERTKIT_API_KEY is not set' };

  // Check database connection
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT 1 as connected`;
      checks.database_connection = { status: 'ok', message: 'Database connection successful' };

      // Check if tables exist
      try {
        const tables = await sql`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY table_name
        `;
        const tableNames = tables.map((t: any) => t.table_name);

        const requiredTables = ['products', 'orders', 'order_items', 'customer_access'];
        const missingTables = requiredTables.filter(t => !tableNames.includes(t));

        if (missingTables.length > 0) {
          checks.database_tables = {
            status: 'error',
            message: `Missing tables: ${missingTables.join(', ')}`,
            data: { existing: tableNames, missing: missingTables }
          };
        } else {
          checks.database_tables = {
            status: 'ok',
            message: 'All required tables exist',
            data: { tables: tableNames }
          };
        }
      } catch (tableError: any) {
        checks.database_tables = {
          status: 'error',
          message: `Failed to check tables: ${tableError?.message}`
        };
      }

      // Check if products are seeded
      try {
        const products = await sql`SELECT product_key, name, is_active FROM products ORDER BY id`;
        if (products.length === 0) {
          checks.products_seeded = {
            status: 'error',
            message: 'No products in database. Run seed-products endpoint.'
          };
        } else {
          checks.products_seeded = {
            status: 'ok',
            message: `${products.length} products found`,
            data: products.map((p: any) => ({ key: p.product_key, name: p.name, active: p.is_active }))
          };
        }
      } catch (productError: any) {
        checks.products_seeded = {
          status: 'error',
          message: `Failed to check products: ${productError?.message}`
        };
      }

      // Check customer access count
      try {
        const accessCount = await sql`SELECT COUNT(*) as count FROM customer_access`;
        checks.customer_access = {
          status: 'ok',
          message: `${accessCount[0]?.count || 0} customer access records`
        };
      } catch (accessError: any) {
        checks.customer_access = {
          status: 'warning',
          message: `Failed to check customer access: ${accessError?.message}`
        };
      }

    } catch (dbError: any) {
      checks.database_connection = {
        status: 'error',
        message: `Database connection failed: ${dbError?.message}`
      };
    }
  }

  // Overall status
  const hasErrors = Object.values(checks).some(c => c.status === 'error');
  const hasWarnings = Object.values(checks).some(c => c.status === 'warning');

  return res.status(200).json({
    status: hasErrors ? 'unhealthy' : hasWarnings ? 'degraded' : 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development',
    checks,
    instructions: hasErrors ? {
      database_url: 'Set DATABASE_URL in Vercel environment variables (get from Neon dashboard)',
      seed_products: 'POST to /api/admin/seed-products with X-Admin-Email header',
      push_schema: 'Run: npx drizzle-kit push:pg to create tables',
    } : undefined,
  });
}
