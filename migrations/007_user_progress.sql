-- User progress tracking table for server-side course completion
-- This replaces localStorage-only tracking for cross-device sync

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  product_key TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS user_progress_email_product_lesson_idx
ON user_progress (customer_email, product_key, lesson_id);

-- Index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_user_progress_email
ON user_progress (customer_email);

-- Index for product-specific queries
CREATE INDEX IF NOT EXISTS idx_user_progress_product
ON user_progress (product_key);
