import type { VercelRequest, VercelResponse } from '@vercel/node';

// ConvertKit API configuration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || ''; // Default form for general subscribers

// Tag IDs for different lead sources (configure these in ConvertKit)
const CONVERTKIT_TAGS: Record<string, string> = {
  lead_magnet: process.env.CONVERTKIT_TAG_LEAD_MAGNET || '',
  newsletter: process.env.CONVERTKIT_TAG_NEWSLETTER || '',
  exit_intent: process.env.CONVERTKIT_TAG_EXIT_INTENT || '',
  tool_stack: process.env.CONVERTKIT_TAG_TOOL_STACK || '',
  starter_kit_interest: process.env.CONVERTKIT_TAG_STARTER_KIT || '',
  abandoned_cart: process.env.CONVERTKIT_TAG_ABANDONED_CART || '',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, source, tags } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const firstName = name?.split(' ')[0] || '';

    console.log('[SUBSCRIBE] New subscriber:', { email: normalizedEmail, source, tags });

    // Subscribe to ConvertKit - all emails handled via ConvertKit automations
    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      console.error('[SUBSCRIBE] ConvertKit not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    try {
      const formUrl = `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`;

      // Build tag IDs array from tag names
      const tagIds = tags?.map((t: string) => CONVERTKIT_TAGS[t]).filter(Boolean) || [];

      // Add source-based tag if available
      if (source && CONVERTKIT_TAGS[source]) {
        tagIds.push(CONVERTKIT_TAGS[source]);
      }

      const ckResponse = await fetch(formUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email: normalizedEmail,
          first_name: firstName,
          tags: tagIds,
          fields: {
            source: source || 'website',
          },
        }),
      });

      if (!ckResponse.ok) {
        const errorText = await ckResponse.text();
        console.error('[SUBSCRIBE] ConvertKit error:', errorText);
        return res.status(500).json({ error: 'Failed to subscribe' });
      }

      console.log('[SUBSCRIBE] Added to ConvertKit:', { email: normalizedEmail, tags: tagIds });

      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed'
      });
    } catch (ckError) {
      console.error('[SUBSCRIBE] ConvertKit failed:', ckError);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  } catch (error) {
    console.error('[SUBSCRIBE] Error:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
