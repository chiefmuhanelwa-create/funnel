import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { sendWelcomeSequenceEmail } from '../../lib/resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET (Vercel cron format)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(databaseUrl);

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  try {
    // Get due emails (scheduled_for <= now, not yet sent)
    const dueEmails = await sql`
      SELECT * FROM email_sequences
      WHERE scheduled_for <= NOW()
      AND is_sent = false
      ORDER BY scheduled_for ASC
      LIMIT 50
    `;

    console.log(`[CRON] Found ${dueEmails.length} due emails to process`);

    for (const emailRecord of dueEmails) {
      try {
        // Get customer name from orders table if available
        const customerInfo = await sql`
          SELECT customer_name FROM orders
          WHERE customer_email = ${emailRecord.customer_email}
          ORDER BY created_at DESC
          LIMIT 1
        `;
        const firstName = customerInfo[0]?.customer_name || emailRecord.customer_email.split('@')[0];

        // Send email via Resend
        const success = await sendWelcomeSequenceEmail(
          emailRecord.customer_email,
          emailRecord.email_number,
          firstName
        );

        if (success) {
          // Mark as sent
          await sql`
            UPDATE email_sequences
            SET is_sent = true, sent_at = NOW()
            WHERE id = ${emailRecord.id}
          `;
          sentCount++;
          console.log(`[CRON] Sent email #${emailRecord.email_number} to ${emailRecord.customer_email}`);
        } else {
          failedCount++;
          errors.push(`${emailRecord.customer_email}: Send failed`);
        }
      } catch (emailError: any) {
        failedCount++;
        errors.push(`${emailRecord.customer_email}: ${emailError.message}`);
        console.error(`[CRON] Error processing email:`, emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${dueEmails.length} emails`,
      sent: sentCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('[CRON] Email sequence cron error:', error.message);
    return res.status(500).json({
      error: 'Cron job failed',
      details: error.message,
    });
  }
}
