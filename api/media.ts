import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, mediaItems } from '../lib/db';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, category, published } = req.query;

    let query = db.select().from(mediaItems);

    // For public access, only show published items
    if (published === 'true') {
      const items = await db
        .select()
        .from(mediaItems)
        .where(eq(mediaItems.isPublished, true));

      return res.status(200).json({ items });
    }

    const items = await db.select().from(mediaItems);

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return res.status(500).json({ error: 'Failed to fetch media' });
  }
}
