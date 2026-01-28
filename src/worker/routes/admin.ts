import { Hono } from 'hono';
import type { Env, MediaItem, Order, CustomerAccess, Product } from '../types';
import { authMiddleware } from '../middleware/auth';
import { adminAuthMiddleware } from '../middleware/adminAuth';

const app = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all admin routes
app.use('*', authMiddleware);
app.use('*', adminAuthMiddleware);

// POST /api/admin/media - Upload media file
app.post('/media', async (c) => {
  const db = c.env.DB;
  const r2 = c.env.R2_BUCKET;

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;

    if (!file || !title || !type) {
      return c.json({ error: 'File, title, and type are required' }, 400);
    }

    // Generate R2 key
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `${type}s/${timestamp}-${sanitizedName}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await r2.put(r2Key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    // Save to database
    const result = await db.prepare(`
      INSERT INTO media_items (title, type, category, r2_key, is_published)
      VALUES (?, ?, ?, ?, 0)
    `).bind(title, type, category || null, r2Key).run();

    return c.json({
      id: result.meta.last_row_id,
      title,
      type,
      category,
      r2_key: r2Key,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return c.json({ error: 'Failed to upload media' }, 500);
  }
});

// PATCH /api/admin/media/:id - Update media metadata
app.patch('/media/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json<{
    title?: string;
    category?: string;
    is_published?: number;
    display_order?: number;
  }>();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      values.push(body.title);
    }
    if (body.category !== undefined) {
      updates.push('category = ?');
      values.push(body.category);
    }
    if (body.is_published !== undefined) {
      updates.push('is_published = ?');
      values.push(body.is_published);
    }
    if (body.display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(body.display_order);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No updates provided' }, 400);
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    await db.prepare(`
      UPDATE media_items SET ${updates.join(', ')} WHERE id = ?
    `).bind(...values).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Media update error:', error);
    return c.json({ error: 'Failed to update media' }, 500);
  }
});

// DELETE /api/admin/media/:id - Delete media file
app.delete('/media/:id', async (c) => {
  const db = c.env.DB;
  const r2 = c.env.R2_BUCKET;
  const id = c.req.param('id');

  try {
    // Get media item
    const media = await db.prepare('SELECT * FROM media_items WHERE id = ?')
      .bind(id).first<MediaItem>();

    if (!media) {
      return c.json({ error: 'Media not found' }, 404);
    }

    // Delete from R2
    await r2.delete(media.r2_key);

    // Delete from database
    await db.prepare('DELETE FROM media_items WHERE id = ?').bind(id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return c.json({ error: 'Failed to delete media' }, 500);
  }
});

// GET /api/admin/contacts - List email subscribers
app.get('/contacts', async (c) => {
  const db = c.env.DB;

  try {
    const contacts = await db.prepare(
      'SELECT * FROM email_subscribers ORDER BY subscribed_at DESC'
    ).all();

    return c.json({ contacts: contacts.results });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

// GET /api/admin/consultation-requests - List consultation requests
app.get('/consultation-requests', async (c) => {
  const db = c.env.DB;

  try {
    const requests = await db.prepare(
      'SELECT * FROM consultation_requests ORDER BY created_at DESC'
    ).all();

    return c.json({ requests: requests.results });
  } catch (error) {
    console.error('Failed to fetch consultation requests:', error);
    return c.json({ error: 'Failed to fetch consultation requests' }, 500);
  }
});

// PATCH /api/admin/consultation-requests/:id - Update consultation status
app.patch('/consultation-requests/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json<{ status: string }>();

  try {
    await db.prepare(`
      UPDATE consultation_requests
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(body.status, id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to update consultation request:', error);
    return c.json({ error: 'Failed to update' }, 500);
  }
});

// GET /api/admin/brand-inquiries - List brand inquiries
app.get('/brand-inquiries', async (c) => {
  const db = c.env.DB;

  try {
    const inquiries = await db.prepare(
      'SELECT * FROM brand_inquiries ORDER BY created_at DESC'
    ).all();

    return c.json({ inquiries: inquiries.results });
  } catch (error) {
    console.error('Failed to fetch brand inquiries:', error);
    return c.json({ error: 'Failed to fetch brand inquiries' }, 500);
  }
});

// PATCH /api/admin/brand-inquiries/:id - Update brand inquiry status
app.patch('/brand-inquiries/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json<{ status: string }>();

  try {
    await db.prepare(`
      UPDATE brand_inquiries
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(body.status, id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to update brand inquiry:', error);
    return c.json({ error: 'Failed to update' }, 500);
  }
});

// GET /api/admin/orders - List all orders
app.get('/orders', async (c) => {
  const db = c.env.DB;

  try {
    const orders = await db.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all<Order>();

    return c.json({ orders: orders.results });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// GET /api/admin/customer-access - List access records
app.get('/customer-access', async (c) => {
  const db = c.env.DB;

  try {
    const records = await db.prepare(`
      SELECT ca.*, p.product_key, p.name as product_name
      FROM customer_access ca
      JOIN products p ON ca.product_id = p.id
      ORDER BY ca.granted_at DESC
    `).all();

    return c.json({ records: records.results });
  } catch (error) {
    console.error('Failed to fetch customer access:', error);
    return c.json({ error: 'Failed to fetch customer access' }, 500);
  }
});

// POST /api/admin/grant-access - Manually grant product access
app.post('/grant-access', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ email: string; productKey: string }>();

  if (!body.email || !body.productKey) {
    return c.json({ error: 'Email and product key are required' }, 400);
  }

  try {
    const product = await db.prepare(
      'SELECT * FROM products WHERE product_key = ?'
    ).bind(body.productKey).first<Product>();

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const normalizedEmail = body.email.toLowerCase().trim();

    // Check if access already exists
    const existing = await db.prepare(`
      SELECT * FROM customer_access WHERE customer_email = ? AND product_id = ?
    `).bind(normalizedEmail, product.id).first();

    if (existing) {
      return c.json({ error: 'Access already exists' }, 400);
    }

    await db.prepare(`
      INSERT INTO customer_access (customer_email, product_id)
      VALUES (?, ?)
    `).bind(normalizedEmail, product.id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to grant access:', error);
    return c.json({ error: 'Failed to grant access' }, 500);
  }
});

// DELETE /api/admin/revoke-access/:id - Revoke access record
app.delete('/revoke-access/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');

  try {
    await db.prepare('DELETE FROM customer_access WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to revoke access:', error);
    return c.json({ error: 'Failed to revoke access' }, 500);
  }
});

export { app as adminRoutes };
