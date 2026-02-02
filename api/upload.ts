import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list, del } from '@vercel/blob';

// Admin emails that can upload files
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

// File type configurations
const FILE_CONFIGS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'images',
  },
  pdf: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf'],
    folder: 'books',
  },
  video: {
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
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
  // Always return JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Email, X-File-Type, X-File-Name');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    // Check for Blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[UPLOAD] BLOB_READ_WRITE_TOKEN not set');
      return res.status(500).json({
        error: 'File storage not configured. Please add BLOB_READ_WRITE_TOKEN to your Vercel environment variables.',
        setup_instructions: 'Go to Vercel Dashboard → Storage → Create Blob Store → Copy token to Environment Variables',
      });
    }

    // Verify admin access
    const adminEmail = req.headers['x-admin-email'] as string;
    console.log('[UPLOAD] Admin email:', adminEmail);

    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
      return res.status(403).json({ error: 'Admin access required. Please log in with an admin email.' });
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
  } catch (error) {
    console.error('[UPLOAD] Handler error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  try {
    const folder = req.query.folder as string || '';
    const prefix = folder ? `${folder}/` : '';

    console.log('[UPLOAD] Listing files with prefix:', prefix);
    const { blobs } = await list({ prefix });

    const files = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return res.status(200).json({ files });
  } catch (error) {
    console.error('[UPLOAD] List files error:', error);
    return res.status(500).json({
      error: 'Failed to list files',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleUpload(req: VercelRequest, res: VercelResponse) {
  try {
    const fileType = req.headers['x-file-type'] as FileType;
    const fileName = req.headers['x-file-name'] as string;
    const contentType = req.headers['content-type'] as string;

    console.log('[UPLOAD] Upload request:', { fileType, fileName, contentType });

    if (!fileType || !FILE_CONFIGS[fileType]) {
      return res.status(400).json({
        error: 'Invalid file type. Must be: image, pdf, or video',
      });
    }

    if (!fileName) {
      return res.status(400).json({ error: 'File name is required (X-File-Name header)' });
    }

    const fileConfig = FILE_CONFIGS[fileType];

    // Check content type
    if (!fileConfig.allowedTypes.includes(contentType)) {
      return res.status(400).json({
        error: `Invalid content type "${contentType}" for ${fileType}. Allowed: ${fileConfig.allowedTypes.join(', ')}`,
      });
    }

    // Read the body as buffer
    const chunks: Buffer[] = [];
    let totalSize = 0;

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer) => {
        totalSize += chunk.length;
        if (totalSize > fileConfig.maxSize) {
          reject(new Error(`File too large. Maximum size: ${fileConfig.maxSize / 1024 / 1024}MB`));
        }
        chunks.push(chunk);
      });
      req.on('end', resolve);
      req.on('error', reject);
    });

    const fileBuffer = Buffer.concat(chunks);
    console.log('[UPLOAD] File size:', fileBuffer.length, 'bytes');

    // Generate a clean filename
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const pathname = `${fileConfig.folder}/${cleanFileName}`;

    console.log('[UPLOAD] Uploading to:', pathname);

    // Upload to Vercel Blob
    const blob = await put(pathname, fileBuffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false, // Use exact filename
    });

    console.log('[UPLOAD] Success:', blob.url);

    return res.status(200).json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error('[UPLOAD] Upload error:', error);
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

    console.log('[UPLOAD] Deleting:', url);
    await del(url);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[UPLOAD] Delete error:', error);
    return res.status(500).json({
      error: 'Failed to delete file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
