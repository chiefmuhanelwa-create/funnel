import { Hono } from 'hono';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Env }>();

// Simple token creation (base64 encoded JSON)
function createToken(email: string, name: string): string {
  const payload = {
    email: email.toLowerCase().trim(),
    name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload)) + '.sig';
}

// POST /api/auth/login - Email-based login (lookup by purchase email)
app.post('/login', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ email: string }>();

  if (!body.email) {
    return c.json({ error: 'Email is required' }, 400);
  }

  const normalizedEmail = body.email.toLowerCase().trim();

  try {
    // Check if user has any purchases or is a subscriber
    const hasAccess = await db.prepare(`
      SELECT DISTINCT customer_email FROM (
        SELECT customer_email FROM orders WHERE customer_email = ? AND payment_status = 'completed'
        UNION
        SELECT email as customer_email FROM email_subscribers WHERE email = ?
      )
    `).bind(normalizedEmail, normalizedEmail).first();

    if (!hasAccess) {
      return c.json({
        error: 'No account found with this email. Please use the email you used to purchase or subscribe.',
        suggestion: 'If you recently purchased, please check your order confirmation email for the correct address.'
      }, 404);
    }

    // Get customer name from orders if available
    const orderInfo = await db.prepare(`
      SELECT customer_name FROM orders WHERE customer_email = ? AND payment_status = 'completed' LIMIT 1
    `).bind(normalizedEmail).first<{ customer_name: string | null }>();

    const customerName = orderInfo?.customer_name || normalizedEmail.split('@')[0];

    // Create session token
    const token = createToken(normalizedEmail, customerName);

    // Set session cookie
    const cookie = `__session_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;

    return c.json(
      {
        success: true,
        user: {
          email: normalizedEmail,
          name: customerName
        }
      },
      { headers: { 'Set-Cookie': cookie } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// GET /api/auth/logout - Clear session
app.get('/logout', (c) => {
  const cookie = '__session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

  return c.json(
    { success: true },
    { headers: { 'Set-Cookie': cookie } }
  );
});

// GET /api/auth/me - Get current user info (auth required)
app.get('/me', authMiddleware, (c) => {
  const email = c.get('userEmail') as string;
  const name = c.get('userName') as string;

  return c.json({
    email,
    name,
  });
});

// GET /api/auth/user-products - Get user's purchased product IDs (auth required)
app.get('/user-products', authMiddleware, async (c) => {
  const db = c.env.DB;
  const userEmail = c.get('userEmail') as string;

  try {
    const accessRecords = await db.prepare(`
      SELECT ca.product_id, p.product_key
      FROM customer_access ca
      JOIN products p ON ca.product_id = p.id
      WHERE ca.customer_email = ?
    `).bind(userEmail.toLowerCase().trim()).all();

    const productIds = accessRecords.results.map((r: any) => r.product_id);
    const productKeys = accessRecords.results.map((r: any) => r.product_key);

    return c.json({ productIds, productKeys });
  } catch (error) {
    console.error('Failed to get user products:', error);
    return c.json({ error: 'Failed to get user products' }, 500);
  }
});

// POST /api/auth/check-access - Check if email has access to specific product (no auth required)
app.post('/check-access', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ email: string; productKey: string }>();

  if (!body.email || !body.productKey) {
    return c.json({ error: 'Email and product key are required' }, 400);
  }

  try {
    const access = await db.prepare(`
      SELECT ca.* FROM customer_access ca
      JOIN products p ON ca.product_id = p.id
      WHERE ca.customer_email = ? AND p.product_key = ?
    `).bind(body.email.toLowerCase().trim(), body.productKey).first();

    return c.json({ hasAccess: !!access });
  } catch (error) {
    console.error('Check access error:', error);
    return c.json({ error: 'Failed to check access' }, 500);
  }
});

export { app as authRoutes };
