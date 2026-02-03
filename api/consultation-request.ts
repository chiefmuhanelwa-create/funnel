import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ConvertKit configuration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const CONVERTKIT_TAG_CONSULTATION = process.env.CONVERTKIT_TAG_CONSULTATION || '';

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
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const {
      email,
      name,
      phone,
      instagram,
      currentStatus,
      goals,
      challenges,
      budget,
      preferredDate,
      additionalNotes,
      whatsapp,
      followerCount,
      currentIncome,
    } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const firstName = name.split(' ')[0];

    // Combine all notes into goals field for database compatibility
    const combinedGoals = [
      goals,
      challenges ? `Challenges: ${challenges}` : null,
      additionalNotes ? `Notes: ${additionalNotes}` : null,
    ].filter(Boolean).join('\n\n');

    // Save to database
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO consultation_requests (email, name, whatsapp, follower_count, current_income, goals)
      VALUES (${normalizedEmail}, ${name}, ${phone || whatsapp || null}, ${instagram || followerCount || null}, ${budget || currentStatus || currentIncome || null}, ${combinedGoals || null})
    `;

    console.log('[CONSULTATION] Request saved:', normalizedEmail);

    // Sync to ConvertKit
    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      try {
        const tags = CONVERTKIT_TAG_CONSULTATION ? [parseInt(CONVERTKIT_TAG_CONSULTATION)] : [];

        await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email: normalizedEmail,
            first_name: firstName,
            tags,
            fields: {
              source: 'consultation_request',
              instagram: instagram || '',
              budget: budget || currentStatus || '',
            },
          }),
        });
        console.log('[CONSULTATION] Synced to ConvertKit');
      } catch (ckError) {
        console.error('[CONSULTATION] ConvertKit sync failed:', ckError);
      }
    }

    // Send confirmation email to customer
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://funnel-nochill.vercel.app';
    const calendlyUrl = 'https://calendly.com/chiefmuhanelwa/contentpreneurship';

    try {
      await resend.emails.send({
        from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
        to: normalizedEmail,
        subject: '📅 Your Strategy Session Application Received',
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
      <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
      <h1 style="color: #111; margin: 0; font-size: 26px;">Application Received!</h1>
      <p style="color: #666; margin: 10px 0 0;">We'll review and get back to you soon</p>
    </div>

    <p style="font-size: 16px;">Hi ${firstName},</p>

    <p style="font-size: 16px;">Thank you for your interest in booking a 1:1 Strategy Session! I've received your application and will review it within 24-48 hours.</p>

    <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0;">
      <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">📋 What happens next?</h3>
      <ol style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
        <li style="margin: 8px 0;">I'll review your goals and challenges</li>
        <li style="margin: 8px 0;">You'll receive an email to confirm your session</li>
        <li style="margin: 8px 0;">We'll hop on a call and map out your strategy</li>
      </ol>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin: 0 0 15px; font-size: 14px; color: #92400e;">Ready to book immediately?</p>
      <a href="${calendlyUrl}" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">
        📅 Book on Calendly →
      </a>
    </div>

    <p style="font-size: 16px;">Looking forward to helping you build your contentpreneur business!</p>

    <p style="font-size: 16px;">To your success,<br><strong>Mr. NoChill</strong></p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Questions? Reply to this email or reach out at info@nochill.co.za<br>
      © 2026 NOCHILL PTY LTD. All rights reserved.
    </p>
  </div>
</body>
</html>
        `,
      });
      console.log('[CONSULTATION] Confirmation email sent');
    } catch (emailError) {
      console.error('[CONSULTATION] Email failed:', emailError);
    }

    // Send notification to admin
    try {
      await resend.emails.send({
        from: 'Contentpreneur Hub <notifications@contentpreneurhub.online>',
        to: 'chiefmuhanelwa@gmail.com',
        subject: `🔔 New Consultation Request: ${name}`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px;">
  <h2>New Consultation Request</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${normalizedEmail}</p>
  <p><strong>Phone:</strong> ${phone || whatsapp || 'Not provided'}</p>
  <p><strong>Instagram:</strong> ${instagram || 'Not provided'}</p>
  <p><strong>Status:</strong> ${currentStatus || 'Not provided'}</p>
  <p><strong>Budget:</strong> ${budget || 'Not provided'}</p>
  <p><strong>Preferred Date:</strong> ${preferredDate || 'Not provided'}</p>
  <hr>
  <p><strong>Goals:</strong></p>
  <p>${goals || 'Not provided'}</p>
  <p><strong>Challenges:</strong></p>
  <p>${challenges || 'Not provided'}</p>
  <p><strong>Additional Notes:</strong></p>
  <p>${additionalNotes || 'Not provided'}</p>
</body>
</html>
        `,
      });
      console.log('[CONSULTATION] Admin notification sent');
    } catch (adminEmailError) {
      console.error('[CONSULTATION] Admin email failed:', adminEmailError);
    }

    return res.status(200).json({ success: true, message: 'Consultation request submitted' });
  } catch (error) {
    console.error('Consultation request error:', error);
    return res.status(500).json({ error: 'Failed to submit consultation request' });
  }
}
