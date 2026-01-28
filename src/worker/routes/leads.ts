import { Hono } from 'hono';
import type { Env } from '../types';
import { sendLeadMagnetEmail } from '../emails/index';
import { syncToConvertKit } from '../utils/convertkit';

const app = new Hono<{ Bindings: Env }>();

// POST /api/opt-in - Email opt-in for lead magnets
app.post('/opt-in', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    email: string;
    firstName?: string;
    leadMagnet: string;
    painPoints?: string;
    whatsapp?: string;
    source?: string;
  }>();

  if (!body.email || !body.leadMagnet) {
    return c.json({ error: 'Email and lead magnet are required' }, 400);
  }

  const normalizedEmail = body.email.toLowerCase().trim();

  try {
    // Insert or update subscriber
    await db.prepare(`
      INSERT INTO email_subscribers (email, first_name, lead_magnet, pain_points, whatsapp, source)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        first_name = COALESCE(excluded.first_name, email_subscribers.first_name),
        lead_magnet = excluded.lead_magnet,
        pain_points = COALESCE(excluded.pain_points, email_subscribers.pain_points),
        whatsapp = COALESCE(excluded.whatsapp, email_subscribers.whatsapp)
    `).bind(
      normalizedEmail,
      body.firstName || null,
      body.leadMagnet,
      body.painPoints || null,
      body.whatsapp || null,
      body.source || 'website'
    ).run();

    // Send lead magnet delivery email
    await sendLeadMagnetEmail(c.env, normalizedEmail, body.firstName || '', body.leadMagnet);

    // Sync to ConvertKit
    await syncToConvertKit(c.env, {
      email: normalizedEmail,
      firstName: body.firstName || '',
      tags: [`lead-magnet-${body.leadMagnet}`],
      customFields: {
        lead_magnet: body.leadMagnet,
        pain_points: body.painPoints || '',
        whatsapp: body.whatsapp || '',
      },
    });

    return c.json({ success: true, message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Opt-in error:', error);
    return c.json({ error: 'Failed to process opt-in' }, 500);
  }
});

// POST /api/consultation-request - Request coaching consultation
app.post('/consultation-request', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    email: string;
    name: string;
    whatsapp?: string;
    followerCount?: string;
    currentIncome?: string;
    goals?: string;
  }>();

  if (!body.email || !body.name) {
    return c.json({ error: 'Email and name are required' }, 400);
  }

  try {
    await db.prepare(`
      INSERT INTO consultation_requests (email, name, whatsapp, follower_count, current_income, goals)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      body.email.toLowerCase().trim(),
      body.name,
      body.whatsapp || null,
      body.followerCount || null,
      body.currentIncome || null,
      body.goals || null
    ).run();

    // Sync to ConvertKit
    await syncToConvertKit(c.env, {
      email: body.email.toLowerCase().trim(),
      firstName: body.name.split(' ')[0],
      tags: ['consultation-request'],
      customFields: {
        follower_count: body.followerCount || '',
        current_income: body.currentIncome || '',
      },
    });

    return c.json({ success: true, message: 'Consultation request submitted' });
  } catch (error) {
    console.error('Consultation request error:', error);
    return c.json({ error: 'Failed to submit consultation request' }, 500);
  }
});

// POST /api/brand-inquiry - Brand partnership inquiry
app.post('/brand-inquiry', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    brandName: string;
    contactEmail: string;
    contactName?: string;
    campaignDetails?: string;
    budget?: string;
    timeline?: string;
  }>();

  if (!body.brandName || !body.contactEmail) {
    return c.json({ error: 'Brand name and contact email are required' }, 400);
  }

  try {
    await db.prepare(`
      INSERT INTO brand_inquiries (brand_name, contact_email, contact_name, campaign_details, budget, timeline)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      body.brandName,
      body.contactEmail.toLowerCase().trim(),
      body.contactName || null,
      body.campaignDetails || null,
      body.budget || null,
      body.timeline || null
    ).run();

    return c.json({ success: true, message: 'Brand inquiry submitted' });
  } catch (error) {
    console.error('Brand inquiry error:', error);
    return c.json({ error: 'Failed to submit brand inquiry' }, 500);
  }
});

export { app as leadRoutes };
