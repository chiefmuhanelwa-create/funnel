# Contentpreneur Hub - Setup Guide

This guide will help you set up all the required services and environment variables for the Contentpreneur Hub platform.

## Table of Contents
1. [Neon PostgreSQL Database](#1-neon-postgresql-database)
2. [Vercel Blob Storage](#2-vercel-blob-storage)
3. [Paystack Payment](#3-paystack-payment)
4. [Resend Email](#4-resend-email)
5. [ConvertKit Email Marketing](#5-convertkit-email-marketing)
6. [Environment Variables Summary](#6-environment-variables-summary)

---

## 1. Neon PostgreSQL Database

### Step 1: Create a Neon Account
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project (e.g., "contentpreneur-hub")
3. Choose a region closest to your users

### Step 2: Get Your Connection String
1. In your Neon dashboard, go to your project
2. Click on "Connection Details"
3. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Run the Database Migration
1. In the Neon dashboard, click on "SQL Editor"
2. Open the file `migrations/neon_setup.sql` from this project
3. Copy and paste the entire SQL content into the editor
4. Click "Run" to execute

This will create all required tables and seed the products.

### Step 4: Verify Setup
Run this query to verify products were created:
```sql
SELECT * FROM products;
```

You should see 6 products listed.

---

## 2. Vercel Blob Storage

### Step 1: Enable Blob Storage
1. Go to your Vercel project dashboard
2. Navigate to "Storage" tab
3. Click "Create Database" → "Blob"
4. Follow the prompts to create a blob store

### Step 2: Get Your Token
1. After creating the blob store, Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables
2. You can view it in Project Settings → Environment Variables

---

## 3. Paystack Payment

### Step 1: Create a Paystack Account
1. Go to [paystack.com](https://paystack.com) and sign up
2. Complete your business verification

### Step 2: Get API Keys
1. Go to Settings → API Keys & Webhooks
2. Copy your **Secret Key** (starts with `sk_live_` or `sk_test_`)

### Step 3: Configure Webhook
1. In Paystack dashboard, go to Settings → API Keys & Webhooks
2. Add a webhook URL:
   ```
   https://your-domain.com/api/webhooks/paystack
   ```
3. Copy the **Webhook Secret** that Paystack generates

### Important Notes:
- Use `sk_test_` keys for development
- Use `sk_live_` keys for production
- Paystack processes in ZAR (South African Rand)

---

## 4. Resend Email

### Step 1: Create a Resend Account
1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email domain (or use their test domain for development)

### Step 2: Get API Key
1. Go to API Keys in your dashboard
2. Create a new API key
3. Copy it (starts with `re_`)

### Step 3: Verify Domain (Production)
For production emails, add your domain:
1. Go to Domains in Resend dashboard
2. Add your domain and follow DNS verification steps

---

## 5. ConvertKit Email Marketing

### Step 1: Create a ConvertKit Account
1. Go to [convertkit.com](https://convertkit.com) and sign up

### Step 2: Get API Keys (V3)
1. Go to Settings → Advanced → API
2. You need two keys:
   - **API Key**: Your public API key
   - **API Secret**: Your secret key for server-side operations

### Important: Use V3 API
This project uses ConvertKit V3 API. Make sure you're using the V3 keys, not V4.

---

## 6. Environment Variables Summary

Add these to your Vercel project (Settings → Environment Variables):

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Payments (REQUIRED)
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
PAYSTACK_WEBHOOK_SECRET=<your-paystack-webhook-secret>

# Email (REQUIRED)
RESEND_API_KEY=<your-resend-api-key>

# Email Marketing (REQUIRED for ConvertKit sync)
CONVERTKIT_API_KEY=<your-convertkit-api-key>
CONVERTKIT_API_SECRET=<your-convertkit-api-secret>

# File Storage (auto-configured by Vercel)
BLOB_READ_WRITE_TOKEN=<auto-added-by-vercel>

# Analytics (OPTIONAL)
GA4_MEASUREMENT_ID=<your-ga4-measurement-id>
FACEBOOK_PIXEL_ID=xxxxxxxxxxxxxxxxx

# App URL (for callbacks)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Testing Your Setup

### 1. Test Database Connection
Visit: `https://your-domain.com/api/health`

Should return:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### 2. Test Checkout Flow
1. Go to your site and click "Buy Now" on a product
2. Fill in test details
3. You should be redirected to Paystack

### Troubleshooting

**Error: "Database not configured"**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Redeploy after adding environment variables

**Error: "Payment provider not configured"**
- Make sure `PAYSTACK_SECRET_KEY` is set
- Check if you're using the correct key (test vs live)

**Error: "No valid products found"**
- Run the database migration SQL
- Check that products table has data

---

## Image Setup

The following images need to be added to `public/images/`:

1. `hero-mrnochill.jpg` - Hero section portrait (aspect ratio 3:4, ~800x1066px)
2. `about-mrnochill.jpg` - About section portrait (aspect ratio 1:1, ~896x896px)

Upload your images to these paths in the `public/images` folder.

---

## Support

If you encounter issues:
1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Ensure database tables were created correctly
