import { Hono } from 'hono';
import type { Env } from '../types';
import { sendLeadMagnetEmail, sendStarterKitEmail, sendBookingConfirmationEmail } from '../emails/index';
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

// POST /api/unqualified-lead - Handle disqualified applicants from booking funnel
app.post('/unqualified-lead', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    email: string;
  }>();

  if (!body.email) {
    return c.json({ error: 'Email is required' }, 400);
  }

  const normalizedEmail = body.email.toLowerCase().trim();

  try {
    // Insert or update subscriber with source = 'unqualified-lead'
    await db.prepare(`
      INSERT INTO email_subscribers (email, lead_magnet, source)
      VALUES (?, 'contentpreneur-starter-kit', 'unqualified-lead')
      ON CONFLICT(email) DO UPDATE SET
        lead_magnet = 'contentpreneur-starter-kit',
        source = CASE
          WHEN email_subscribers.source = 'unqualified-lead' THEN 'unqualified-lead'
          ELSE email_subscribers.source
        END
    `).bind(normalizedEmail).run();

    // Send starter kit email
    const emailSent = await sendStarterKitEmail(c.env, normalizedEmail);

    if (!emailSent) {
      console.error('Failed to send starter kit email to:', normalizedEmail);
    }

    // Sync to ConvertKit with unqualified tag
    await syncToConvertKit(c.env, {
      email: normalizedEmail,
      firstName: '',
      tags: ['unqualified-lead', 'starter-kit-recipient'],
      customFields: {
        lead_magnet: 'contentpreneur-starter-kit',
        source: 'booking-funnel-disqualified',
      },
    });

    return c.json({ success: true, message: 'Starter kit sent successfully' });
  } catch (error) {
    console.error('Unqualified lead error:', error);
    return c.json({ error: 'Failed to process request' }, 500);
  }
});

// POST /api/qualified-lead - Handle qualified applicants who booked via Calendly
app.post('/qualified-lead', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{
    email: string;
    fullName: string;
    whatsapp?: string;
    igHandle?: string;
    creatorStage?: string;
    niche?: string;
    challenge?: string;
    revenue?: string;
    bookedDate?: string;
    bookedTime?: string;
  }>();

  if (!body.email || !body.fullName) {
    return c.json({ error: 'Email and name are required' }, 400);
  }

  const normalizedEmail = body.email.toLowerCase().trim();

  try {
    // Check if consultation request exists for this email
    const existing = await db.prepare(`
      SELECT id FROM consultation_requests WHERE email = ?
    `).bind(normalizedEmail).first();

    const goalsData = JSON.stringify({
      creatorStage: body.creatorStage,
      niche: body.niche,
      challenge: body.challenge,
      bookedDate: body.bookedDate,
      bookedTime: body.bookedTime,
    });

    if (existing) {
      // Update existing record
      await db.prepare(`
        UPDATE consultation_requests
        SET name = ?, whatsapp = COALESCE(?, whatsapp), follower_count = ?, current_income = ?, goals = ?, status = 'booked', updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `).bind(
        body.fullName,
        body.whatsapp || null,
        body.igHandle || null,
        body.revenue || null,
        goalsData,
        normalizedEmail
      ).run();
    } else {
      // Insert new consultation request
      await db.prepare(`
        INSERT INTO consultation_requests (email, name, whatsapp, follower_count, current_income, goals, status)
        VALUES (?, ?, ?, ?, ?, ?, 'booked')
      `).bind(
        normalizedEmail,
        body.fullName,
        body.whatsapp || null,
        body.igHandle || null,
        body.revenue || null,
        goalsData
      ).run();
    }

    // Send booking confirmation email with pre-call video
    const emailSent = await sendBookingConfirmationEmail(
      c.env,
      normalizedEmail,
      body.fullName,
      body.bookedDate || '',
      body.bookedTime || ''
    );

    if (!emailSent) {
      console.error('Failed to send booking confirmation email to:', normalizedEmail);
    }

    // Sync to ConvertKit with qualified tag
    await syncToConvertKit(c.env, {
      email: normalizedEmail,
      firstName: body.fullName.split(' ')[0],
      tags: ['qualified-lead', 'strategy-session-booked'],
      customFields: {
        instagram_handle: body.igHandle || '',
        current_income: body.revenue || '',
        booked_date: body.bookedDate || '',
        source: 'booking-funnel-qualified',
      },
    });

    return c.json({ success: true, message: 'Booking confirmation sent successfully' });
  } catch (error) {
    console.error('Qualified lead error:', error);
    return c.json({ error: 'Failed to process request' }, 500);
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
