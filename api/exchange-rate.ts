import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=ZAR');
    const data = await response.json() as { rates: { ZAR: number } };

    return res.status(200).json({
      rate: data.rates.ZAR,
      source: 'frankfurter',
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(200).json({
      rate: 18.5,
      source: 'fallback',
      error: 'Failed to fetch live rate'
    });
  }
}
