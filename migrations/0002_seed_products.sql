-- Migration: Seed Products
-- Created: 2024-01-24
-- Description: Seeds initial products data
-- IMPORTANT: All prices are in ZAR CENTS (e.g., 69900 = R699.00)

-- Insert core products
INSERT INTO products (product_key, name, description, price_cents, is_active, level) VALUES
  ('starter-kit', '9-Module Personal Branding Course', 'Complete system to build and monetize your personal brand with 9 video modules, workbooks, and the NoChill Tool Stack.', 69900, 1, 'beginner'),
  ('influencers-code', 'The Influencer''s Code', 'Bestselling eBook with 6,000+ copies sold. 14 chapters on content monetization.', 19900, 1, 'intermediate'),
  ('tax-guide', 'Tax Guide for Contentpreneurs', 'Essential tax strategies and legal protection for South African content creators.', 44900, 1, 'all'),
  ('niche-finder', 'Niche Clarity Workbook', 'The guided workbook that finds your niche from what you have already lived. 7 steps. 90 minutes.', 19700, 1, 'beginner'),
  ('paids-workbook', 'PAIDS Framework Workbook', 'Master the PAIDS monetization framework to build 5 income streams.', 29700, 1, 'beginner'),
  ('content-foundations', 'Content Foundations Course', 'Master content creation fundamentals with 3 comprehensive video modules.', 39900, 1, 'intermediate'),
  ('contentpreneur-pro', 'Contentpreneur Pro Bundle', 'The complete system: Everything you need from mindset to monetization.', 129900, 1, 'all'),
  ('coaching-session', '1:1 Strategy Call', '60-minute personalized strategy session with Mr. NoChill.', 499900, 1, 'all');
