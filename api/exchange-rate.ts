import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory cache for exchange rate (15 minutes TTL for more accurate rates)
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes - shorter for more accurate pricing
const FALLBACK_RATE = 16.70; // March 2026 fallback - update periodically to match market

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Allow caching by CDN for 15 minutes (match our TTL)
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');

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

  // Try primary API (Frankfurter)
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR', {
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json() as { rates: { ZAR: number } };
      const rate = data.rates?.ZAR;

      if (rate && rate > 0) {
        cachedRate = { rate, timestamp: now };
        console.log('[EXCHANGE-RATE] Fetched from Frankfurter:', rate);

        return res.status(200).json({
          rate,
          source: 'frankfurter',
          cachedAt: new Date().toISOString(),
          expiresIn: CACHE_TTL_MS / 1000,
        });
      }
    }
    throw new Error('Primary API failed or returned invalid data');
  } catch (primaryError) {
    console.log('[EXCHANGE-RATE] Primary API failed, trying backup...');

    // Try backup API (open.er-api.com - free, no key required)
    try {
      const backupResponse = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: AbortSignal.timeout(5000),
      });

      if (backupResponse.ok) {
        const backupData = await backupResponse.json() as { rates: { ZAR: number } };
        const rate = backupData.rates?.ZAR;

        if (rate && rate > 0) {
          cachedRate = { rate, timestamp: now };
          console.log('[EXCHANGE-RATE] Fetched from backup API:', rate);

          return res.status(200).json({
            rate,
            source: 'er-api-backup',
            cachedAt: new Date().toISOString(),
            expiresIn: CACHE_TTL_MS / 1000,
          });
        }
      }
    } catch (backupError) {
      console.error('[EXCHANGE-RATE] Backup API also failed:', backupError);
    }

    console.error('[EXCHANGE-RATE] All APIs failed');

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
