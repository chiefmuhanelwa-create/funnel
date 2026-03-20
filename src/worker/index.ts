import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';

// Import route handlers
import { mediaRoutes } from './routes/media';
import { productRoutes } from './routes/products';
import { checkoutRoutes } from './routes/checkout';
import { webhookRoutes } from './routes/webhooks';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { leadRoutes } from './routes/leads';
import { cronRoutes } from './routes/cron';

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analytics config endpoint
app.get('/api/analytics/config', (c) => {
  return c.json({
    ga4MeasurementId: c.env.GA4_MEASUREMENT_ID || '',
    facebookPixelId: c.env.FACEBOOK_PIXEL_ID || '',
  });
});

// Exchange rate endpoint (deprecated - all prices are now in ZAR)
app.get('/api/exchange-rate', (c) => {
  return c.json({
    message: 'Exchange rate endpoint deprecated - all prices are now in ZAR',
    currency: 'ZAR',
  });
});

// Mount route handlers
app.route('/api/media', mediaRoutes);
app.route('/api/products', productRoutes);
app.route('/api/checkout', checkoutRoutes);
app.route('/api/webhooks', webhookRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api', leadRoutes);
app.route('/api/cron', cronRoutes);

// Serve static files for SPA
app.get('*', async (c) => {
  // This would be handled by Cloudflare Pages or Workers Sites
  return c.text('Contentpreneur Hub - API Server', 200);
});

// Scheduled handler for cron jobs
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Process email sequences every 15 minutes
    ctx.waitUntil(processScheduledEmails(env));
    // Process abandoned carts
    ctx.waitUntil(processAbandonedCarts(env));
  },
};

async function processScheduledEmails(env: Env) {
  try {
    const response = await fetch(`https://contentpreneurhub.online/api/cron/send-welcome-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Scheduled emails processed:', await response.text());
  } catch (error) {
    console.error('Failed to process scheduled emails:', error);
  }
}

async function processAbandonedCarts(env: Env) {
  try {
    const response = await fetch(`https://contentpreneurhub.online/api/cron/send-abandoned-cart-emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Abandoned carts processed:', await response.text());
  } catch (error) {
    console.error('Failed to process abandoned carts:', error);
  }
}
