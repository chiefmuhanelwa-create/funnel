# User Flow Scenarios & Product Connections

This document maps out all user journey scenarios showing how products connect through bundles, upsells, redirects, and post-purchase flows.

---

## Product Ecosystem Overview

```
                                    PRODUCT HIERARCHY

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                     CONTENTPRENEUR PRO BUNDLE ($147)                     │
    │                         (Includes Everything)                            │
    └─────────────────────────────────────────────────────────────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
    ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
    │ Starter Kit │              │ Influencer's│              │  Tax Guide  │
    │    $67      │              │  Code $19   │              │    $47      │
    └─────────────┘              └─────────────┘              └─────────────┘
         │
         │ (Bundles)
         ▼
    ┌─────────────────────────────────┐                ┌─────────────┐
    │  Niche Finder    PAIDS Workbook │                │  Content    │
    │     $17              $17        │                │ Foundations │
    │   (BUNDLED - Not sold alone)    │                │    $37      │
    └─────────────────────────────────┘                └─────────────┘

    ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
    │  Coaching   │              │Contentpreneur│             │   Content   │
    │  Call $497  │              │  Book $27    │             │Arsenal $37  │
    │  (Service)  │              │  (Pre-order) │             │  (BUNDLED)  │
    └─────────────┘              └─────────────┘              └─────────────┘
```

---

## Bundle Relationships

| Bundle | Includes | Total Value | Price | Savings |
|--------|----------|-------------|-------|---------|
| **Starter Kit** | Niche Finder + PAIDS Workbook | $101 | $67 | $34 |
| **Contentpreneur Pro** | Starter Kit + Influencer's Code + Tax Guide + Content Foundations + Niche Finder + PAIDS Workbook | $170 | $147 | $23 |

---

## Redirect Logic (Bundled-Only Products)

These products **cannot be purchased standalone** and redirect to their parent bundle:

| Attempted URL | Redirect To | Reason |
|--------------|-------------|--------|
| `/checkout/niche-finder` | `/contentpreneur-starter-kit` | Included in Starter Kit |
| `/checkout/paids-workbook` | `/contentpreneur-starter-kit` | Included in Starter Kit |
| `/checkout/content-arsenal` | `/contentpreneur-starter-kit` | Expansion pack |

**Code Reference:** `src/react-app/pages/Checkout.tsx:293-295`
```tsx
if (productKey && BUNDLED_ONLY_PRODUCTS.includes(productKey)) {
  return <Navigate to="/contentpreneur-starter-kit" replace />;
}
```

---

## SCENARIO 1: Starter Kit Purchase (Main Funnel)

**Entry Point:** Homepage or `/contentpreneur-starter-kit`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 1: STARTER KIT PURCHASE                                             │
│ User: First-time visitor looking to start content business                   │
└─────────────────────────────────────────────────────────────────────────────┘

DISCOVERY
    │
    ▼
┌─────────────────────────┐
│  Homepage (/)           │
│  • Hero section         │
│  • Problem/Agitate      │
│  • Value stack          │
│  • Price: $67           │
│  • CTA: "Get Started"   │
└─────────────────────────┘
    │
    │ Click CTA
    ▼
┌─────────────────────────┐
│  Sales Page             │
│  /contentpreneur-       │
│  starter-kit            │
│  • 9 modules breakdown  │
│  • Testimonials         │
│  • Bonuses listed       │
│  • CTA: "Enroll Now"    │
└─────────────────────────┘
    │
    │ Click "Enroll Now"
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/starter-kit                                             │
│                                                                              │
│  Main Product: Contentpreneur Starter Kit .................... $67          │
│                                                                              │
│  ┌─ ORDER BUMPS (One-Time Offers) ─────────────────────────────────────┐    │
│  │ ☐ The Influencer's Code (eBook) ..................... +$12 (37% OFF)│    │
│  │ ☐ Content Foundations Course ........................ +$17 (54% OFF)│    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Discount Code: [________] [Apply]                                           │
│                                                                              │
│  TOTAL: $67 (≈ R1,206 ZAR)                                                  │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Complete Payment (Paystack)
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUCCESS PAGE: /checkout/success                                             │
│                                                                              │
│  ✅ Payment Successful!                                                      │
│                                                                              │
│  PRODUCTS GRANTED:                                                           │
│  • 🚀 Contentpreneur Starter Kit (9 modules)                                │
│  • 🎯 Niche Finder Workbook (BUNDLED FREE)                                  │
│  • 💰 PAIDS Framework Workbook (BUNDLED FREE)                               │
│                                                                              │
│  [Access Members Area →]                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Access Members
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  MEMBERS HUB: /members                                                       │
│                                                                              │
│  YOUR PRODUCTS:                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 🚀 Contentpreneur Starter Kit    [Continue Learning →]                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 🎯 Niche Finder Workbook         [📥 Download PDF]                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 💰 PAIDS Framework Workbook      [📥 Download PDF]                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  UPSELLS (Products you don't own):                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📖 The Influencer's Code         $19    [Get It Now →]                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📋 Tax Guide for Contentpreneurs $47    [Get It Now →]                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCENARIO 2: Bundled Product Redirect

**Entry Point:** Direct link to `/checkout/niche-finder`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 2: NICHE FINDER DIRECT ACCESS (REDIRECT)                            │
│ User: Clicked link to buy Niche Finder separately                            │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────┐
│  /checkout/niche-finder │
│                         │
│  BUNDLED_ONLY_PRODUCTS  │
│  includes 'niche-finder'│
│                         │
│  Redirect triggered!    │
└─────────────────────────┘
    │
    │ <Navigate to="/contentpreneur-starter-kit" replace />
    ▼
┌─────────────────────────┐
│  Sales Page             │
│  /contentpreneur-       │
│  starter-kit            │
│                         │
│  "Niche Finder is       │
│  included FREE with     │
│  the Starter Kit!"      │
│                         │
│  CTA: "Get Full Kit"    │
└─────────────────────────┘
    │
    │ (Same flow as Scenario 1)
    ▼
    ... Checkout → Success → Members
```

**Why this redirect exists:**
- Niche Finder ($17 value) is bundled FREE with Starter Kit ($67)
- Better value proposition for customer
- Higher AOV (Average Order Value) for business
- Workbook is most valuable when paired with video course

---

## SCENARIO 3: Entry via Influencer's Code (eBook)

**Entry Point:** `/products/influencers-code` or `/checkout/influencers-code`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 3: INFLUENCER'S CODE PURCHASE                                       │
│ User: Wants just the eBook first                                             │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────┐
│  Sales Page             │
│  /products/influencers- │
│  code                   │
│  • 14 chapters          │
│  • 6,000+ copies sold   │
│  • Price: $19           │
│  • CTA: "Get eBook"     │
└─────────────────────────┘
    │
    │ Click "Get eBook"
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/influencers-code                                        │
│                                                                              │
│  Main Product: The Influencer's Code .......................... $19         │
│                                                                              │
│  ┌─ ORDER BUMPS ────────────────────────────────────────────────────────┐   │
│  │ ☐ PAIDS Framework Workbook .......................... +$12 (29% OFF) │   │
│  │ ☐ Niche Finder Workbook ............................. +$12 (29% OFF) │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TOTAL: $19 (≈ R342 ZAR)                                                    │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Complete Payment
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUCCESS PAGE                                                                │
│                                                                              │
│  ✅ Payment Successful!                                                      │
│                                                                              │
│  PRODUCT GRANTED:                                                            │
│  • 📖 The Influencer's Code                                                 │
│                                                                              │
│  ┌─ POST-PURCHASE UPSELL ───────────────────────────────────────────────┐   │
│  │  🚀 SPECIAL OFFER: Full Starter Kit                                   │   │
│  │                                                                        │   │
│  │  "Put what you learned into action with 9 video modules"              │   │
│  │                                                                        │   │
│  │  ~~$67~~ $47 (30% OFF)                                                │   │
│  │  [Upgrade Now →]                                                       │   │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Access Members
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  MEMBERS HUB: /members                                                       │
│                                                                              │
│  YOUR PRODUCTS:                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📖 The Influencer's Code         [📥 Download PDF]                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  UPSELLS:                                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 🚀 Contentpreneur Starter Kit    $67    [Get Full Course →]           │  │
│  │    (Includes Niche Finder + PAIDS Workbook FREE)                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCENARIO 4: Content Foundations → Upgrade to Starter Kit

**Entry Point:** `/products/content-foundations`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 4: CONTENT FOUNDATIONS WITH UPGRADE PATH                            │
│ User: Wants to start small with 3-module course                              │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────┐
│  Sales Page             │
│  /products/content-     │
│  foundations            │
│  • 3 video modules      │
│  • Self-reflection      │
│  • SWOT Analysis        │
│  • Price: $37           │
└─────────────────────────┘
    │
    │ Click "Get Course"
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/content-foundations                                     │
│                                                                              │
│  Main Product: Content Foundations Course ..................... $37         │
│                                                                              │
│  ┌─ ORDER BUMP (UPGRADE) ───────────────────────────────────────────────┐   │
│  │ ☐ Upgrade to Full Starter Kit ...................... +$30 (Save $37) │   │
│  │   "Get all 9 modules + bonus workbooks + tool stack"                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ ADDITIONAL ORDER BUMP ──────────────────────────────────────────────┐   │
│  │ ☐ The Influencer's Code ................................ +$12        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TOTAL: $37 (≈ R666 ZAR)                                                    │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ IF USER SELECTS UPGRADE BUMP:                                                │
│                                                                              │
│  Content Foundations Course ................................ $37            │
│  + Upgrade to Starter Kit .................................. $30            │
│  ─────────────────────────────────────────────────────────────              │
│  TOTAL: $67                                                                  │
│                                                                              │
│  PRODUCTS GRANTED:                                                           │
│  • Content Foundations Course                                                │
│  • Contentpreneur Starter Kit (9 modules)                                   │
│  • Niche Finder Workbook (bundled)                                          │
│  • PAIDS Framework Workbook (bundled)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Upgrade Path Configuration:**
```typescript
// From products.ts
UPGRADE_PATHS: {
  'content-foundations': { to: 'starter-kit', price: 3000, savings: 3700 }
}
```

---

## SCENARIO 5: Tax Guide Purchase

**Entry Point:** `/products/tax-guide`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 5: TAX GUIDE PURCHASE                                               │
│ User: SA content creator needing tax compliance help                         │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────┐
│  Sales Page             │
│  /products/tax-guide    │
│  • SARS compliance      │
│  • Deduction checklist  │
│  • 35% Rule Strategy    │
│  • Price: $47           │
└─────────────────────────┘
    │
    │ Click "Get Tax Guide"
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/tax-guide                                               │
│                                                                              │
│  Main Product: Tax Guide for Contentpreneurs .................. $47         │
│                                                                              │
│  ┌─ ORDER BUMPS ────────────────────────────────────────────────────────┐   │
│  │ ☐ The Influencer's Code ................................ +$12 (37% OFF│   │
│  │ ☐ Content Arsenal .................................... +$27 (27% OFF) │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TOTAL: $47 (≈ R846 ZAR)                                                    │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Complete Payment
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUCCESS PAGE                                                                │
│                                                                              │
│  ┌─ POST-PURCHASE UPSELL ───────────────────────────────────────────────┐   │
│  │  🚀 Now Build Your Income                                             │   │
│  │                                                                        │   │
│  │  "The complete system to generate income worth taxing"                │   │
│  │                                                                        │   │
│  │  Starter Kit: ~~$67~~ $47 (30% OFF)                                   │   │
│  │  [Get It Now →]                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCENARIO 6: Pro Bundle (Maximum Value)

**Entry Point:** `/checkout/contentpreneur-pro`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 6: CONTENTPRENEUR PRO BUNDLE                                        │
│ User: Wants everything in one purchase                                       │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/contentpreneur-pro                                      │
│                                                                              │
│  Contentpreneur Pro Bundle (Save $23!) ...................... $147          │
│                                                                              │
│  ✅ INCLUDES EVERYTHING:                                                     │
│  • 9-Module Personal Branding Course                                         │
│  • Content Foundations Course                                                │
│  • The Influencer's Code eBook                                              │
│  • Tax Guide for Contentpreneurs                                            │
│  • Niche Finder Workbook                                                    │
│  • PAIDS Framework Workbook                                                 │
│  • NoChill Tool Stack Access                                                │
│                                                                              │
│  (No order bumps - already includes everything)                              │
│                                                                              │
│  TOTAL: $147 (≈ R2,646 ZAR)                                                 │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Complete Payment
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUCCESS PAGE                                                                │
│                                                                              │
│  ✅ Payment Successful!                                                      │
│                                                                              │
│  PRODUCTS GRANTED (6 total):                                                 │
│  • 🚀 Contentpreneur Starter Kit                                            │
│  • 🎯 Content Foundations Course                                            │
│  • 📖 The Influencer's Code                                                 │
│  • 📋 Tax Guide for Contentpreneurs                                         │
│  • 🎯 Niche Finder Workbook                                                 │
│  • 💰 PAIDS Framework Workbook                                              │
│                                                                              │
│  [Access Members Area →]                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Access Members
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  MEMBERS HUB: /members                                                       │
│                                                                              │
│  YOUR PRODUCTS: (Full access - no upsells needed)                            │
│  • All 6 products unlocked                                                   │
│  • Full course library access                                                │
│  • All downloadable PDFs                                                     │
│  • Tool Stack access                                                         │
│                                                                              │
│  ONLY REMAINING UPSELL:                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 📞 1:1 Strategy Call             $497    [Book Now →]                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCENARIO 7: Returning Customer (Already Owns Products)

**Entry Point:** `/checkout/starter-kit` (already owns Influencer's Code)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 7: RETURNING CUSTOMER CHECKOUT                                      │
│ User: Previously bought Influencer's Code, now wants Starter Kit             │
└─────────────────────────────────────────────────────────────────────────────┘

ENTRY
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT: /checkout/starter-kit                                             │
│                                                                              │
│  Email: thabo.mokoena@gmail.com                                              │
│  (Email auto-fills if logged in or remembered)                               │
│                                                                              │
│  ↓ System checks /api/check-access for owned products                       │
│                                                                              │
│  Main Product: Contentpreneur Starter Kit .................... $67          │
│                                                                              │
│  ┌─ ORDER BUMPS ────────────────────────────────────────────────────────┐   │
│  │ ✅ You already own The Influencer's Code!                             │   │
│  │                                                                        │   │
│  │ ☐ Content Foundations Course ........................ +$17 (54% OFF) │   │
│  │    (Only showing bumps you DON'T own)                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  TOTAL: $67 (≈ R1,206 ZAR)                                                  │
│  [Complete Purchase →]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Complete Payment
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  MEMBERS HUB: /members                                                       │
│                                                                              │
│  YOUR PRODUCTS (Combined):                                                   │
│  • 📖 The Influencer's Code (previous purchase)                             │
│  • 🚀 Contentpreneur Starter Kit (new)                                      │
│  • 🎯 Niche Finder Workbook (bundled with new)                              │
│  • 💰 PAIDS Framework Workbook (bundled with new)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SCENARIO 8: Abandoned Cart Recovery

**Entry Point:** User starts checkout but doesn't complete

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 8: ABANDONED CART → RECOVERY EMAIL → CONVERSION                     │
│ User: Started checkout, got distracted, left                                 │
└─────────────────────────────────────────────────────────────────────────────┘

CHECKOUT STARTED
    │
    │ User enters email, selects bumps
    │ Cart tracked: POST /api/track-cart
    │
    ▼
┌─────────────────────────┐
│  User leaves page       │
│  (beforeunload event)   │
│                         │
│  Cart marked abandoned  │
│  via sendBeacon         │
└─────────────────────────┘
    │
    │ 1 hour later (cron job)
    │ POST /api/cron/abandoned-cart
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  RECOVERY EMAIL                                                              │
│                                                                              │
│  Subject: "You left something behind..."                                     │
│                                                                              │
│  Hey [Name],                                                                 │
│                                                                              │
│  You were so close to starting your content business journey!               │
│                                                                              │
│  Your cart is still waiting:                                                 │
│  • Contentpreneur Starter Kit - $67                                         │
│  • The Influencer's Code - $12 (order bump)                                 │
│                                                                              │
│  [Complete Your Order →]                                                     │
│                                                                              │
│  Use code COMEBACK10 for 10% off!                                           │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ User clicks link
    ▼
┌─────────────────────────┐
│  /checkout/starter-kit  │
│  ?email=xxx@example.com │
│  &bumps=influencers-code│
│                         │
│  Cart pre-filled!       │
└─────────────────────────┘
    │
    │ Completes purchase
    ▼
    abandoned_carts.recovered = 1
```

---

## SCENARIO 9: Free Tool → Lead Capture → Sale

**Entry Point:** `/free/ratecard` (Free Rate Card Calculator)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 9: FREE TOOL LEAD GENERATION                                        │
│ User: Finds free tool, converts to customer                                  │
└─────────────────────────────────────────────────────────────────────────────┘

DISCOVERY (Social Media / SEO)
    │
    ▼
┌─────────────────────────┐
│  Free Tool Page         │
│  /free/ratecard         │
│  OR                     │
│  /tools/ratecard        │
│                         │
│  Rate Card Calculator   │
│  (No email required)    │
└─────────────────────────┘
    │
    │ User uses tool, sees value
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SOFT CTA ON FREE TOOL PAGE                                                  │
│                                                                              │
│  "Want the complete system?"                                                 │
│                                                                              │
│  The Contentpreneur Starter Kit includes:                                    │
│  • 9 video modules                                                           │
│  • Niche Finder Workbook                                                    │
│  • PAIDS Framework (this is how you monetize!)                              │
│                                                                              │
│  [Get Full System - $67 →]                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Click CTA
    ▼
    /contentpreneur-starter-kit → Checkout flow (Scenario 1)
```

---

## SCENARIO 10: Lead Magnet Landing Page

**Entry Point:** `/lp/niche-finder` (Hidden landing page for ads)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO 10: PAID ADS → LEAD MAGNET → SALE                                   │
│ User: Clicked Facebook/Instagram ad                                          │
└─────────────────────────────────────────────────────────────────────────────┘

AD CLICK
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LEAD MAGNET LANDING PAGE: /lp/niche-finder                                  │
│  (Focused page, no navigation)                                               │
│                                                                              │
│  "FREE: Discover Your Profitable Niche in 90 Minutes"                        │
│                                                                              │
│  Enter your email to get the Niche Finder Workbook:                          │
│  [email@example.com] [Get Free Workbook →]                                   │
│                                                                              │
│  (Note: This is lead gen, not the paid workbook)                            │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ Submit email
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  THANK YOU PAGE                                                              │
│                                                                              │
│  ✅ Check your email for the workbook!                                       │
│                                                                              │
│  While you wait...                                                           │
│                                                                              │
│  ┌─ TRIPWIRE OFFER ─────────────────────────────────────────────────────┐   │
│  │  Special One-Time Offer (This page only)                              │   │
│  │                                                                        │   │
│  │  Get the FULL Contentpreneur Starter Kit                              │   │
│  │  (Includes the Niche Finder + 9 Video Modules)                        │   │
│  │                                                                        │   │
│  │  ~~$67~~ $47 (30% OFF)                                                │   │
│  │  [Get Instant Access →]                                                │   │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    │ If declined → Email nurture sequence
    │ If accepted → Checkout flow
    ▼
    Email Sequence:
    Day 1: Welcome + Workbook link
    Day 2: How to use the workbook
    Day 3: Success story
    Day 5: Starter Kit offer
    Day 7: Last chance + scarcity
```

---

## Order Bump Configuration Reference

| Main Product | Order Bump 1 | Bump 1 Price | Order Bump 2 | Bump 2 Price |
|-------------|--------------|--------------|--------------|--------------|
| Starter Kit | Influencer's Code | $12 (37% off) | Tax Guide | $29 (38% off) |
| Influencer's Code | PAIDS Workbook | $12 (29% off) | Niche Finder | $12 (29% off) |
| Tax Guide | Influencer's Code | $12 (37% off) | Content Arsenal | $27 (27% off) |
| Content Foundations | Upgrade to Starter Kit | $30 (save $37) | Influencer's Code | $12 |
| Contentpreneur Pro | (none) | - | - | - |

---

## Post-Purchase Upsell Configuration

| Purchased Product | Upsell Offered | Upsell Price | Savings |
|------------------|----------------|--------------|---------|
| Starter Kit | Influencer's Code | $12 | 37% off |
| Influencer's Code | Starter Kit | $47 | 30% off |
| Niche Finder | Starter Kit | $47 | 30% off |
| PAIDS Workbook | Starter Kit | $47 | 30% off |
| Tax Guide | Starter Kit | $47 | 30% off |

---

## Database Access Granting Flow

```
PAYMENT COMPLETED (Webhook)
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Webhook Handler: /api/webhooks/paystack                                     │
│                                                                              │
│  1. Verify signature                                                         │
│  2. Update order status → 'completed'                                        │
│  3. Get order items from order_items table                                   │
│  4. For each product_key:                                                    │
│     └─ Call grantProductAccess(email, product_key, order_id)                │
│        │                                                                     │
│        ├─ Grant main product                                                 │
│        │  INSERT INTO customer_access (email, product_id, order_id)         │
│        │                                                                     │
│        └─ If PRODUCT_BUNDLES[product_key] exists:                           │
│           └─ Grant each bundled product                                      │
│              INSERT INTO customer_access for each                            │
│                                                                              │
│  5. Send confirmation email                                                  │
│  6. Sync to ConvertKit                                                       │
│  7. Mark abandoned cart as recovered (if applicable)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/bundles.ts` | Bundle definitions & access checking |
| `src/react-app/pages/Checkout.tsx` | Checkout page with order bumps |
| `src/react-app/config/products.ts` | Product config, bundles, order bumps, upsells |
| `api/webhooks/paystack.ts` | Payment webhook, access granting |
| `api/checkout/create-session.ts` | Create Paystack session |
| `api/checkout/verify.ts` | Verify payment & show products |
| `src/react-app/pages/MembersHub.tsx` | Members dashboard with products |

---

*Document Version: 1.0*
*Last Updated: March 15, 2026*
