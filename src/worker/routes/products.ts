import { Hono } from 'hono';
import type { Env, Product, CustomerAccess } from '../types';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Env }>();

// GET /api/products - List all active products
app.get('/', async (c) => {
  const db = c.env.DB;

  try {
    const products = await db.prepare(
      'SELECT * FROM products WHERE is_active = 1 ORDER BY price_cents ASC'
    ).all<Product>();

    return c.json({ products: products.results });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// GET /api/products/:productKey - Get single product
app.get('/:productKey', async (c) => {
  const db = c.env.DB;
  const productKey = c.req.param('productKey');

  try {
    const product = await db.prepare(
      'SELECT * FROM products WHERE product_key = ? AND is_active = 1'
    ).bind(productKey).first<Product>();

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// GET /api/products/:productKey/files - Get files for owned product (auth required)
app.get('/:productKey/files', authMiddleware, async (c) => {
  const db = c.env.DB;
  const productKey = c.req.param('productKey');
  const userEmail = c.get('userEmail') as string;

  try {
    // Get product
    const product = await db.prepare(
      'SELECT * FROM products WHERE product_key = ?'
    ).bind(productKey).first<Product>();

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Check access
    const access = await db.prepare(
      'SELECT * FROM customer_access WHERE customer_email = ? AND product_id = ?'
    ).bind(userEmail.toLowerCase().trim(), product.id).first<CustomerAccess>();

    if (!access) {
      return c.json({ error: 'Access denied' }, 403);
    }

    // Get files
    const files = await db.prepare(
      'SELECT * FROM product_files WHERE product_id = ? ORDER BY display_order ASC'
    ).bind(product.id).all();

    return c.json({ files: files.results });
  } catch (error) {
    console.error('Failed to fetch product files:', error);
    return c.json({ error: 'Failed to fetch product files' }, 500);
  }
});

// POST /api/check-access - Check product access by email (fallback auth)
app.post('/check-access', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ email: string }>();

  if (!body.email) {
    return c.json({ error: 'Email is required' }, 400);
  }

  const normalizedEmail = body.email.toLowerCase().trim();

  try {
    const accessRecords = await db.prepare(`
      SELECT ca.*, p.product_key, p.name
      FROM customer_access ca
      JOIN products p ON ca.product_id = p.id
      WHERE ca.customer_email = ?
    `).bind(normalizedEmail).all();

    const productIds = accessRecords.results.map((r: any) => r.product_id);
    const products = accessRecords.results.map((r: any) => ({
      id: r.product_id,
      product_key: r.product_key,
      name: r.name,
    }));

    return c.json({ productIds, products });
  } catch (error) {
    console.error('Failed to check access:', error);
    return c.json({ error: 'Failed to check access' }, 500);
  }
});

export { app as productRoutes };
