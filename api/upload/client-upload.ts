import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// Admin emails that can upload files
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request: req as any,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Verify admin access from client payload
        let payload: { email?: string; fileType?: string } = {};

        try {
          if (clientPayload) {
            payload = JSON.parse(clientPayload);
          }
        } catch (e) {
          console.error('[CLIENT-UPLOAD] Failed to parse client payload:', e);
        }

        const email = payload.email?.toLowerCase();

        if (!email || !ADMIN_EMAILS.includes(email)) {
          throw new Error('Admin access required');
        }

        console.log('[CLIENT-UPLOAD] Generating token for:', pathname, 'by:', email);

        // Return token configuration
        return {
          allowedContentTypes: [
            'application/pdf',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
          ],
          tokenPayload: JSON.stringify({
            email,
            fileType: payload.fileType,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs after the file is uploaded
        console.log('[CLIENT-UPLOAD] Upload completed:', blob.url);

        try {
          const payload = tokenPayload ? JSON.parse(tokenPayload) : {};
          console.log('[CLIENT-UPLOAD] Uploaded by:', payload.email, 'Type:', payload.fileType);
        } catch (e) {
          console.error('[CLIENT-UPLOAD] Failed to parse token payload:', e);
        }
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('[CLIENT-UPLOAD] Error:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Upload failed',
    });
  }
}
