# Contentpreneur Hub - System Architecture Documentation

## Overview

This document provides a comprehensive analysis of the Contentpreneur Hub funnel platform, comparing the current implementation against the frontend specifications guide. It serves as both documentation and a gap analysis.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Gap Analysis](#gap-analysis)
3. [Existing Components](#existing-components)
4. [Backend Architecture](#backend-architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Deployment & Configuration](#deployment--configuration)

---

## Executive Summary

### Current State
The platform is a **fully-functional e-commerce sales funnel** with:
- 27 reusable React components
- 27 pages (product, checkout, member, admin)
- 10 digital products
- 40+ defined routes
- Email-based member authentication
- Paystack payment integration
- Analytics tracking system
- Abandoned cart recovery (cron job)

### Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Neon PostgreSQL with Drizzle ORM |
| Payments | Paystack (primary) |
| Email | Resend (transactional), ConvertKit (marketing) |
| Storage | Vercel Blob Storage |
| Hosting | Vercel |

---

## Gap Analysis

### Component Comparison: Specifications vs Implementation

| Specification Component | Status | Existing Implementation | Notes |
|------------------------|--------|------------------------|-------|
| **Header** | ✅ EXISTS | `StickyNav.tsx` | Fully functional with auth states |
| **HeroSection** | ✅ EXISTS | `Hero.tsx` | Recently updated with conversion optimization |
| **VideoPromptBar** | ⚠️ PARTIAL | Integrated in `VideoShowcase.tsx` | Not a separate component |
| **VideoSection** | ✅ EXISTS | `VideoShowcase.tsx` | Has video player with poster |
| **TwoColumnSection** | ❌ MISSING | N/A | Layout pattern exists inline, not componentized |
| **ContentColumn** | ❌ MISSING | N/A | Content exists inline, not componentized |
| **OrderFormCard** | ✅ EXISTS | `Checkout.tsx`, `CheckoutStarterKit.tsx` | Full checkout flow implemented |
| **ProductShowcase** | ⚠️ PARTIAL | Spread across product pages | Not unified component |
| **FAQSection** | ✅ EXISTS | `ObjectionSection.tsx` + product page FAQs | 8 objections/FAQs implemented |
| **AboutSection** | ✅ EXISTS | `About.tsx` | "From Bathroom Floors to Boardrooms" |
| **GallerySection** | ❌ MISSING | N/A | No gallery/portfolio component |
| **CTASection** | ✅ EXISTS | `FinalCTASection.tsx` | Final emotional close implemented |
| **TestimonialsSection** | ❌ MISSING | N/A | No testimonials component |
| **Footer** | ✅ EXISTS | `Footer.tsx` | Newsletter signup + social links |
| **Mobile Responsiveness** | ✅ EXISTS | Throughout | Mobile-first with `lg:` breakpoints |

### Summary Counts

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Exists & Matches | 9 | 60% |
| ⚠️ Partial/Needs Update | 2 | 13% |
| ❌ Missing | 4 | 27% |

---

## What's Missing (Action Required)

### 1. TestimonialsSection (HIGH PRIORITY)
**Purpose:** Display customer success stories and social proof

**Recommendation:** Create `src/react-app/components/TestimonialsSection.tsx`
- Carousel or grid layout
- Customer name, photo (optional), quote
- Star ratings
- "Verified Purchase" badges

### 2. GallerySection (MEDIUM PRIORITY)
**Purpose:** Showcase portfolio, media appearances, or product screenshots

**Recommendation:** Create `src/react-app/components/GallerySection.tsx`
- Grid layout with lightbox
- Categories/filters
- Responsive image optimization

### 3. TwoColumnSection (LOW PRIORITY - Layout Utility)
**Purpose:** Reusable two-column layout component

**Recommendation:** Create `src/react-app/components/layout/TwoColumnSection.tsx`
- Configurable column widths
- Mobile stacking behavior
- Useful for content + form layouts

### 4. ContentColumn (LOW PRIORITY - Layout Utility)
**Purpose:** Standardized content column component

**Recommendation:** Create `src/react-app/components/layout/ContentColumn.tsx`
- Consistent typography
- Heading hierarchy
- Bullet point styling

---

## What Needs Updates

### 1. VideoShowcase.tsx → Separate VideoPromptBar
The specification mentions a `VideoPromptBar` component with a prompt/headline above the video. Currently integrated inline.

**Decision:** Keep as-is OR extract VideoPromptBar if more flexibility is needed.

### 2. ProductShowcase → Unified Component
Product showcases are currently duplicated across individual product pages.

**Recommendation:** Create a reusable `ProductShowcase.tsx` that accepts props:
```typescript
interface ProductShowcaseProps {
  product: Product;
  features: string[];
  modules?: CourseModule[];
  showCountdown?: boolean;
  showSocialProof?: boolean;
}
```

---

## Existing Components

### Homepage Sections (in render order)
```
1. Hero.tsx                    - Main headline + CTA
2. ProblemAgitateSection.tsx   - Problem identification
3. OutcomesSection.tsx         - "What You'll Build in 30 Days"
4. PAIDSMechanism.tsx          - PAIDS Framework explanation
5. VideoShowcase.tsx           - Featured video content
6. ValueStackSection.tsx       - Price anchoring (R3,999 → R699)
7. About.tsx                   - Founder story
8. AudienceFitSection.tsx      - Who it's for/not for
9. ObjectionSection.tsx        - 8 objections answered
10. GuaranteeSection.tsx       - 30-day guarantee
11. WhyPriceSection.tsx        - Why R699
12. FinalCTASection.tsx        - Final emotional close
```

### Conversion Components
| Component | Purpose |
|-----------|---------|
| `CountdownTimer.tsx` | Urgency/scarcity |
| `LeadMagnetPopup.tsx` | Email capture |
| `LimitedSpotsIndicator.tsx` | Scarcity messaging |
| `LivePurchaseNotification.tsx` | Social proof |
| `ExitIntentPopup.tsx` | Discount on exit |
| `MobileCTA.tsx` | Sticky mobile button |
| `OTOPopup.tsx` | Post-purchase upsell |
| `SocialProof.tsx` | Purchase notifications |

### Layout & Navigation
| Component | Purpose |
|-----------|---------|
| `StickyNav.tsx` | Header navigation |
| `Footer.tsx` | Footer with newsletter |
| `BackButton.tsx` | Navigation helper |
| `ScrollToTop.tsx` | Route change scroll |
| `WhatsAppButton.tsx` | Floating contact |

---

## Backend Architecture

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/subscribe` | POST | Newsletter/lead signup |
| `/api/check-access` | POST | Verify member purchases |
| `/api/checkout/create` | POST | Create Paystack transaction |
| `/api/checkout/verify` | GET | Verify payment status |
| `/api/webhooks/paystack` | POST | Paystack webhook handler |
| `/api/exchange-rate` | GET | USD to ZAR conversion |
| `/api/admin/orders` | GET | Admin order listing |
| `/api/admin/discounts` | GET/POST | Discount management |
| `/api/analytics/track` | POST | Event tracking |
| `/api/analytics/dashboard` | GET | Admin analytics |
| `/api/cron/abandoned-cart` | GET | Hourly cart recovery |

### Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `abandoned-cart` | Hourly (`0 * * * *`) | Send recovery emails |

---

## Database Schema

### Tables

```sql
-- Customer orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_keys TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  payment_status TEXT DEFAULT 'pending',
  paystack_reference TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email subscribers
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

-- Discount codes
CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'percentage' | 'fixed'
  value INTEGER NOT NULL,
  max_uses INTEGER,
  uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  product_keys TEXT, -- CSV or 'all'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Abandoned carts
CREATE TABLE abandoned_carts (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_keys TEXT NOT NULL,
  cart_data TEXT, -- JSON
  recovery_email_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  session_id TEXT,
  page_url TEXT,
  event_data TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Deployment & Configuration

### Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://...

# Payments
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...
CONVERTKIT_API_KEY=...
CONVERTKIT_FORM_ID=...
CONVERTKIT_TAG_ABANDONED_CART=...

# Security
CRON_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://www.contentpreneurhub.online
```

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    // Security headers (HSTS, XSS, Frame Options, etc.)
  ],
  "crons": [
    { "path": "/api/cron/abandoned-cart", "schedule": "0 * * * *" }
  ]
}
```

---

## Sales Funnel Structure

### Primary Funnel Flow

```
Homepage (/) → Starter Kit Sales Page → Checkout → Success → Members Area
```

### Main Product: Contentpreneur Starter Kit (R699)

**URL:** `https://www.contentpreneurhub.online/contentpreneur-starter-kit`

**Bundle Contents:**
- 9 Video Modules (Introduction + Modules 1-8 + Bonus Module 9)
- PAIDS Framework Workbook (PDF) - included in bundle
- Niche Finder Workbook (PDF) - included in bundle
- NoChill Tool Stack Access

**Checkout Upsells (Order Bumps):**
- The Influencer's Code - R149 (normally R199)
- Tax Guide for Contentpreneurs - R299 (normally R449)

**Post-Purchase Upsells:**
- Content Foundations Course - R399
- 1:1 Strategy Call - R4,999

> For detailed funnel architecture, see [docs/SALES_FUNNEL_ARCHITECTURE.md](./docs/SALES_FUNNEL_ARCHITECTURE.md)

---

## Product Catalog

| Product | Price (ZAR) | Key | Category | Bundle Status |
|---------|-------------|-----|----------|---------------|
| Contentpreneur Starter Kit | R699 | `starter-kit` | Course | Main product (includes niche-finder, paids-workbook) |
| The Influencer's Code | R199 | `influencers-code` | eBook | Standalone / Upsell |
| Content Foundations | R399 | `content-foundations` | Course | Standalone / Upsell |
| Tax Guide for Contentpreneurs | R449 | `tax-guide` | Guide | Standalone / Upsell |
| Niche Finder Workbook | R199 | `niche-finder` | Workbook | Included in Starter Kit |
| PAIDS Framework Workbook | R199 | `paids-workbook` | Workbook | Included in Starter Kit |
| Pro Bundle | R1,299 | `contentpreneur-pro` | Bundle | All products |
| 1:1 Strategy Call | R4,999 | `coaching-session` | Service | Standalone |
| Contentpreneur Book (eBook) | R249 | `contentpreneur-book-ebook` | Book | Standalone (Pre-order) |
| Contentpreneur Book (Hardcopy + eBook) | R399 | `contentpreneur-book-hardcopy` | Book | Standalone (Pre-order) |
| Content Arsenal | R399 | `content-arsenal` | Templates | Standalone |

---

## Recommendations Summary

### Immediate Actions (Before Launch)
1. ✅ Run `migrations/0003_analytics_events.sql` in Neon console
2. ✅ Add `CRON_SECRET` environment variable in Vercel
3. ✅ Verify all environment variables are set

### Short-Term Improvements
1. Create `TestimonialsSection.tsx` for social proof
2. Add actual customer testimonials/reviews
3. Consider A/B testing different CTAs

### Nice-to-Have
1. Create `GallerySection.tsx` for media showcase
2. Extract reusable `TwoColumnSection` layout component
3. Unify product showcase into single component

---

## File Structure

```
/home/user/funnel/
├── api/                          # Vercel serverless functions
│   ├── admin/                    # Admin endpoints
│   ├── analytics/                # Analytics endpoints
│   │   ├── dashboard.ts
│   │   └── track.ts
│   ├── checkout/                 # Payment endpoints
│   ├── cron/                     # Scheduled jobs
│   │   └── abandoned-cart.ts
│   └── webhooks/                 # External webhooks
├── lib/                          # Shared backend utilities
│   └── schema.ts                 # Drizzle ORM schema
├── migrations/                   # SQL migrations
├── src/
│   └── react-app/
│       ├── components/           # Reusable components
│       │   ├── conversion/       # Conversion optimization
│       │   └── ...
│       ├── config/               # Configuration
│       │   ├── assets.ts         # Media URLs
│       │   └── products.ts       # Product catalog
│       ├── context/              # React contexts
│       ├── pages/                # Page components
│       └── utils/                # Utilities
├── tailwind.config.js            # Tailwind configuration
├── vercel.json                   # Vercel configuration
└── package.json
```

---

*Document generated: February 2026*
*Platform: Contentpreneur Hub (contentpreneurhub.online)*
