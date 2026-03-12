-- Migration: Add New Products
-- Created: 2026-03-11
-- Description: Adds Social Media Intro course and Contentpreneur book products

-- Insert new products (ON CONFLICT DO NOTHING prevents duplicates)
INSERT INTO products (product_key, name, description, price_cents, is_active, level) VALUES
  ('social-media-intro', 'Introduction to Social Media', 'Master social media marketing with 3 comprehensive video modules covering platform selection and content creation.', 2700, true, 'beginner'),
  ('contentpreneur-book-ebook', 'Contentpreneur Guide (eBook)', 'The definitive digital guide to building a profitable content business. 10 comprehensive chapters. PRE-ORDER: Coming April 2026.', 1900, true, 'all'),
  ('contentpreneur-book-hardcopy', 'Contentpreneur Guide (Hardcopy + eBook)', 'Physical hardcover book plus digital copy. Free shipping within South Africa. Author-signed copy included. PRE-ORDER: Coming April 2026.', 3700, true, 'all'),
  ('content-arsenal', 'Content Arsenal Expansion Pack', '100+ templates, swipe files, and tools to streamline your content creation workflow. Includes content calendars, caption templates, and analytics dashboards.', 3700, true, 'all')
ON CONFLICT (product_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  is_active = EXCLUDED.is_active;

-- Update existing product prices to match current config
UPDATE products SET price_cents = 6700 WHERE product_key = 'starter-kit';
UPDATE products SET price_cents = 1900 WHERE product_key = 'influencers-code';
UPDATE products SET price_cents = 4700 WHERE product_key = 'tax-guide';
UPDATE products SET price_cents = 1700 WHERE product_key = 'niche-finder';
UPDATE products SET price_cents = 1700 WHERE product_key = 'paids-workbook';
UPDATE products SET price_cents = 3700 WHERE product_key = 'content-foundations';
UPDATE products SET price_cents = 14700 WHERE product_key = 'contentpreneur-pro';
UPDATE products SET price_cents = 49700 WHERE product_key = 'coaching-session';
