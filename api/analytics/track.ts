import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

function extractUTM(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
  } catch {
    return null;
  }
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return res.status(500).json({ error: 'Database not configured' });

  try {
    const { eventType, data = {} } = req.body;

    if (!eventType) {
      return res.status(400).json({ error: 'eventType is required' });
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      'unknown';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const referrer = (req.headers['referer'] as string) || '';

    // Get or generate session ID
    const sessionId: string =
      (req.cookies?.session_id as string) || data?.session_id || generateSessionId();

    // Extract UTM from page URL or referrer
    const pageUrl: string = data?.page_url || '';
    const utmSource: string =
      data?.utm_source || extractUTM(pageUrl, 'utm_source') || extractUTM(referrer, 'utm_source') || '';
    const utmMedium: string =
      data?.utm_medium || extractUTM(pageUrl, 'utm_medium') || extractUTM(referrer, 'utm_medium') || '';
    const utmCampaign: string =
      data?.utm_campaign || extractUTM(pageUrl, 'utm_campaign') || extractUTM(referrer, 'utm_campaign') || '';

    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO analytics_events (
        event_type, session_id, page_url, event_data,
        ip_address, user_agent, referrer,
        utm_source, utm_medium, utm_campaign,
        created_at
      ) VALUES (
        ${eventType},
        ${sessionId},
        ${pageUrl},
        ${JSON.stringify(data)},
        ${ip},
        ${userAgent},
        ${referrer},
        ${utmSource || null},
        ${utmMedium || null},
        ${utmCampaign || null},
        NOW()
      )
    `;

    // Return session ID so frontend can reuse it
    return res.status(200).json({ success: true, sessionId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[ANALYTICS] Track error:', message);
    // Never fail silently — return 200 so tracking failures don't break the UI
    return res.status(200).json({ success: false, error: message });
  }
}
