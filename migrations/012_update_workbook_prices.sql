-- Migration: Update Workbook Prices
-- Created: 2026-03-23
-- Description: Updates Niche Finder (R197) and PAIDS Workbook (R297) prices

-- Update Niche Finder to R197 (19700 cents)
UPDATE products
SET price_cents = 19700,
    description = 'Find your profitable content niche with this step-by-step workbook. 6 guided exercises to discover where your passion meets profitability.'
WHERE product_key = 'niche-finder';

-- Update PAIDS Workbook to R297 (29700 cents)
UPDATE products
SET price_cents = 29700,
    description = 'Build 5 income streams from your content with the PAIDS monetization framework. Complete implementation guide with worksheets.'
WHERE product_key = 'paids-workbook';
