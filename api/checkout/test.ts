import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Enhanced diagnostic endpoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const diagnostics: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {},
    database: {},
    products: {},
    paystack: {},
    exchangeRate: {},
  };

  try {
    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL;
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;

    diagnostics.env = {
      hasDatabase: !!databaseUrl,
      hasPaystack: !!paystackKey,
      paystackKeyPrefix: paystackKey ? paystackKey.substring(0, 8) + '...' : null,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    };

    // Test database connection and products
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);

        // Test simple query
        const testResult = await sql`SELECT 1 as test`;
        diagnostics.database.connectionOk = testResult[0]?.test === 1;

        // Check products table
        const products = await sql`
          SELECT product_key, name, price_cents, is_active
          FROM products
          ORDER BY product_key
        `;
        diagnostics.products.count = products.length;
        diagnostics.products.list = products.map((p: any) => ({
          key: p.product_key,
          name: p.name,
          priceCents: p.price_cents,
          active: p.is_active,
        }));

        // Check for expected product keys
        const expectedKeys = ['starter-kit', 'content-foundations', 'niche-finder', 'paids-workbook', 'influencers-code'];
        const existingKeys = products.map((p: any) => p.product_key);
        diagnostics.products.missingKeys = expectedKeys.filter(k => !existingKeys.includes(k));
        diagnostics.products.hasStarterKit = existingKeys.includes('starter-kit');

        // Check orders table structure
        try {
          const ordersCheck = await sql`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'orders'
          `;
          diagnostics.database.ordersColumns = ordersCheck.map((c: any) => c.column_name);
        } catch (e: any) {
          diagnostics.database.ordersColumnsError = e.message;
        }

      } catch (e: any) {
        diagnostics.database.connectionOk = false;
        diagnostics.database.error = e.message;
      }
    }

    // Test exchange rate API
    try {
      const rateResponse = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR');
      const rateData = await rateResponse.json() as any;
      diagnostics.exchangeRate.success = true;
      diagnostics.exchangeRate.rate = rateData.rates?.ZAR;
    } catch (e: any) {
      diagnostics.exchangeRate.success = false;
      diagnostics.exchangeRate.error = e.message;
    }

    // Test Paystack API (just check if key works)
    if (paystackKey) {
      try {
        const paystackResponse = await fetch('https://api.paystack.co/balance', {
          headers: { 'Authorization': `Bearer ${paystackKey}` },
        });
        const paystackData = await paystackResponse.json() as any;
        diagnostics.paystack.keyValid = paystackData.status === true;
        diagnostics.paystack.message = paystackData.message;
      } catch (e: any) {
        diagnostics.paystack.keyValid = false;
        diagnostics.paystack.error = e.message;
      }
    }

    return res.status(200).json(diagnostics);

  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.error = error?.message || 'Unknown error';
    return res.status(500).json(diagnostics);
  }
}
