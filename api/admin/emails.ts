import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check admin authorization
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    // Get email ID for detail view
    const { id } = req.query;

    if (id && typeof id === 'string') {
      // Fetch single email with full HTML content
      const emailResult = await sql`
        SELECT
          se.id,
          se.order_id,
          se.customer_email,
          se.customer_name,
          se.email_type,
          se.subject,
          se.products_purchased,
          se.products_granted,
          se.amount_paid_cents,
          se.currency,
          se.email_html,
          se.sent_at,
          o.order_number
        FROM sent_emails se
        LEFT JOIN orders o ON se.order_id = o.id
        WHERE se.id = ${parseInt(id, 10)}
      `;

      if (emailResult.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }

      return res.status(200).json({ email: emailResult[0] });
    }

    // Fetch list of emails (without full HTML to keep response size small)
    const emails = await sql`
      SELECT
        se.id,
        se.order_id,
        se.customer_email,
        se.customer_name,
        se.email_type,
        se.subject,
        se.products_purchased,
        se.products_granted,
        se.amount_paid_cents,
        se.currency,
        se.sent_at,
        o.order_number
      FROM sent_emails se
      LEFT JOIN orders o ON se.order_id = o.id
      ORDER BY se.sent_at DESC
      LIMIT 100
    `;

    return res.status(200).json({ emails });
  } catch (error) {
    console.error('Admin emails error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
