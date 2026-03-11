import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory cache for exchange rate (1 hour TTL)
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const FALLBACK_RATE = 16.5; // Updated March 2026 fallback rate

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Allow caching by CDN for 30 minutes
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if we have a valid cached rate
  const now = Date.now();
  if (cachedRate && now - cachedRate.timestamp < CACHE_TTL_MS) {
    return res.status(200).json({
      rate: cachedRate.rate,
      source: 'cache',
      cachedAt: new Date(cachedRate.timestamp).toISOString(),
      expiresIn: Math.round((CACHE_TTL_MS - (now - cachedRate.timestamp)) / 1000),
    });
  }

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR', {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    const data = await response.json() as { rates: { ZAR: number } };

    // Update cache
    cachedRate = {
      rate: data.rates.ZAR,
      timestamp: now,
    };

    return res.status(200).json({
      rate: data.rates.ZAR,
      source: 'frankfurter',
      cachedAt: new Date().toISOString(),
      expiresIn: CACHE_TTL_MS / 1000,
    });
  } catch (error) {
    console.error('[EXCHANGE-RATE] Failed to fetch:', error);

    // If we have a stale cache, use it
    if (cachedRate) {
      return res.status(200).json({
        rate: cachedRate.rate,
        source: 'stale-cache',
        cachedAt: new Date(cachedRate.timestamp).toISOString(),
        warning: 'Using stale cached rate',
      });
    }

    // Ultimate fallback
    return res.status(200).json({
      rate: FALLBACK_RATE,
      source: 'fallback',
      warning: 'Using fallback rate - live rate unavailable',
    });
  }
}
