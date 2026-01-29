-- Contentpreneur Hub - Neon PostgreSQL Setup
-- Run this SQL in your Neon database console to set up all required tables

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  level TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product files table
CREATE TABLE IF NOT EXISTS product_files (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media items table
CREATE TABLE IF NOT EXISTS media_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  file_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  payment_status TEXT DEFAULT 'pending',
  total_amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_intent_id TEXT,
  paystack_reference TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_key TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customer access table
CREATE TABLE IF NOT EXISTS customer_access (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Unique index for customer access
CREATE UNIQUE INDEX IF NOT EXISTS customer_access_email_product_idx
  ON customer_access(customer_email, product_id);

-- Abandoned carts table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL UNIQUE,
  product_keys TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  recovery_email_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  email_number INTEGER NOT NULL,
  scheduled_for TIMESTAMP NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  lead_magnet TEXT,
  pain_points TEXT,
  whatsapp TEXT,
  source TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Order emails sent table (deduplication)
CREATE TABLE IF NOT EXISTS order_emails_sent (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Unique index for order emails
CREATE UNIQUE INDEX IF NOT EXISTS order_emails_sent_order_type_idx
  ON order_emails_sent(order_id, email_type);

-- Consultation requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT,
  follower_count TEXT,
  current_income TEXT,
  goals TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Brand inquiries table
CREATE TABLE IF NOT EXISTS brand_inquiries (
  id SERIAL PRIMARY KEY,
  brand_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  campaign_details TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value INTEGER NOT NULL, -- 10 for 10%, or 500 for $5.00
  applies_to TEXT DEFAULT 'all', -- 'all' or comma-separated product_keys
  min_purchase INTEGER, -- Minimum purchase amount in cents
  max_uses INTEGER, -- NULL for unlimited
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_access_email ON customer_access(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_media_category ON media_items(category);
CREATE INDEX IF NOT EXISTS idx_media_published ON media_items(is_published);
CREATE INDEX IF NOT EXISTS idx_email_sequences_scheduled ON email_sequences(scheduled_for, is_sent);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(customer_email);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);

-- Seed products
INSERT INTO products (product_key, name, description, price_cents, is_active, level) VALUES
  ('content-foundations', 'Content Foundations', 'The essential foundation for building your content business - 6 video modules covering strategy, content creation, and audience building.', 3700, true, 'foundation'),
  ('niche-finder', 'Niche Finder Workbook', 'A step-by-step workbook to help you discover your profitable niche and target audience.', 1500, true, 'starter'),
  ('paids-workbook', 'PAIDS Framework Workbook', 'The complete workbook for implementing the PAIDS monetization framework in your content business.', 1500, true, 'starter'),
  ('starter-kit', 'Contentpreneur Starter Kit', 'The complete system: 9 video modules + Niche Finder + PAIDS Workbook. Everything you need to start your content business.', 6700, true, 'complete'),
  ('influencers-code', 'The Influencers Code', 'The secrets of successful influencers - strategies for growth, engagement, and monetization.', 2700, true, 'advanced'),
  ('tax-guide', 'Creator Tax Guide SA', 'Essential tax tips and strategies for South African content creators.', 1500, true, 'advanced')
ON CONFLICT (product_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  is_active = EXCLUDED.is_active,
  level = EXCLUDED.level;

-- Seed discount codes
INSERT INTO discount_codes (code, discount_type, discount_value, applies_to, min_purchase, max_uses, is_active) VALUES
  ('SAVE10', 'percentage', 10, 'all', NULL, NULL, true),
  ('SPECIAL10', 'percentage', 10, 'all', NULL, 100, true),
  ('FIRSTTIME20', 'percentage', 20, 'all', NULL, NULL, true),
  ('EARLYBIRD', 'fixed', 1000, 'starter-kit', 5000, 50, true)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  applies_to = EXCLUDED.applies_to,
  is_active = EXCLUDED.is_active;

-- Verify setup
SELECT 'Database setup complete! Products created: ' || COUNT(*)::text FROM products;
