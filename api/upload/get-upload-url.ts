import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

// Admin emails that can upload files
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

// File type configurations
const FILE_CONFIGS: Record<string, { maxSize: number; folder: string }> = {
  image: { maxSize: 5 * 1024 * 1024, folder: 'images' },
  pdf: { maxSize: 50 * 1024 * 1024, folder: 'books' },
  video: { maxSize: 500 * 1024 * 1024, folder: 'videos' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, fileType, fileName, contentType } = req.body;

    // Verify admin
    if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Check blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN not configured' });
    }

    // Validate file type
    const config = FILE_CONFIGS[fileType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid file type. Must be: image, pdf, or video' });
    }

    // Generate pathname
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const pathname = `${config.folder}/${cleanFileName}`;

    // Return the token and pathname for client-side upload
    return res.status(200).json({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      pathname,
      maxSize: config.maxSize,
    });
  } catch (error) {
    console.error('[UPLOAD] Get upload URL error:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
