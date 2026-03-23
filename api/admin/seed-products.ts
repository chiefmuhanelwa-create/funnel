import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

// All products that need to be in the database
// IMPORTANT: All prices are in ZAR CENTS (e.g., 69900 = R699.00)
const PRODUCTS_TO_SEED = [
  {
    product_key: 'starter-kit',
    name: '9-Module Personal Branding Course',
    description: 'Complete system to build and monetize your personal brand with 9 video modules, workbooks, and the NoChill Tool Stack.',
    price_cents: 69900, // R699.00
  },
  {
    product_key: 'content-foundations',
    name: 'Content Foundations Course',
    description: 'Master content creation fundamentals with 3 comprehensive video modules.',
    price_cents: 39900, // R399.00
  },
  {
    product_key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'Bestselling eBook with 6,000+ copies sold. 14 chapters on content monetization.',
    price_cents: 19900, // R199.00
  },
  {
    product_key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'Essential tax strategies and legal protection for South African content creators.',
    price_cents: 44900, // R449.00
  },
  {
    product_key: 'niche-finder',
    name: 'Niche Clarity Workbook',
    description: 'The guided workbook that finds your niche from what you\'ve already lived. 7 steps. 90 minutes.',
    price_cents: 19700, // R197.00
  },
  {
    product_key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    description: 'Master the PAIDS monetization framework to build 5 income streams.',
    price_cents: 29700, // R297.00
  },
  {
    product_key: 'contentpreneur-pro',
    name: 'Contentpreneur Pro Bundle',
    description: 'The complete system: Everything you need from mindset to monetization.',
    price_cents: 129900, // R1,299.00
  },
  {
    product_key: 'strategy-call',
    name: '1:1 Coaching Session',
    description: '60-minute personalized strategy call with Mr. NoChill.',
    price_cents: 499900, // R4,999.00
  },
  {
    product_key: 'content-arsenal',
    name: 'Content Arsenal Expansion Pack',
    description: '100+ templates, swipe files, and tools to streamline your content creation.',
    price_cents: 39900, // R399.00
  },
  {
    product_key: 'contentpreneur-book',
    name: 'Contentpreneur Guide (eBook)',
    description: 'The definitive guide to building a profitable content business.',
    price_cents: 29900, // R299.00
  },
  {
    product_key: 'contentpreneur-book-ebook',
    name: 'Contentpreneur Guide (eBook)',
    description: 'The definitive digital guide to building a profitable content business.',
    price_cents: 24900, // R249.00 (contentpreneur book stays at R249)
  },
  {
    product_key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur Guide (Hardcopy + eBook)',
    description: 'Physical book + eBook. Free shipping in South Africa.',
    price_cents: 39900, // R399.00
  },
  {
    product_key: 'coaching-session',
    name: '1:1 Strategy Call',
    description: '60-minute personalized strategy session with Mr. NoChill.',
    price_cents: 499900, // R4,999.00
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authorization
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    // First, check what products already exist
    const existingProducts = await sql`SELECT product_key FROM products`;
    const existingKeys = new Set(existingProducts.map((p: any) => p.product_key));

    let seeded = 0;
    let updated = 0;

    for (const product of PRODUCTS_TO_SEED) {
      if (existingKeys.has(product.product_key)) {
        // Update existing product with correct price and details
        await sql`
          UPDATE products
          SET name = ${product.name},
              description = ${product.description},
              price_cents = ${product.price_cents},
              is_active = true
          WHERE product_key = ${product.product_key}
        `;
        updated++;
        continue;
      }

      await sql`
        INSERT INTO products (product_key, name, description, price_cents, is_active)
        VALUES (${product.product_key}, ${product.name}, ${product.description}, ${product.price_cents}, true)
      `;
      seeded++;
    }

    // Also verify the products table has all needed products
    const allProducts = await sql`SELECT id, product_key, name FROM products ORDER BY id`;

    return res.status(200).json({
      success: true,
      message: `Seeded ${seeded} new products, updated ${updated} existing products with correct prices`,
      products: allProducts,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Failed to seed products', details: error?.message });
  }
}
