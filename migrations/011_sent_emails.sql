-- Migration: 011_sent_emails
-- Description: Store sent emails for admin viewing
-- Created: 2026-03-15

-- Table to store all sent emails
CREATE TABLE IF NOT EXISTS sent_emails (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  email_type TEXT NOT NULL DEFAULT 'order_confirmation', -- order_confirmation, welcome_sequence, etc.
  subject TEXT NOT NULL,
  products_purchased TEXT[], -- Array of product keys purchased (main + order bumps)
  products_granted TEXT[], -- Array of all products granted (including bundles)
  amount_paid_cents INTEGER,
  currency TEXT DEFAULT 'ZAR',
  email_html TEXT, -- Full HTML content (optional, can be large)
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_sent_emails_customer ON sent_emails(customer_email);
CREATE INDEX IF NOT EXISTS idx_sent_emails_order ON sent_emails(order_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_type ON sent_emails(email_type);
