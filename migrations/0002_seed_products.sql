-- Migration: Seed Products
-- Created: 2024-01-24
-- Description: Seeds initial products data

-- Insert core products
INSERT INTO products (product_key, name, description, price_cents, is_active, level) VALUES
  ('starter-kit', 'Contentpreneur Starter Kit', 'Complete 9-module course to launch your content creator journey. Includes the PAIDS Framework, niche finder, and monetization strategies.', 6700, 1, 'beginner'),
  ('influencers-code', 'The Influencer''s Code', 'Comprehensive ebook revealing the secrets of successful content creators. Learn brand partnerships, audience growth, and revenue diversification.', 2700, 1, 'intermediate'),
  ('tax-guide', 'Creator Tax Guide SA', 'Essential tax guide for South African content creators. Covers deductions, compliance, and financial planning.', 1500, 1, 'all'),
  ('niche-finder', 'Niche Finder Workbook', 'Interactive workbook to discover your perfect content niche. Includes market research templates and competitor analysis.', 1500, 1, 'beginner'),
  ('paids-workbook', 'PAIDS Framework Workbook', 'Hands-on workbook to implement the PAIDS content creation framework. Step-by-step exercises for each pillar.', 1500, 1, 'beginner'),
  ('content-foundations', 'Content Foundations Masterclass', 'Deep-dive masterclass on creating content that converts. Advanced strategies for engagement and growth.', 4700, 1, 'intermediate'),
  ('contentpreneur-pro', 'Contentpreneur Pro Bundle', 'Complete bundle with all courses, ebooks, and resources. Best value for serious content creators.', 14700, 1, 'all'),
  ('coaching-session', '1-on-1 Coaching Session', 'Personal 60-minute coaching call to accelerate your content creator journey. Customized strategy and feedback.', 15000, 1, 'all');
