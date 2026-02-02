import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

// Admin emails - uses environment variable with fallback
const getAdminEmails = (): string[] => {
  const envAdmins = process.env.ADMIN_EMAILS;
  if (envAdmins) {
    return envAdmins.split(',').map(e => e.trim().toLowerCase());
  }
  // Fallback for development
  return [
    'info@nochill.co.za',
    'ndivhuwo@nochill.co.za',
    'chiefmuhanelwa@gmail.com',
  ];
};

// File type configurations
const FILE_CONFIGS: Record<string, { maxSize: number; folder: string }> = {
  image: { maxSize: 10 * 1024 * 1024, folder: 'images' },       // 10MB for images
  pdf: { maxSize: 100 * 1024 * 1024, folder: 'books' },         // 100MB for PDFs
  video: { maxSize: 2 * 1024 * 1024 * 1024, folder: 'videos' }, // 2GB for videos
};

// Simple in-memory upload session tokens (valid for 5 minutes)
const uploadSessions = new Map<string, { pathname: string; maxSize: number; expiresAt: number }>();

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
    const adminEmails = getAdminEmails();

    // Verify admin
    if (!email || !adminEmails.includes(email.toLowerCase())) {
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

    // Generate a secure upload session token instead of exposing BLOB token
    const sessionToken = crypto.randomUUID();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    uploadSessions.set(sessionToken, { pathname, maxSize: config.maxSize, expiresAt });

    // Clean up expired sessions
    for (const [key, session] of uploadSessions.entries()) {
      if (session.expiresAt < Date.now()) {
        uploadSessions.delete(key);
      }
    }

    // Return session token instead of actual BLOB token
    return res.status(200).json({
      uploadSessionToken: sessionToken,
      pathname,
      maxSize: config.maxSize,
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error) {
    console.error('[UPLOAD] Get upload URL error:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}

// Export for use by upload endpoint
export { uploadSessions };
