import { pgTable, serial, text, integer, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productKey: text('product_key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  isActive: boolean('is_active').default(true),
  level: text('level'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product files table
export const productFiles = pgTable('product_files', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  fileType: text('file_type').notNull(),
  fileUrl: text('file_url').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Media items table
export const mediaItems = pgTable('media_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  category: text('category'),
  fileUrl: text('file_url').notNull(),
  isPublished: boolean('is_published').default(false),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  paymentStatus: text('payment_status').default('pending'),
  totalAmountCents: integer('total_amount_cents').notNull(),
  currency: text('currency').notNull().default('USD'),
  paymentIntentId: text('payment_intent_id'),
  paystackReference: text('paystack_reference'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  productKey: text('product_key').notNull(),
  priceCents: integer('price_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customer access table
export const customerAccess = pgTable('customer_access', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'set null' }),
  grantedAt: timestamp('granted_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  emailProductIdx: uniqueIndex('customer_access_email_product_idx').on(table.customerEmail, table.productId),
}));

// Abandoned carts table
export const abandonedCarts = pgTable('abandoned_carts', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull().unique(),
  productKeys: text('product_keys').notNull(),
  totalAmountCents: integer('total_amount_cents').notNull(),
  currency: text('currency').default('USD'),
  recoveryEmailSent: boolean('recovery_email_sent').default(false),
  recovered: boolean('recovered').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Email sequences table
export const emailSequences = pgTable('email_sequences', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  sequenceType: text('sequence_type').notNull(),
  emailNumber: integer('email_number').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  isSent: boolean('is_sent').default(false),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Email subscribers table
export const emailSubscribers = pgTable('email_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  leadMagnet: text('lead_magnet'),
  painPoints: text('pain_points'),
  whatsapp: text('whatsapp'),
  source: text('source'),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});

// Order emails sent table (deduplication)
export const orderEmailsSent = pgTable('order_emails_sent', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  emailType: text('email_type').notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
}, (table) => ({
  orderEmailTypeIdx: uniqueIndex('order_emails_sent_order_type_idx').on(table.orderId, table.emailType),
}));

// Consultation requests table
export const consultationRequests = pgTable('consultation_requests', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  whatsapp: text('whatsapp'),
  followerCount: text('follower_count'),
  currentIncome: text('current_income'),
  goals: text('goals'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Brand inquiries table
export const brandInquiries = pgTable('brand_inquiries', {
  id: serial('id').primaryKey(),
  brandName: text('brand_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactName: text('contact_name'),
  campaignDetails: text('campaign_details'),
  budget: text('budget'),
  timeline: text('timeline'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product bundles configuration
export const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'influencers-code', 'tax-guide', 'content-foundations', 'niche-finder', 'paids-workbook'],
};

// Discount codes table
export const discountCodes = pgTable('discount_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // 'percentage' or 'fixed'
  discountValue: integer('discount_value').notNull(), // 10 for 10%, or 500 for $5
  appliesTo: text('applies_to').default('all'), // 'all' or specific product_key
  minPurchase: integer('min_purchase'), // Minimum purchase amount in cents
  maxUses: integer('max_uses'), // NULL for unlimited
  currentUses: integer('current_uses').default(0),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin authorized emails
export const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];
