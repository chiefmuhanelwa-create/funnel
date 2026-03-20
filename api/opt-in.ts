import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ConvertKit configuration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const CONVERTKIT_TAG_LEAD_MAGNET = process.env.CONVERTKIT_TAG_LEAD_MAGNET || '';

// Vercel Blob URLs for lead magnets
const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

// FREE Lead Magnets Only (no duplicates with paid products)
const LEAD_MAGNETS: Record<string, { name: string; downloadUrl: string; icon: string; upsell: string; upsellUrl: string; externalTool?: string }> = {
  // External Tools (unique free offerings)
  'ratecard-pro': {
    name: 'RateCard Pro Calculator',
    downloadUrl: 'https://collab-value.lovable.app/',
    icon: '📊',
    upsell: 'Learn to land R50K+ brand deals with The Influencer\'s Code',
    upsellUrl: '/checkout/influencers-code',
    externalTool: 'https://collab-value.lovable.app/',
  },
  'tax-calculator': {
    name: 'Tax Calculator + Invoice Generator',
    downloadUrl: 'https://contentprenuership.com',
    icon: '🧮',
    upsell: 'Master SARS compliance with the complete Tax Guide for Contentpreneurs (115 pages)',
    upsellUrl: '/checkout/tax-guide',
    externalTool: 'https://contentprenuership.com',
  },
  // PDF Downloads (unique free offerings)
  'content-ideas': {
    name: 'Content Ideas Cheat Sheet',
    downloadUrl: `${BLOB_BASE}/books/content-ideas-cheatsheet.pdf`,
    icon: '💡',
    upsell: 'Master content creation with the Contentpreneur Starter Kit',
    upsellUrl: '/checkout/starter-kit',
  },
  'media-kit': {
    name: 'Media Kit Generator Templates',
    downloadUrl: `${BLOB_BASE}/books/media-kit-templates.pdf`,
    icon: '🎨',
    upsell: 'Get 100+ templates to 10x your content with the Content Arsenal Pack',
    upsellUrl: '/checkout/content-arsenal',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;

  try {
    const { email, firstName, leadMagnet, painPoints, whatsapp, source } = req.body;

    if (!email || !leadMagnet) {
      return res.status(400).json({ error: 'Email and lead magnet are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const name = firstName || '';

    console.log('[OPT-IN] New subscriber:', { email: normalizedEmail, leadMagnet });

    // Save to database if configured
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);
        await sql`
          INSERT INTO email_subscribers (email, first_name, lead_magnet, pain_points, whatsapp, source)
          VALUES (${normalizedEmail}, ${name || null}, ${leadMagnet}, ${painPoints || null}, ${whatsapp || null}, ${source || 'website'})
          ON CONFLICT (email) DO UPDATE SET
            first_name = COALESCE(EXCLUDED.first_name, email_subscribers.first_name),
            lead_magnet = EXCLUDED.lead_magnet,
            pain_points = COALESCE(EXCLUDED.pain_points, email_subscribers.pain_points),
            whatsapp = COALESCE(EXCLUDED.whatsapp, email_subscribers.whatsapp)
        `;
        console.log('[OPT-IN] Saved to database');
      } catch (dbError) {
        console.error('[OPT-IN] Database error:', dbError);
      }
    }

    // Sync to ConvertKit with tags for nurture sequence
    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      try {
        const tags = CONVERTKIT_TAG_LEAD_MAGNET ? [parseInt(CONVERTKIT_TAG_LEAD_MAGNET)] : [];

        await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email: normalizedEmail,
            first_name: name,
            tags,
            fields: {
              lead_magnet: leadMagnet,
              pain_points: painPoints || '',
              source: source || 'website',
            },
          }),
        });
        console.log('[OPT-IN] Synced to ConvertKit');
      } catch (ckError) {
        console.error('[OPT-IN] ConvertKit sync failed:', ckError);
      }
    }

    // Send lead magnet delivery email
    await sendLeadMagnetEmail(normalizedEmail, name, leadMagnet);

    return res.status(200).json({ success: true, message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Opt-in error:', error);
    return res.status(500).json({ error: 'Failed to process opt-in' });
  }
}

async function sendLeadMagnetEmail(email: string, firstName: string, leadMagnet: string) {
  const config = LEAD_MAGNETS[leadMagnet] || {
    name: 'Your Free Resource',
    downloadUrl: 'https://www.contentpreneurhub.online/members',
    icon: '🎁',
    upsell: 'Take the next step with the Contentpreneur Starter Kit',
    upsellUrl: '/checkout/starter-kit',
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.contentpreneurhub.online';
  const isExternalTool = !!config.externalTool;

  // Different email content for external tools vs PDF downloads
  const ctaButton = isExternalTool
    ? `<a href="${config.externalTool}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 18px 36px; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
        🔗 Open Tool Now
      </a>`
    : `<a href="${config.downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 18px 36px; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        📥 Download Now
      </a>`;

  const proTip = isExternalTool
    ? `<div style="background: #d1fae5; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 10px; color: #065f46; font-size: 16px;">💡 Pro Tip</h3>
        <p style="margin: 0; color: #047857; font-size: 14px;">
          Bookmark this tool! You can use it anytime. This link will always work: <a href="${config.externalTool}" style="color: #059669; font-weight: bold;">${config.externalTool}</a>
        </p>
      </div>`
    : `<div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">💡 Pro Tip</h3>
        <p style="margin: 0; color: #78350f; font-size: 14px;">
          Set aside 30-60 minutes to go through this properly. Don't just skim it — the real value comes from doing the exercises!
        </p>
      </div>`;

  const heading = isExternalTool ? 'Your Tool Access is Ready!' : 'Your Download is Ready!';
  const intro = isExternalTool
    ? `Thank you for requesting access to the <strong>${config.name}</strong>! Click below to start using the tool immediately.`
    : `Thank you for downloading the <strong>${config.name}</strong>! This resource is going to help you take the next step in your contentpreneur journey.`;

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject: `${config.icon} Your ${config.name} is ready!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 56px; margin-bottom: 16px;">${config.icon}</div>
      <h1 style="color: #111; margin: 0; font-size: 26px;">${heading}</h1>
    </div>

    <p style="font-size: 16px;">Hi ${firstName || 'there'},</p>

    <p style="font-size: 16px;">${intro}</p>

    <div style="text-align: center; margin: 30px 0;">
      ${ctaButton}
    </div>

    ${proTip}

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 5px; font-size: 14px; color: #92400e;">Ready to go deeper?</p>
      <p style="margin: 0 0 15px; font-size: 16px; color: #78350f; font-weight: 600;">${config.upsell}</p>
      <a href="${appUrl}${config.upsellUrl}" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">
        Check It Out →
      </a>
    </div>

    <p style="font-size: 16px;">P.S. Keep an eye on your inbox — I'll be sending you some valuable tips over the next few days to help you make the most of this resource.</p>

    <p style="font-size: 16px;">To your success,<br><strong>Mr. NoChill</strong></p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <div style="text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px;">
        Follow me for daily content tips
      </p>
      <div style="margin: 10px 0;">
        <a href="https://www.instagram.com/nochill_god/" style="color: #f59e0b; font-weight: 600; text-decoration: none; margin: 0 8px;">Instagram</a>
        <a href="https://x.com/NOCHILL_GOD" style="color: #f59e0b; font-weight: 600; text-decoration: none; margin: 0 8px;">X/Twitter</a>
        <a href="https://www.youtube.com/@NOCHILLGOD" style="color: #f59e0b; font-weight: 600; text-decoration: none; margin: 0 8px;">YouTube</a>
        <a href="https://www.tiktok.com/@nochillgod" style="color: #f59e0b; font-weight: 600; text-decoration: none; margin: 0 8px;">TikTok</a>
        <a href="https://www.linkedin.com/in/ndivhuwo-muhanelwa/" style="color: #f59e0b; font-weight: 600; text-decoration: none; margin: 0 8px;">LinkedIn</a>
      </div>
    </div>

    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
      © 2026 NOCHILL PTY LTD. All rights reserved.
    </p>
  </div>
</body>
</html>
      `,
    });
    console.log('[OPT-IN] Lead magnet email sent to:', email);
  } catch (error) {
    console.error('[OPT-IN] Failed to send email:', error);
  }
}
