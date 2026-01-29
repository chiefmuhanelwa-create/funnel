import { Context, Next } from 'hono';
import type { Env } from '../types';

// Simple JWT-like token verification (base64 encoded JSON with signature)
function verifyToken(token: string): { email: string; name: string } | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    // Decode payload
    const decoded = JSON.parse(atob(payload));

    // Verify expiration
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }

    return { email: decoded.email, name: decoded.name || '' };
  } catch {
    return null;
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // Get session token from cookie
  const sessionToken = c.req.header('Cookie')?.match(/__session_token=([^;]+)/)?.[1];

  if (!sessionToken) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  try {
    const userData = verifyToken(sessionToken);

    if (!userData) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    c.set('userEmail', userData.email);
    c.set('userName', userData.name);

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
}

export async function optionalAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const sessionToken = c.req.header('Cookie')?.match(/__session_token=([^;]+)/)?.[1];

  if (sessionToken) {
    try {
      const userData = verifyToken(sessionToken);

      if (userData) {
        c.set('userEmail', userData.email);
        c.set('userName', userData.name);
      }
    } catch (error) {
      // Silently fail for optional auth
      console.error('Optional auth error:', error);
    }
  }

  await next();
}
