import { Hono } from 'hono';
import type { Env, MediaItem } from '../types';

const app = new Hono<{ Bindings: Env }>();

// GET /api/media - List media items
app.get('/', async (c) => {
  const db = c.env.DB;
  const type = c.req.query('type');
  const category = c.req.query('category');
  const published = c.req.query('published');

  try {
    let query = 'SELECT * FROM media_items WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (published === 'true') {
      query += ' AND is_published = 1';
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const stmt = db.prepare(query);
    const media = params.length > 0
      ? await stmt.bind(...params).all<MediaItem>()
      : await stmt.all<MediaItem>();

    return c.json({ items: media.results });
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return c.json({ error: 'Failed to fetch media' }, 500);
  }
});

// GET /api/public/media/:id - Serve published media file
app.get('/public/:id', async (c) => {
  const db = c.env.DB;
  const r2 = c.env.R2_BUCKET;
  const id = c.req.param('id');

  try {
    const media = await db.prepare(
      'SELECT * FROM media_items WHERE id = ? AND is_published = 1'
    ).bind(id).first<MediaItem>();

    if (!media) {
      return c.json({ error: 'Media not found or not published' }, 404);
    }

    const object = await r2.get(media.r2_key);

    if (!object) {
      return c.json({ error: 'File not found in storage' }, 404);
    }

    // Handle range requests for video streaming
    const rangeHeader = c.req.header('Range');
    const contentType = getContentType(media.r2_key);

    if (rangeHeader && object.size) {
      const range = parseRange(rangeHeader, object.size);

      if (range) {
        const partialObject = await r2.get(media.r2_key, {
          range: { offset: range.start, length: range.end - range.start + 1 },
        });

        if (partialObject) {
          return new Response(partialObject.body, {
            status: 206,
            headers: {
              'Content-Type': contentType,
              'Content-Range': `bytes ${range.start}-${range.end}/${object.size}`,
              'Content-Length': String(range.end - range.start + 1),
              'Accept-Ranges': 'bytes',
            },
          });
        }
      }
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(object.size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Failed to serve media:', error);
    return c.json({ error: 'Failed to serve media' }, 500);
  }
});

// GET /api/public/media-by-title/:title - Get media by title
app.get('/public/by-title/:title', async (c) => {
  const db = c.env.DB;
  const r2 = c.env.R2_BUCKET;
  const title = decodeURIComponent(c.req.param('title'));

  try {
    const media = await db.prepare(
      'SELECT * FROM media_items WHERE title = ? AND is_published = 1'
    ).bind(title).first<MediaItem>();

    if (!media) {
      return c.json({ error: 'Media not found' }, 404);
    }

    const object = await r2.get(media.r2_key);

    if (!object) {
      return c.json({ error: 'File not found in storage' }, 404);
    }

    const contentType = getContentType(media.r2_key);

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(object.size),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Failed to serve media by title:', error);
    return c.json({ error: 'Failed to serve media' }, 500);
  }
});

// GET /api/files/:type/:filename - Secure file download
app.get('/files/:type/:filename', async (c) => {
  const r2 = c.env.R2_BUCKET;
  const type = c.req.param('type');
  const filename = c.req.param('filename');
  const r2Key = `${type}/${filename}`;

  try {
    const object = await r2.get(r2Key);

    if (!object) {
      return c.json({ error: 'File not found' }, 404);
    }

    const contentType = getContentType(r2Key);

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(object.size),
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Failed to serve file:', error);
    return c.json({ error: 'Failed to serve file' }, 500);
  }
});

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'pdf': 'application/pdf',
    'epub': 'application/epub+zip',
  };
  return types[ext || ''] || 'application/octet-stream';
}

function parseRange(rangeHeader: string, fileSize: number): { start: number; end: number } | null {
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return null;

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return null;
  }

  return { start, end };
}

export { app as mediaRoutes };
