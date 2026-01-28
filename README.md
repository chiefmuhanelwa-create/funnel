# Contentpreneur Hub

A digital product platform for content creators, offering courses, ebooks, workbooks, and coaching services.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Vercel Serverless Functions |
| Database | Neon PostgreSQL + Drizzle ORM |
| File Storage | Vercel Blob |
| Payments | Paystack (ZAR) |
| Email | Resend API + ConvertKit |
| Analytics | Google Analytics 4 + Facebook Pixel |

## Deployment to Vercel

### Prerequisites

- Node.js 18+
- Vercel account
- Neon PostgreSQL database
- Paystack account

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/contentpreneur-hub)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Set up Neon PostgreSQL**
   - Go to [neon.tech](https://neon.tech) and create a new project
   - Copy the connection string

3. **Configure Environment Variables**

   In Vercel Dashboard or via CLI, set:
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   PAYSTACK_SECRET_KEY=sk_live_xxx
   PAYSTACK_WEBHOOK_SECRET=whsec_xxx
   RESEND_API_KEY=re_xxx
   CONVERTKIT_API_KEY=xxx (optional)
   CONVERTKIT_API_SECRET=xxx (optional)
   GA4_MEASUREMENT_ID=G-xxx (optional)
   FACEBOOK_PIXEL_ID=xxx (optional)
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Run Database Migrations**
   ```bash
   npm run db:push
   ```

6. **Configure Paystack Webhook**
   - Go to Paystack Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-domain.vercel.app/api/webhooks/paystack`

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── products.ts         # Products API
│   ├── check-access.ts     # Access verification
│   ├── checkout/           # Checkout endpoints
│   ├── webhooks/           # Payment webhooks
│   └── ...
├── lib/                    # Shared libraries
│   ├── db.ts              # Database connection
│   └── schema.ts          # Drizzle ORM schema
├── src/react-app/          # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route components
│   ├── context/            # React Context providers
│   └── utils/              # Utility functions
├── docs/                   # Technical documentation
└── drizzle/                # Database migrations
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products |
| `/api/check-access` | POST | Check user product access |
| `/api/checkout/create-session` | POST | Create payment session |
| `/api/checkout/verify` | GET | Verify payment status |
| `/api/webhooks/paystack` | POST | Paystack webhook handler |
| `/api/opt-in` | POST | Lead magnet signup |
| `/api/exchange-rate` | GET | USD to ZAR rate |
| `/api/analytics/config` | GET | Analytics configuration |

## Documentation

- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Payment Flow](./docs/PAYMENT_FLOW.md)
- [Email System](./docs/EMAIL_SYSTEM.md)

## Key Features

### For Customers
- Digital Products (courses, ebooks, workbooks)
- Secure Checkout with Paystack (ZAR payments)
- Member Portal with protected content
- Free Lead Magnets

### For Admins
- Media Management
- Order Management
- Customer Access Control
- Email Marketing Integration

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `PAYSTACK_SECRET_KEY` | Yes | Paystack API secret key |
| `PAYSTACK_WEBHOOK_SECRET` | Yes | Paystack webhook signing secret |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `CONVERTKIT_API_KEY` | No | ConvertKit API key |
| `CONVERTKIT_API_SECRET` | No | ConvertKit API secret |
| `GA4_MEASUREMENT_ID` | No | Google Analytics 4 ID |
| `FACEBOOK_PIXEL_ID` | No | Facebook Pixel ID |

## License

Proprietary - All rights reserved.
