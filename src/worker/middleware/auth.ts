import { Context, Next } from 'hono';
import type { Env } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // Get session token from cookie
  const sessionToken = c.req.header('Cookie')?.match(/__mocha_session_token=([^;]+)/)?.[1];

  if (!sessionToken) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  try {
    // Verify session with Mocha Users Service
    const mochaUrl = c.env.MOCHA_USERS_SERVICE_API_URL;
    const mochaKey = c.env.MOCHA_USERS_SERVICE_API_KEY;

    if (mochaUrl && mochaKey) {
      const response = await fetch(`${mochaUrl}/api/sessions/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mochaKey}`,
        },
        body: JSON.stringify({ token: sessionToken }),
      });

      if (response.ok) {
        const userData = await response.json() as { email: string; name: string };
        c.set('userEmail', userData.email);
        c.set('userName', userData.name);
      } else {
        return c.json({ error: 'Invalid session' }, 401);
      }
    } else {
      // Fallback: decode JWT-like token for development
      try {
        const payload = JSON.parse(atob(sessionToken.split('.')[1]));
        c.set('userEmail', payload.email);
        c.set('userName', payload.name);
      } catch {
        return c.json({ error: 'Invalid session format' }, 401);
      }
    }

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
}

export async function optionalAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const sessionToken = c.req.header('Cookie')?.match(/__mocha_session_token=([^;]+)/)?.[1];

  if (sessionToken) {
    try {
      const mochaUrl = c.env.MOCHA_USERS_SERVICE_API_URL;
      const mochaKey = c.env.MOCHA_USERS_SERVICE_API_KEY;

      if (mochaUrl && mochaKey) {
        const response = await fetch(`${mochaUrl}/api/sessions/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mochaKey}`,
          },
          body: JSON.stringify({ token: sessionToken }),
        });

        if (response.ok) {
          const userData = await response.json() as { email: string; name: string };
          c.set('userEmail', userData.email);
          c.set('userName', userData.name);
        }
      }
    } catch (error) {
      // Silently fail for optional auth
      console.error('Optional auth error:', error);
    }
  }

  await next();
}
