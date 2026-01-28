# Contentpreneur Hub - System Architecture

## Overview

Contentpreneur Hub is a digital product platform for content creators, offering courses, ebooks, workbooks, and coaching services. This document provides a comprehensive technical breakdown of the entire system architecture, data flow, and implementation details.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite + TailwindCSS |
| **Backend** | Cloudflare Workers (Hono framework) |
| **Database** | Cloudflare D1 (SQLite) |
| **File Storage** | Cloudflare R2 (S3-compatible object storage) |
| **Authentication** | Mocha Users Service (OAuth via Google) |
| **Payment Processing** | Paystack (ZAR) + Stripe (USD) |
| **Email Service** | Resend API |
| **Email Marketing** | ConvertKit integration |
| **Analytics** | Google Analytics 4 + Facebook Pixel |

## Hosting Environment

- **Platform**: Cloudflare Workers (serverless, edge-computed)
- **Environments**: Separate development and production environments
- **Critical Note**: Dev and prod have completely separate databases AND R2 storage buckets

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React 18 + TypeScript + Vite + TailwindCSS + Framer Motion     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE WORKERS                            │
│                      (Hono Framework)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Auth    │  │ Payments │  │  Media   │  │  Webhooks/Cron   │ │
│  │ Middleware│  │ Endpoints│  │ Handlers │  │    Handlers      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Cloudflare  │ │   Paystack   │ │  Cloudflare  │ │    Resend    │
│      D1      │ │   / Stripe   │ │      R2      │ │  ConvertKit  │
│  (Database)  │ │  (Payments)  │ │   (Files)    │ │   (Email)    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Authentication System

### Two Authentication Methods

#### 1. OAuth (Preferred) - via Mocha Users Service

- Google OAuth login flow
- Session token stored in httpOnly cookie: `__mocha_session_token`
- Backend endpoints use `authMiddleware` from `@getmocha/users-service/backend`
- Frontend uses `useAuth()` hook from `@getmocha/users-service/react`

#### 2. Email Lookup (Fallback)

- For users who can't/won't use OAuth
- `POST /api/check-access` with email returns product access
- Stored in sessionStorage (expires after 24 hours)
- `MemberAccessContext` handles both auth methods transparently

### Admin Access

- Hardcoded email whitelist in `src/worker/middleware/adminAuth.ts`
- Authorized emails:
  - `info@nochill.co.za`
  - `ndivhuwo@nochill.co.za`
  - `chiefmuhanelwa@gmail.com`
- All `/api/admin/*` routes protected by `adminAuthMiddleware`

### Access Control Flow

```
User visits /members/starter-kit
         │
         ▼
useMemberAccess() checks:
  1. Is user authenticated via OAuth? → Check oauthProductKeys
  2. Is user authenticated via email lookup? → Check emailAccess.productKeys
  3. Does user have 'starter-kit' in their product list?
         │
         ▼
┌────────┴────────┐
│                 │
▼                 ▼
YES: Show content    NO: Redirect to login or show "Access Denied"
```

## Frontend Architecture

### Project Structure

```
src/react-app/
├── App.tsx                 # Root component, router setup
├── main.tsx               # Entry point
├── index.css              # Global styles, Tailwind imports
├── components/            # Reusable UI components
│   ├── Hero.tsx          # Homepage hero section
│   ├── About.tsx         # Story section
│   ├── StickyNav.tsx     # Navigation bar
│   ├── Footer.tsx        # Site footer
│   └── ...
├── pages/                 # Route components
│   ├── Home.tsx          # Landing page (/)
│   ├── CheckoutStarterKit.tsx  # Checkout flow
│   ├── StarterKit.tsx    # Member access to course
│   ├── Dashboard.tsx     # User dashboard
│   ├── Admin.tsx         # Admin panel
│   └── ...
├── context/              # React Context providers
│   └── MemberAccessContext.tsx  # Authentication & access control
└── utils/                # Utility functions
    ├── analytics.ts      # GA4 + Facebook Pixel tracking
    └── loadAnalytics.ts  # Dynamic config loading
```

### Key Pages

#### Public Pages
- `/` - Homepage (Hero, About, PAIDS Hub, Lead Magnets, CTA)
- `/contentpreneur-starter-kit` - Product sales page
- `/products/*` - Individual product pages
- `/free/*` - Lead magnet opt-in pages
- `/checkout/*` - Payment checkout pages

#### Member Pages (Auth Required)
- `/members` - Members hub (shows purchased products)
- `/members/starter-kit` - 9-module course access
- `/members/influencers-code` - eBook reader
- `/members/coaching` - Coaching session booking
- `/dashboard` - User account dashboard

#### Admin Pages (Admin Auth Required)
- `/admin` - Media management, contacts, consultations
- `/admin/convertkit` - Email marketing sync

### State Management

**Global State:**
- `AuthProvider` (from `@getmocha/users-service/react`) - OAuth authentication
- `MemberAccessContext` - Product access control, email-based access

**Component State:**
- Local state with `useState` for forms, loading states
- No Redux or external state library needed

## File Storage (R2)

### Configuration

- **Binding**: `R2_BUCKET` (configured in `wrangler.json`)
- **API**: S3-compatible
- **Critical**: Dev and prod have separate buckets

### File Organization

```
R2 Bucket Structure:
├── photos/
│   └── {timestamp}-{filename}
├── videos/
│   └── {timestamp}-{filename}
├── books/
│   └── {timestamp}-{filename}
└── documents/
    └── {timestamp}-{filename}
```

### Upload Flow

```
Admin uploads file via /admin
         │
         ▼
File sent to POST /api/media
         │
         ▼
Backend generates r2_key: "{type}s/{timestamp}-{filename}"
         │
         ▼
Upload to R2: await env.R2_BUCKET.put(r2_key, arrayBuffer)
         │
         ▼
Save metadata to media_items table
         │
         ▼
Return media item record
```

### Video Streaming with Range Requests

```typescript
const rangeHeader = c.req.header("Range");
if (rangeHeader) {
  // Parse range: bytes=0-1023
  const object = await env.R2_BUCKET.get(r2_key, {
    range: { offset: start, length: end - start + 1 }
  });
  return new Response(object.body, {
    status: 206,
    headers: { "Content-Range": `bytes ${start}-${end}/${size}` }
  });
}
```

This enables:
- Video seeking/scrubbing
- Progressive loading
- Bandwidth optimization

## Analytics System

### Google Analytics 4

- **Configuration**: Measurement ID stored in `GA4_MEASUREMENT_ID` secret
- **Injection**: Into `index.html` at runtime
- **Client-side tracking**: via `src/react-app/utils/analytics.ts`

**Tracked Events:**
```typescript
// Page views (automatic)
analytics.pageView('/checkout/starter-kit')

// E-commerce events
analytics.beginCheckout({ value: 67, currency: 'USD', items: [...] })
analytics.addPaymentInfo({ value: 67, currency: 'USD' })
analytics.purchase({ transaction_id: 'ORD-123', value: 67, items: [...] })

// Lead generation
analytics.generateLead({ value: 0, currency: 'USD' })

// Custom events
analytics.event('consultation_requested', { follower_count: '50k-100k' })
```

### Facebook Pixel

- **Configuration**: Pixel ID stored in `FACEBOOK_PIXEL_ID` secret
- **Injection**: Into `index.html` at runtime
- **Events**: Same e-commerce events as GA4

**Events:**
- `PageView` - Automatic on route change
- `InitiateCheckout` - Begin checkout
- `AddPaymentInfo` - Payment method added
- `Purchase` - Transaction completed
- `Lead` - Form submission

## Dev/Prod Separation

### What's Separate

| Resource | Dev | Prod |
|----------|-----|------|
| **Database (D1)** | Own SQLite instance | Own SQLite instance |
| **File Storage (R2)** | Own bucket | Own bucket |
| **Secrets** | Can differ | Can differ |

**Critical Implications:**
- Data does NOT transfer when you publish
- Migrations run on both independently
- Files uploaded in dev do NOT appear in prod

### What's Shared

| Resource | Notes |
|----------|-------|
| **Code** | Deploys from dev → prod |
| **Migrations** | Deploy and run in prod |
| **Mocha Assets** | Same URLs work in both |

### Common Pitfalls

| Problem | Solution |
|---------|----------|
| Admin uploads video in dev → Video doesn't appear on prod | Upload to production admin OR use migration to seed |
| Customer data exists in dev → Orders/access don't transfer | Use migrations for seed data; real customer data only in prod |
| Hero image set in dev → Shows "Image unavailable" on prod | Use Mocha Assets OR upload to prod admin |

## Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Complete table definitions
- [API Reference](./API_REFERENCE.md) - All backend endpoints
- [Payment Flow](./PAYMENT_FLOW.md) - Checkout and payment processing
- [Email System](./EMAIL_SYSTEM.md) - Email templates and sequences
