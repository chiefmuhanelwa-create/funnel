-- Migration: Add New Products
-- Created: 2026-03-11
-- Updated: 2026-03-15 - Added missing contentpreneur-pro and coaching-session products
-- Description: Adds Social Media Intro course, Contentpreneur book products, and ensures all products exist

-- Insert ALL products (ON CONFLICT DO UPDATE ensures they exist with correct values)
INSERT INTO products (product_key, name, description, price_cents, is_active, level) VALUES
  ('social-media-intro', 'Introduction to Social Media', 'Master social media marketing with 3 comprehensive video modules covering platform selection and content creation.', 2700, true, 'beginner'),
  ('contentpreneur-book-ebook', 'Contentpreneur Guide (eBook)', 'The definitive digital guide to building a profitable content business. 10 comprehensive chapters. PRE-ORDER: Coming April 2026.', 1900, true, 'all'),
  ('contentpreneur-book-hardcopy', 'Contentpreneur Guide (Hardcopy + eBook)', 'Physical hardcover book plus digital copy. Free shipping within South Africa. Author-signed copy included. PRE-ORDER: Coming April 2026.', 3700, true, 'all'),
  ('content-arsenal', 'Content Arsenal Expansion Pack', '100+ templates, swipe files, and tools to streamline your content creation workflow. Includes content calendars, caption templates, and analytics dashboards.', 3700, true, 'all'),
  -- Add missing products that were referenced in code but never inserted
  ('contentpreneur-pro', 'Contentpreneur Pro Bundle', 'Complete bundle with all courses, ebooks, and resources. Best value for serious content creators.', 14700, true, 'all'),
  ('coaching-session', '1-on-1 Coaching Session', 'Personal 60-minute coaching call to accelerate your content creator journey. Customized strategy and feedback.', 49700, true, 'all'),
  -- Ensure core products exist
  ('starter-kit', 'Contentpreneur Starter Kit', 'The complete system: 9 video modules + Niche Finder + PAIDS Workbook. Everything you need to start your content business.', 6700, true, 'complete'),
  ('influencers-code', 'The Influencers Code', 'The secrets of successful influencers - strategies for growth, engagement, and monetization.', 1900, true, 'advanced'),
  ('tax-guide', 'Creator Tax Guide SA', 'Essential tax tips and strategies for South African content creators.', 4700, true, 'advanced'),
  ('niche-finder', 'Niche Finder Workbook', 'A step-by-step workbook to help you discover your profitable niche and target audience.', 1700, true, 'starter'),
  ('paids-workbook', 'PAIDS Framework Workbook', 'The complete workbook for implementing the PAIDS monetization framework in your content business.', 1700, true, 'starter'),
  ('content-foundations', 'Content Foundations', 'The essential foundation for building your content business - 6 video modules covering strategy, content creation, and audience building.', 3700, true, 'foundation')
ON CONFLICT (product_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  is_active = EXCLUDED.is_active;
