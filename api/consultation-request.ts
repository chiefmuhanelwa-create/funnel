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
    const {
      email,
      name,
      phone,
      instagram,
      currentStatus,
      goals,
      challenges,
      budget,
      preferredDate,
      additionalNotes,
      // Also support legacy field names
      whatsapp,
      followerCount,
      currentIncome,
    } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Combine all notes into goals field for database compatibility
    const combinedGoals = [
      goals,
      challenges ? `Challenges: ${challenges}` : null,
      additionalNotes ? `Notes: ${additionalNotes}` : null,
    ].filter(Boolean).join('\n\n');

    await db.insert(consultationRequests).values({
      email: email.toLowerCase().trim(),
      name,
      whatsapp: phone || whatsapp || null,
      followerCount: instagram || followerCount || null,
      currentIncome: budget || currentStatus || currentIncome || null,
      goals: combinedGoals || null,
    });

    return res.status(200).json({ success: true, message: 'Consultation request submitted' });
  } catch (error) {
    console.error('Consultation request error:', error);
    return res.status(500).json({ error: 'Failed to submit consultation request' });
  }
}
