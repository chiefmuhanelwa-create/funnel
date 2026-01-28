import { Hono } from 'hono';
import type { Env } from '../types';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Env }>();

// GET /api/auth/google/redirect - Get Google OAuth URL
app.get('/google/redirect', (c) => {
  const mochaUrl = c.env.MOCHA_USERS_SERVICE_API_URL;

  if (!mochaUrl) {
    return c.json({ error: 'OAuth not configured' }, 500);
  }

  const redirectUrl = `${mochaUrl}/api/oauth/google/redirect?callback=${encodeURIComponent('https://contentpreneurhub.online/auth/callback')}`;

  return c.json({ url: redirectUrl });
});

// POST /api/auth/sessions - Exchange auth code for session
app.post('/sessions', async (c) => {
  const body = await c.req.json<{ code: string }>();

  if (!body.code) {
    return c.json({ error: 'Auth code is required' }, 400);
  }

  const mochaUrl = c.env.MOCHA_USERS_SERVICE_API_URL;
  const mochaKey = c.env.MOCHA_USERS_SERVICE_API_KEY;

  if (!mochaUrl || !mochaKey) {
    return c.json({ error: 'OAuth not configured' }, 500);
  }

  try {
    const response = await fetch(`${mochaUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mochaKey}`,
      },
      body: JSON.stringify({ code: body.code }),
    });

    if (!response.ok) {
      return c.json({ error: 'Failed to exchange auth code' }, 400);
    }

    const sessionData = await response.json() as {
      token: string;
      user: { email: string; name: string; picture: string };
    };

    // Set session cookie
    const cookie = `__mocha_session_token=${sessionData.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;

    return c.json(
      { success: true, user: sessionData.user },
      { headers: { 'Set-Cookie': cookie } }
    );
  } catch (error) {
    console.error('Session exchange error:', error);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

// GET /api/auth/logout - Clear session
app.get('/logout', (c) => {
  const cookie = '__mocha_session_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

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

export { app as authRoutes };
