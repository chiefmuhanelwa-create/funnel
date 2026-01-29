import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, emailSubscribers } from '../lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    const { email, firstName, leadMagnet, painPoints, whatsapp, source } = req.body;

    if (!email || !leadMagnet) {
      return res.status(400).json({ error: 'Email and lead magnet are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Insert or update subscriber
    await db
      .insert(emailSubscribers)
      .values({
        email: normalizedEmail,
        firstName: firstName || null,
        leadMagnet,
        painPoints: painPoints || null,
        whatsapp: whatsapp || null,
        source: source || 'website',
      })
      .onConflictDoUpdate({
        target: emailSubscribers.email,
        set: {
          firstName: firstName || undefined,
          leadMagnet,
          painPoints: painPoints || undefined,
          whatsapp: whatsapp || undefined,
        },
      });

    // Send lead magnet delivery email
    await sendLeadMagnetEmail(normalizedEmail, firstName || '', leadMagnet);

    // Sync to ConvertKit (optional)
    if (process.env.CONVERTKIT_API_SECRET) {
      await fetch('https://api.convertkit.com/v3/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: process.env.CONVERTKIT_API_SECRET,
          email: normalizedEmail,
          first_name: firstName,
          fields: {
            lead_magnet: leadMagnet,
            pain_points: painPoints || '',
          },
        }),
      });
    }

    return res.status(200).json({ success: true, message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Opt-in error:', error);
    return res.status(500).json({ error: 'Failed to process opt-in' });
  }
}

async function sendLeadMagnetEmail(email: string, firstName: string, leadMagnet: string) {
  // Vercel Blob URLs for lead magnets
  const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

  const leadMagnetConfig: Record<string, { name: string; downloadUrl: string }> = {
    'paids-workbook': {
      name: 'PAIDS Framework Workbook',
      downloadUrl: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf`,
    },
    'niche-finder': {
      name: 'Niche Finder Workbook',
      downloadUrl: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf`,
    },
    'tax-guide': {
      name: 'Tax Guide for Contentpreneurs',
      downloadUrl: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf`,
    },
  };

  const config = leadMagnetConfig[leadMagnet] || {
    name: 'Your Free Resource',
    downloadUrl: 'https://contentpreneurhub.online/members',
  };

  try {
    await resend.emails.send({
      from: 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject: `Here's your ${config.name}!`,
      html: `
        <h1>Your Free Resource is Ready!</h1>
        <p>Hi ${firstName || 'there'},</p>
        <p>Thanks for signing up! Here's your free <strong>${config.name}</strong>.</p>
        <p><a href="${config.downloadUrl}" style="display: inline-block; padding: 12px 24px; background: #d946ef; color: white; text-decoration: none; border-radius: 6px;">Download Now</a></p>
        <p>If you find this helpful, check out the <a href="https://contentpreneurhub.online/contentpreneur-starter-kit">Contentpreneur Starter Kit</a> for the complete system.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send lead magnet email:', error);
  }
}
