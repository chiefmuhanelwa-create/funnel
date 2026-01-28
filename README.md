# Contentpreneur Hub

A digital product platform for content creators, offering courses, ebooks, workbooks, and coaching services.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Cloudflare Workers (Hono framework) |
| Database | Cloudflare D1 (SQLite) |
| File Storage | Cloudflare R2 (S3-compatible) |
| Authentication | Mocha Users Service (OAuth via Google) |
| Payments | Paystack (ZAR) + Stripe (USD) |
| Email | Resend API + ConvertKit |
| Analytics | Google Analytics 4 + Facebook Pixel |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Cloudflare account (for D1, R2, Workers)
- Wrangler CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.dev.vars` file with required secrets:

```env
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=xxx
RESEND_API_KEY=re_xxx
CONVERTKIT_API_KEY=xxx
CONVERTKIT_API_SECRET=xxx
GA4_MEASUREMENT_ID=G-xxx
FACEBOOK_PIXEL_ID=xxx
```

## Project Structure

```
├── src/
│   ├── react-app/          # Frontend React application
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── context/        # React Context providers
│   │   └── utils/          # Utility functions
│   └── worker/             # Backend Cloudflare Worker
│       ├── middleware/     # Auth middleware
│       ├── emails/         # Email templates
│       └── utils/          # Backend utilities
├── docs/                   # Technical documentation
└── migrations/             # Database migrations
```

## Documentation

Detailed technical documentation is available in the `/docs` directory:

- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) - Overall system design and components
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Complete database table definitions
- [API Reference](./docs/API_REFERENCE.md) - All backend endpoints
- [Payment Flow](./docs/PAYMENT_FLOW.md) - Checkout and payment processing
- [Email System](./docs/EMAIL_SYSTEM.md) - Email templates and sequences

## Key Features

### For Customers

- **Digital Products**: Courses, ebooks, workbooks
- **Secure Checkout**: Paystack (ZAR) and Stripe (USD)
- **Member Access**: Protected content with OAuth login
- **Lead Magnets**: Free workbooks and resources

### For Admins

- **Media Management**: Upload and manage photos, videos, PDFs
- **Order Management**: View orders, grant/revoke access
- **Contact Management**: Email subscribers, consultation requests
- **ConvertKit Integration**: Sync subscribers for email marketing

## Development

### Running Locally

```bash
# Start development server (frontend + backend)
npm run dev

# Run database migrations
npm run migrate
```

### Building for Production

```bash
npm run build
```

### Deployment

Deployment is handled through Cloudflare Workers:

```bash
npm run deploy
```

## Important Notes

### Dev/Prod Separation

**Critical**: Development and production environments have completely separate:
- Databases (D1)
- File storage (R2 buckets)

Files uploaded in dev do NOT appear in prod. Database records do NOT transfer.

### Admin Access

Admin access is controlled via email whitelist in `src/worker/middleware/adminAuth.ts`:

- `info@nochill.co.za`
- `ndivhuwo@nochill.co.za`
- `chiefmuhanelwa@gmail.com`

## License

Proprietary - All rights reserved.

## Support

For technical questions, refer to the documentation in `/docs`.
