import { Context, Next } from 'hono';
import type { Env } from '../types';
import { ADMIN_EMAILS } from '../types';

export async function adminAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // Get user from session (would be set by auth middleware)
  const userEmail = c.get('userEmail') as string | undefined;

  if (!userEmail) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const normalizedEmail = userEmail.toLowerCase().trim();

  if (!ADMIN_EMAILS.includes(normalizedEmail)) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
