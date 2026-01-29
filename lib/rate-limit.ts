import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiter
// For production, consider using Redis or a distributed solution

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

interface RateLimitConfig {
  windowMs?: number; // Time window in milliseconds (default: 60000 = 1 minute)
  maxRequests?: number; // Max requests per window (default: 100)
  keyGenerator?: (req: VercelRequest) => string; // Custom key generator
}

export function rateLimit(config: RateLimitConfig = {}) {
  const {
    windowMs = 60000,
    maxRequests = 100,
    keyGenerator = defaultKeyGenerator,
  } = config;

  return async (
    req: VercelRequest,
    res: VercelResponse
  ): Promise<boolean> => {
    const key = keyGenerator(req);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetAt < now) {
      // Create new entry
      entry = {
        count: 1,
        resetAt: now + windowMs,
      };
      rateLimitStore.set(key, entry);
    } else {
      // Increment existing entry
      entry.count++;
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString());

    if (entry.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000).toString());
      return false; // Rate limited
    }

    return true; // Not rate limited
  };
}

function defaultKeyGenerator(req: VercelRequest): string {
  // Use IP address as the rate limit key
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim()
    : req.socket?.remoteAddress || 'unknown';

  return `rate-limit:${ip}`;
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Standard API rate limit: 100 requests per minute
  standard: rateLimit({ windowMs: 60000, maxRequests: 100 }),

  // Strict rate limit for sensitive endpoints: 10 requests per minute
  strict: rateLimit({ windowMs: 60000, maxRequests: 10 }),

  // Checkout rate limit: 30 requests per minute
  checkout: rateLimit({ windowMs: 60000, maxRequests: 30 }),

  // Auth rate limit: 5 requests per minute
  auth: rateLimit({ windowMs: 60000, maxRequests: 5 }),
};

// Helper to apply rate limiting and return 429 if exceeded
export async function applyRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  limiter = rateLimiters.standard
): Promise<boolean> {
  const allowed = await limiter(req, res);

  if (!allowed) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
    return false;
  }

  return true;
}
