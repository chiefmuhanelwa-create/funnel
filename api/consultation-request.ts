import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, consultationRequests } from '../lib/db';

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
    const { email, name, whatsapp, followerCount, currentIncome, goals } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    await db.insert(consultationRequests).values({
      email: email.toLowerCase().trim(),
      name,
      whatsapp: whatsapp || null,
      followerCount: followerCount || null,
      currentIncome: currentIncome || null,
      goals: goals || null,
    });

    return res.status(200).json({ success: true, message: 'Consultation request submitted' });
  } catch (error) {
    console.error('Consultation request error:', error);
    return res.status(500).json({ error: 'Failed to submit consultation request' });
  }
}
