import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list, del } from '@vercel/blob';
import { ADMIN_EMAILS } from '../lib/schema';

// File type configurations
const FILE_CONFIGS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'images',
  },
  pdf: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf'],
    folder: 'books',
  },
  video: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    folder: 'videos',
  },
};

type FileType = keyof typeof FILE_CONFIGS;

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email, X-File-Type, X-File-Name');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check for Blob token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      error: 'File storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.',
    });
  }

  // Verify admin access
  const adminEmail = req.headers['x-admin-email'] as string;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Handle different methods
  if (req.method === 'GET') {
    return handleList(req, res);
  } else if (req.method === 'POST') {
    return handleUpload(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  try {
    const folder = req.query.folder as string || '';
    const prefix = folder ? `${folder}/` : '';

    const { blobs } = await list({ prefix });

    const files = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return res.status(200).json({ files });
  } catch (error) {
    console.error('List files error:', error);
    return res.status(500).json({ error: 'Failed to list files' });
  }
}

async function handleUpload(req: VercelRequest, res: VercelResponse) {
  try {
    const fileType = req.headers['x-file-type'] as FileType;
    const fileName = req.headers['x-file-name'] as string;
    const contentType = req.headers['content-type'] as string;

    if (!fileType || !FILE_CONFIGS[fileType]) {
      return res.status(400).json({
        error: 'Invalid file type. Must be: image, pdf, or video',
      });
    }

    if (!fileName) {
      return res.status(400).json({ error: 'File name is required (X-File-Name header)' });
    }

    const config = FILE_CONFIGS[fileType];

    // Check content type
    if (!config.allowedTypes.includes(contentType)) {
      return res.status(400).json({
        error: `Invalid content type for ${fileType}. Allowed: ${config.allowedTypes.join(', ')}`,
      });
    }

    // Read the body as buffer
    const chunks: Buffer[] = [];
    let totalSize = 0;

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer) => {
        totalSize += chunk.length;
        if (totalSize > config.maxSize) {
          reject(new Error(`File too large. Maximum size: ${config.maxSize / 1024 / 1024}MB`));
        }
        chunks.push(chunk);
      });
      req.on('end', resolve);
      req.on('error', reject);
    });

    const fileBuffer = Buffer.concat(chunks);

    // Generate a clean filename
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const pathname = `${config.folder}/${cleanFileName}`;

    // Upload to Vercel Blob
    const blob = await put(pathname, fileBuffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false, // Use exact filename
    });

    console.log(`[UPLOAD] File uploaded: ${blob.url} (${fileType})`);

    return res.status(200).json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to upload file',
    });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const url = req.query.url as string;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    await del(url);

    console.log(`[DELETE] File deleted: ${url}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
}
