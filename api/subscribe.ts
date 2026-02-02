import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Subscribe to ConvertKit if configured
    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      try {
        const formUrl = `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`;

        const ckResponse = await fetch(formUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email: normalizedEmail,
            first_name: firstName,
            tags: tags?.map((t: string) => CONVERTKIT_TAGS[t]).filter(Boolean) || [],
          }),
        });

        if (!ckResponse.ok) {
          console.error('[SUBSCRIBE] ConvertKit error:', await ckResponse.text());
        } else {
          console.log('[SUBSCRIBE] Added to ConvertKit');
        }
      } catch (ckError) {
        console.error('[SUBSCRIBE] ConvertKit failed:', ckError);
      }
    }

    // Send welcome email via Resend
    const leadMagnetUrl = process.env.LEAD_MAGNET_URL || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://funnel-nochill.vercel.app';

    const emailHtml = getWelcomeEmailHtml({
      firstName,
      source,
      leadMagnetUrl,
      appUrl,
    });

    try {
      await resend.emails.send({
        from: 'Mr. NoChill <hello@contentpreneurhub.online>',
        to: normalizedEmail,
        subject: source === 'lead_magnet'
          ? '🎁 Your free download is ready!'
          : '👋 Welcome to the Contentpreneur community!',
        html: emailHtml,
      });
      console.log('[SUBSCRIBE] Welcome email sent');
    } catch (emailError) {
      console.error('[SUBSCRIBE] Email failed:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed'
    });
  } catch (error) {
    console.error('[SUBSCRIBE] Error:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}

function getWelcomeEmailHtml(params: {
  firstName: string;
  source: string;
  leadMagnetUrl: string;
  appUrl: string;
}): string {
  const { firstName, source, leadMagnetUrl, appUrl } = params;

  const isLeadMagnet = source === 'lead_magnet';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; margin-bottom: 16px;">${isLeadMagnet ? '🎁' : '👋'}</div>
      <h1 style="color: #111; margin: 0; font-size: 26px;">
        ${isLeadMagnet ? 'Your Download is Ready!' : 'Welcome to the Community!'}
      </h1>
    </div>

    <p style="font-size: 16px;">Hey ${firstName || 'there'},</p>

    ${isLeadMagnet && leadMagnetUrl ? `
    <p style="font-size: 16px;">Thank you for downloading! Here's your free resource:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${leadMagnetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px;">
        📥 Download Now
      </a>
    </div>
    ` : `
    <p style="font-size: 16px;">Welcome to the Contentpreneur community! You've just joined thousands of creators who are building profitable content businesses.</p>
    `}

    <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">🚀 What's Next?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
        <li style="margin: 8px 0;">Check your inbox - I'll be sending you valuable tips</li>
        <li style="margin: 8px 0;">Follow me on Instagram <a href="https://instagram.com/mrnochill" style="color: #b45309;">@mrnochill</a></li>
        <li style="margin: 8px 0;">Reply to this email if you have any questions</li>
      </ul>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 10px; font-size: 14px; color: #92400e;">Ready to take your content business to the next level?</p>
      <a href="${appUrl}/contentpreneur-starter-kit" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
        Check Out the Starter Kit →
      </a>
    </div>

    <p style="font-size: 16px;">To your success,<br><strong>Mr. NoChill</strong></p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      © 2026 NOCHILL PTY LTD. All rights reserved.<br>
      <a href="${appUrl}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `;
}
