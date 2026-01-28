import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ENVIRONMENT: string;

  // Payment secrets
  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_WEBHOOK_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;

  // Email secrets
  RESEND_API_KEY: string;
  CONVERTKIT_API_KEY: string;
  CONVERTKIT_API_SECRET: string;

  // Analytics
  GA4_MEASUREMENT_ID: string;
  FACEBOOK_PIXEL_ID: string;

  // Auth
  MOCHA_USERS_SERVICE_API_URL?: string;
  MOCHA_USERS_SERVICE_API_KEY?: string;
}

export interface Product {
  id: number;
  product_key: string;
  name: string;
  description: string | null;
  price_cents: number;
  is_active: number;
  level: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductFile {
  id: number;
  product_id: number;
  title: string;
  description: string | null;
  file_type: string;
  r2_key: string;
  display_order: number;
  created_at: string;
}

export interface MediaItem {
  id: number;
  title: string;
  type: string;
  category: string | null;
  r2_key: string;
  is_published: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  total_amount_cents: number;
  currency: string;
  payment_intent_id: string | null;
  paystack_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_key: string;
  price_cents: number;
  created_at: string;
}

export interface CustomerAccess {
  id: number;
  customer_email: string;
  product_id: number;
  order_id: number | null;
  granted_at: string;
  expires_at: string | null;
}

export interface AbandonedCart {
  id: number;
  customer_email: string;
  product_keys: string;
  total_amount_cents: number;
  currency: string;
  recovery_email_sent: number;
  recovered: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSequence {
  id: number;
  customer_email: string;
  sequence_type: string;
  email_number: number;
  scheduled_for: string;
  is_sent: number;
  sent_at: string | null;
  created_at: string;
}

export interface EmailSubscriber {
  id: number;
  email: string;
  first_name: string | null;
  lead_magnet: string | null;
  pain_points: string | null;
  whatsapp: string | null;
  source: string | null;
  subscribed_at: string;
}

export interface ConsultationRequest {
  id: number;
  email: string;
  name: string;
  whatsapp: string | null;
  follower_count: string | null;
  current_income: string | null;
  goals: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BrandInquiry {
  id: number;
  brand_name: string;
  contact_email: string;
  contact_name: string | null;
  campaign_details: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Product bundles configuration
export const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'influencers-code', 'tax-guide', 'content-foundations', 'niche-finder', 'paids-workbook'],
};

// Admin authorized emails
export const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];
