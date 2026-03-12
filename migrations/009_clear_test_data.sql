-- Migration: Clear Test Data
-- Created: 2026-03-12
-- Description: Clears all test orders, access records, and email sequences for fresh testing

-- Delete email sequences (must be done before orders due to potential FK)
DELETE FROM email_sequences;

-- Delete order items (FK to orders)
DELETE FROM order_items;

-- Delete customer access records
DELETE FROM customer_access;

-- Delete orders
DELETE FROM orders;

-- Delete abandoned carts
DELETE FROM abandoned_carts WHERE 1=1;

-- Reset analytics events (optional - comment out if you want to keep analytics)
-- DELETE FROM analytics_events;

-- Confirmation message
SELECT 'Test data cleared successfully. Ready for fresh testing.' as status;
