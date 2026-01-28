import { Hono } from 'hono';
import type { Env, EmailSequence, AbandonedCart } from '../types';
import { sendWelcomeSequenceEmail, sendAbandonedCartEmail } from '../emails/index';

const app = new Hono<{ Bindings: Env }>();

// POST /api/cron/send-welcome-emails - Process email sequences
app.post('/send-welcome-emails', async (c) => {
  const db = c.env.DB;

  try {
    // Get unsent emails that are due
    const emails = await db.prepare(`
      SELECT * FROM email_sequences
      WHERE is_sent = 0 AND scheduled_for <= datetime('now')
      LIMIT 50
    `).all<EmailSequence>();

    let sent = 0;
    let failed = 0;

    for (const email of emails.results) {
      try {
        await sendWelcomeSequenceEmail(
          c.env,
          email.customer_email,
          email.sequence_type,
          email.email_number
        );

        // Mark as sent
        await db.prepare(`
          UPDATE email_sequences
          SET is_sent = 1, sent_at = datetime('now')
          WHERE id = ?
        `).bind(email.id).run();

        sent++;
      } catch (error) {
        console.error(`Failed to send email sequence ${email.id}:`, error);
        failed++;
      }
    }

    return c.json({
      success: true,
      processed: emails.results.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return c.json({ error: 'Failed to process email sequences' }, 500);
  }
});

// POST /api/cron/send-abandoned-cart-emails - Send cart recovery emails
app.post('/send-abandoned-cart-emails', async (c) => {
  const db = c.env.DB;

  try {
    // Get abandoned carts from > 1 hour ago that haven't been emailed or recovered
    const carts = await db.prepare(`
      SELECT * FROM abandoned_carts
      WHERE created_at < datetime('now', '-1 hour')
        AND recovery_email_sent = 0
        AND recovered = 0
      LIMIT 50
    `).all<AbandonedCart>();

    let sent = 0;
    let failed = 0;

    for (const cart of carts.results) {
      try {
        const productKeys = JSON.parse(cart.product_keys) as string[];

        await sendAbandonedCartEmail(
          c.env,
          cart.customer_email,
          productKeys,
          cart.total_amount_cents,
          cart.currency
        );

        // Mark as sent
        await db.prepare(`
          UPDATE abandoned_carts
          SET recovery_email_sent = 1, updated_at = datetime('now')
          WHERE id = ?
        `).bind(cart.id).run();

        sent++;
      } catch (error) {
        console.error(`Failed to send abandoned cart email ${cart.id}:`, error);
        failed++;
      }
    }

    return c.json({
      success: true,
      processed: carts.results.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return c.json({ error: 'Failed to process abandoned carts' }, 500);
  }
});

export { app as cronRoutes };
