# Contentpreneur Hub - Sales Funnel Architecture

## Overview

This document maps the complete sales funnel structure for **Contentpreneur Hub** (https://www.contentpreneurhub.online).

---

## Funnel Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MAIN FUNNEL ENTRY                                  │
│                   https://www.contentpreneurhub.online                       │
│                                                                              │
│   Hero → Problem/Agitate → Outcomes → PAIDS Mechanism → Value Stack → CTA   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT SALES PAGE                                   │
│        https://www.contentpreneurhub.online/contentpreneur-starter-kit       │
│                                                                              │
│                    CONTENTPRENEUR STARTER KIT - $67                          │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     INCLUDED IN BUNDLE                               │   │
│   │                                                                      │   │
│   │   📹 9 VIDEO MODULES:                                               │   │
│   │   ├── Introduction Video                                             │   │
│   │   ├── Module 1: What is a Personal Brand                            │   │
│   │   ├── Module 2: Blueprint to Build a Personal Brand                 │   │
│   │   ├── Module 3: The 3Cs Framework - Mindset                         │   │
│   │   ├── Module 4: SWOT Analysis                                       │   │
│   │   ├── Module 5: 3Es Content Idea Formula                            │   │
│   │   ├── Module 6: Understand Social Media Platforms                   │   │
│   │   ├── Module 7: Community Building                                  │   │
│   │   ├── Module 8: PAIDS Framework                                     │   │
│   │   └── Bonus Module 9: Formula to Create Online Asset                │   │
│   │                                                                      │   │
│   │   📚 BONUS WORKBOOKS (Included in bundle):                          │   │
│   │   ├── PAIDS Framework Workbook (PDF) - normally $17                 │   │
│   │   └── Niche Finder Workbook (PDF) - normally $17                    │   │
│   │                                                                      │   │
│   │   🛠️ NoChill Tool Stack Access                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CHECKOUT PAGE                                     │
│           https://www.contentpreneurhub.online/checkout/starter-kit          │
│                                                                              │
│   ORDER BUMPS (Discounted upsells at checkout):                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │   ☐ The Influencer's Code (eBook)                         $12       │   │
│   │     Normally $19 - Save 37%                                          │   │
│   │     14 chapters on content monetization, 3Es Formula, PAIDS Method   │   │
│   │                                                                      │   │
│   │   ☐ Tax Guide for Contentpreneurs                         $29       │   │
│   │     Normally $47 - Save 38%                                          │   │
│   │     Essential tax strategies for South African creators              │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Note: Content Foundations Course also available as upgrade path            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          POST-PURCHASE UPSELLS                               │
│                       (Success Page / OTO Popup)                             │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │   📖 The Influencer's Code                              $12         │   │
│   │   One-time offer for new students - 37% OFF                          │   │
│   │   "The perfect companion to your course"                             │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MEMBERS AREA                                      │
│            https://www.contentpreneurhub.online/members                      │
│                                                                              │
│   Products Accessible After Starter Kit Purchase:                           │
│   ├── /members/starter-kit        (9 video modules)                         │
│   ├── /members/niche-finder       (bundled workbook)                        │
│   └── /members/paids-workbook     (bundled workbook)                        │
│                                                                              │
│   ADDITIONAL UPSELLS SHOWN:                                                  │
│   ├── Tax Guide for Contentpreneurs          $47                            │
│   ├── Content Foundations Course             $37                            │
│   └── 1:1 Strategy Call                      $497                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Why Niche Finder is Included

The **Niche Finder Workbook** is bundled with the Starter Kit because:

1. **Curriculum Alignment**: Module 4 (SWOT Analysis) and Module 5 (3Es Content Idea Formula) directly reference and require the Niche Finder exercises

2. **Value Stack**: Increases perceived value of the $67 offer:
   - 9 Modules: $197 value
   - PAIDS Workbook: $17 value
   - Niche Finder: $17 value
   - Tool Stack: $97 value
   - **Total Value: $328** → **You Pay: $67**

3. **Completion Rate**: Students who complete the niche-finding exercise are more likely to finish the course and see results (increasing testimonials/referrals)

---

## Bundle Configuration (Code Reference)

```typescript
// From src/react-app/config/products.ts

// When someone purchases 'starter-kit', they automatically get access to:
export const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': [
    'starter-kit',
    'content-foundations',
    'influencers-code',
    'tax-guide',
    'niche-finder',
    'paids-workbook',
  ],
};
```

---

## Upsell Strategy

### Checkout Order Bumps (Starter Kit)

| Product | Regular Price | Bump Price | Savings | Rationale |
|---------|--------------|------------|---------|-----------|
| The Influencer's Code | $19 | $12 | 37% | Complements course with written reference |
| Tax Guide | $47 | $29 | 38% | Addresses "but I don't know about taxes" objection |

### Post-Purchase Upsells

| After Purchase | Offered Product | Price | Rationale |
|----------------|-----------------|-------|-----------|
| Starter Kit | Influencer's Code | $12 | Impulse buy, low friction |
| Influencer's Code | Starter Kit | $47 | Upgrade path for readers |
| Niche Finder | Starter Kit | $47 | Natural progression |
| Tax Guide | Starter Kit | $47 | "Now earn money worth taxing" |

---

## Complete Product Catalog

| Product | Price | Category | Standalone | In Bundle |
|---------|-------|----------|------------|-----------|
| Contentpreneur Starter Kit | $67 | Course | ✅ | Pro Bundle |
| The Influencer's Code | $19 | eBook | ✅ | Pro Bundle |
| Content Foundations | $37 | Course | ✅ | Pro Bundle |
| Tax Guide for Contentpreneurs | $47 | Guide | ✅ | Pro Bundle |
| Niche Finder Workbook | $17 | Workbook | ✅ | Starter Kit, Pro |
| PAIDS Framework Workbook | $17 | Workbook | ✅ | Starter Kit, Pro |
| Contentpreneur Pro Bundle | $147 | Bundle | ✅ | - |
| 1:1 Strategy Call | $497 | Service | ✅ | - |
| Content Arsenal | $37 | Templates | ✅ | - |
| Contentpreneur Book (eBook) | $19 | Book | ✅ | - |
| Contentpreneur Book (Hardcopy) | $37 | Book | ✅ | - |

---

## Conversion Flow Metrics (Key Pages)

| Page | Purpose | Key Metric |
|------|---------|------------|
| `/` (Homepage) | Awareness → Interest | Scroll depth, CTA clicks |
| `/contentpreneur-starter-kit` | Interest → Desire | Time on page, video plays |
| `/checkout/starter-kit` | Desire → Action | Conversion rate, bump rate |
| `/checkout/success` | Action → Advocacy | Upsell acceptance rate |
| `/members` | Retention | Login frequency, course completion |

---

## Technical Implementation

### Access Control Flow

```
Customer purchases "starter-kit"
         │
         ▼
Webhook receives payment confirmation
         │
         ▼
Grant access to:
├── starter-kit
├── niche-finder    ← from PRODUCT_BUNDLES
└── paids-workbook  ← from PRODUCT_BUNDLES
         │
         ▼
Customer can access:
├── /members/starter-kit
├── /members/niche-finder (download)
└── /members/paids-workbook (download)
```

### Database Tables Involved

- `orders` - Payment records
- `order_items` - Individual products purchased
- `customer_access` - Which products each email can access

---

## Related Documentation

- [User Flow Guide](./USER_FLOW_GUIDE.md) - Detailed step-by-step user journey
- [Payment Flow](./PAYMENT_FLOW.md) - Payment processing details
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Technical overview

---

*Document Version: 1.0*
*Last Updated: March 15, 2026*
*Platform: Contentpreneur Hub (contentpreneurhub.online)*
