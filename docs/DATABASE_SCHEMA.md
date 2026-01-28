# Database Schema

This document describes the complete database schema for Contentpreneur Hub, using Cloudflare D1 (SQLite).

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│  products   │───────│  product_files  │       │ media_items │
└─────────────┘       └─────────────────┘       └─────────────┘
       │
       │
       ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   orders    │───────│   order_items   │       │ customer_access │
└─────────────┘       └─────────────────┘       └─────────────────┘
       │                                                │
       │                                                │
       ▼                                                ▼
┌─────────────────────┐                         (email-based lookup)
│ order_emails_sent   │
└─────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ abandoned_carts │    │ email_sequences │    │email_subscribers│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Tables

### 1. products

Stores all digital products (courses, ebooks, workbooks, coaching).

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  level TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `product_key` | TEXT | Unique identifier (e.g., `starter-kit`, `influencers-code`) |
| `name` | TEXT | Display name |
| `description` | TEXT | Product description |
| `price_cents` | INTEGER | Price in cents (USD) |
| `is_active` | BOOLEAN | Whether product is available for purchase |
| `level` | TEXT | Product tier/level |

**Note:** Product bundles are defined in code (`PRODUCT_BUNDLES` in `worker/index.ts`), not in this table.

### 2. product_files

Files associated with each product (PDFs, videos, resources).

```sql
CREATE TABLE product_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `product_id` | INTEGER | Foreign key to products |
| `title` | TEXT | File title |
| `description` | TEXT | File description |
| `file_type` | TEXT | Type of file (pdf, video, etc.) |
| `r2_key` | TEXT | R2 storage key (e.g., `videos/module1.mp4`) |
| `display_order` | INTEGER | Order for display |

**r2_key format:** `{type}/{filename}` (e.g., `videos/module1.mp4`)

### 3. media_items

All media uploaded through admin (photos, videos, books).

```sql
CREATE TABLE media_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  r2_key TEXT NOT NULL,
  is_published BOOLEAN DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `title` | TEXT | Media title |
| `type` | TEXT | Media type (photo, video, book) |
| `category` | TEXT | Purpose category (see below) |
| `r2_key` | TEXT | R2 storage key |
| `is_published` | BOOLEAN | **CRITICAL: Must be 1 for public access** |
| `display_order` | INTEGER | Order for display |

**Categories:**
- `hero_photo` - Homepage hero image
- `profile` - Profile photos
- `story_photo` - Achievement/story photos
- `brand_logo` - Partner brand logos
- `product_cover` - Product cover images
- `Course Module Video` - Lesson videos

### 4. orders

Customer orders and payment tracking.

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  payment_status TEXT DEFAULT 'pending',
  total_amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  payment_intent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `order_number` | TEXT | Unique order identifier (format: `ORD-{timestamp}-{random}`) |
| `customer_email` | TEXT | Customer email (normalized: lowercase, trimmed) |
| `customer_name` | TEXT | Customer name |
| `payment_status` | TEXT | Status: `pending`, `completed`, `failed`, `refunded` |
| `total_amount_cents` | INTEGER | Total in cents |
| `currency` | TEXT | `USD` or `ZAR` (Paystack uses ZAR) |
| `payment_intent_id` | TEXT | Paystack reference or Stripe payment intent |

### 5. order_items

Individual products within an order.

```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  product_key TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `order_id` | INTEGER | Foreign key to orders |
| `product_id` | INTEGER | Foreign key to products |
| `product_key` | TEXT | Product identifier |
| `price_cents` | INTEGER | Price at time of purchase |

Links orders to products for access control.

### 6. customer_access

Controls what products users can access.

```sql
CREATE TABLE customer_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_email TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  order_id INTEGER,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `customer_email` | TEXT | Customer email (normalized) |
| `product_id` | INTEGER | Foreign key to products |
| `order_id` | INTEGER | Foreign key to orders |
| `granted_at` | DATETIME | When access was granted |
| `expires_at` | DATETIME | Optional expiration date |

**Critical Notes:**
- This table is checked by ALL member pages to verify access
- Email is normalized (lowercase, trimmed) before storage and lookup
- Query for access check: `SELECT * FROM customer_access WHERE customer_email = ? AND product_id = ?`

### 7. abandoned_carts

Tracks incomplete checkouts for recovery emails.

```sql
CREATE TABLE abandoned_carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_email TEXT NOT NULL,
  product_keys TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  recovery_email_sent BOOLEAN DEFAULT 0,
  recovered BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `customer_email` | TEXT | Customer email |
| `product_keys` | TEXT | JSON array of product keys |
| `total_amount_cents` | INTEGER | Cart total |
| `currency` | TEXT | Currency code |
| `recovery_email_sent` | BOOLEAN | Whether recovery email was sent |
| `recovered` | BOOLEAN | Whether cart was recovered (converted to order) |

**Automated recovery email** sent after 1 hour via cron job.

### 8. email_sequences

Scheduled email campaigns (welcome series, nurture sequences).

```sql
CREATE TABLE email_sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_email TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  email_number INTEGER NOT NULL,
  scheduled_for DATETIME NOT NULL,
  is_sent BOOLEAN DEFAULT 0,
  sent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `customer_email` | TEXT | Customer email |
| `sequence_type` | TEXT | Type of sequence (e.g., `welcome`, `nurture`) |
| `email_number` | INTEGER | Position in sequence (1, 2, 3...) |
| `scheduled_for` | DATETIME | When to send |
| `is_sent` | BOOLEAN | Whether email was sent |
| `sent_at` | DATETIME | When email was actually sent |

Processed by cron job: `/api/cron/send-welcome-emails`

### 9. email_subscribers

Lead magnet opt-ins (free workbooks, guides).

```sql
CREATE TABLE email_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  lead_magnet TEXT,
  pain_points TEXT,
  whatsapp TEXT,
  source TEXT,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `email` | TEXT | Subscriber email |
| `first_name` | TEXT | First name |
| `lead_magnet` | TEXT | Which free resource they opted in for |
| `pain_points` | TEXT | Self-reported challenges |
| `whatsapp` | TEXT | WhatsApp number |
| `source` | TEXT | How they found us |

**Uses:**
- Synced to ConvertKit for email marketing
- Used for abandoned cart recovery
- Used for nurture campaigns

### 10. order_emails_sent

Deduplication table to prevent duplicate emails.

```sql
CREATE TABLE order_emails_sent (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  email_type TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  UNIQUE(order_id, email_type)
);
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `order_id` | INTEGER | Foreign key to orders |
| `email_type` | TEXT | Type: `order_confirmation`, `welcome_day1`, etc. |
| `sent_at` | DATETIME | When sent |

**Critical:** Prevents resending emails if webhook fires multiple times.

## Product Bundles System

When a customer purchases certain products, they automatically get access to bundled products:

```typescript
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  // $67 starter kit includes these two workbooks

  'contentpreneur-pro': ['starter-kit', 'influencers-code', 'tax-guide', 'content-foundations'],
  // $147 pro bundle includes all 4 products
};
```

### Access Grant Flow

```
Purchase completed → grantProductAccess() called
         │
         ▼
Get main product + check PRODUCT_BUNDLES
         │
         ▼
For each product (main + bundled):
  - Check if customer already has access
  - If not, create record in customer_access table
  - Link to order_id
         │
         ▼
Return: { granted: [...], skipped: [...], failed: [...] }
```

## Database Migrations

### Purpose
- Define schema changes
- Must include both `up_sql` and `down_sql`
- Run in both dev and prod independently
- Immutable - cannot edit after creation

### Example Migration

```sql
-- up_sql (apply changes)
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- down_sql (revert changes)
DROP TABLE products;
```

### Seeding Data

For content that MUST exist in production:

```sql
-- up_sql
INSERT INTO media_items (title, type, r2_key, is_published, category)
VALUES
  ('Module 1 Video', 'video', 'videos/module1.mp4', 1, 'course_module'),
  ('Hero Photo', 'photo', 'photos/hero.jpg', 1, 'hero_photo');

-- down_sql
DELETE FROM media_items WHERE title IN ('Module 1 Video', 'Hero Photo');
```

**Note:** Migrations should only seed database records. The actual files must be uploaded to R2 separately or use Mocha Assets.

## Common Queries

### Check User Access
```sql
SELECT ca.*, p.product_key, p.name
FROM customer_access ca
JOIN products p ON ca.product_id = p.id
WHERE ca.customer_email = ?;
```

### Get Order with Items
```sql
SELECT o.*, oi.product_key, oi.price_cents
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = ?;
```

### Check for Duplicate Emails
```sql
SELECT * FROM order_emails_sent
WHERE order_id = ? AND email_type = 'order_confirmation';
```

### Get Published Media by Category
```sql
SELECT * FROM media_items
WHERE category = ? AND is_published = 1
ORDER BY display_order;
```
