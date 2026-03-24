import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, bookings as bookingsTable } from '../../lib/db';
import { desc, eq } from 'drizzle-orm';

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check admin authentication
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch all bookings, ordered by most recent first
      const bookings = await db
        .select()
        .from(bookingsTable)
        .orderBy(desc(bookingsTable.createdAt));

      return res.json({ bookings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'ID and status are required' });
      }

      // Update booking status
      await db
        .update(bookingsTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(bookingsTable.id, id));

      return res.json({ success: true, message: 'Booking status updated' });
    } catch (error) {
      console.error('Error updating booking:', error);
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
