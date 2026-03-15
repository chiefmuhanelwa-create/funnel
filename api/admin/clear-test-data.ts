import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// Admin emails that can clear data
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { adminEmail, confirmClear } = req.body || {};

  // Verify admin
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Unauthorized. Admin email required.' });
  }

  // Require confirmation
  if (confirmClear !== 'YES_CLEAR_ALL_DATA') {
    return res.status(400).json({
      error: 'Confirmation required',
      message: 'Send confirmClear: "YES_CLEAR_ALL_DATA" to proceed'
    });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const sql = neon(databaseUrl);

    // Clear all test data
    const results = {
      email_sequences: 0,
      order_items: 0,
      customer_access: 0,
      orders: 0,
      abandoned_carts: 0,
      email_verifications: 0,
      member_sessions: 0,
      user_progress: 0,
    };

    // Delete in order (respecting foreign keys)
    const emailSeq = await sql`DELETE FROM email_sequences RETURNING id`;
    results.email_sequences = emailSeq.length;

    const orderItems = await sql`DELETE FROM order_items RETURNING id`;
    results.order_items = orderItems.length;

    const access = await sql`DELETE FROM customer_access RETURNING id`;
    results.customer_access = access.length;

    const orders = await sql`DELETE FROM orders RETURNING id`;
    results.orders = orders.length;

    const carts = await sql`DELETE FROM abandoned_carts RETURNING id`;
    results.abandoned_carts = carts.length;

    // Clear auth/verification tables
    try {
      const verifications = await sql`DELETE FROM email_verifications RETURNING id`;
      results.email_verifications = verifications.length;
    } catch (e) { /* table may not exist */ }

    try {
      const sessions = await sql`DELETE FROM member_sessions RETURNING id`;
      results.member_sessions = sessions.length;
    } catch (e) { /* table may not exist */ }

    // Clear user progress
    try {
      const progress = await sql`DELETE FROM user_progress RETURNING id`;
      results.user_progress = progress.length;
    } catch (e) { /* table may not exist */ }

    console.log('[ADMIN] Test data cleared:', results);

    return res.status(200).json({
      success: true,
      message: 'All test data cleared successfully',
      deleted: results,
    });
  } catch (error: any) {
    console.error('[ADMIN] Clear data error:', error);
    return res.status(500).json({
      error: 'Failed to clear data',
      message: error?.message
    });
  }
}
