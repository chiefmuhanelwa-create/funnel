# API Reference

This document describes all backend API endpoints for Contentpreneur Hub, built with Cloudflare Workers using the Hono framework.

## Base URL

- **Development:** `http://localhost:8787`
- **Production:** `https://contentpreneurhub.online`

## Authentication

### OAuth Authentication
- Session token stored in httpOnly cookie: `__mocha_session_token`
- Backend uses `authMiddleware` from `@getmocha/users-service/backend`

### Admin Authentication
- Email whitelist in `src/worker/middleware/adminAuth.ts`
- All `/api/admin/*` routes protected by `adminAuthMiddleware`

---

## Public Endpoints (No Auth Required)

### Media & Files

#### GET /api/media
List media items with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by type (photo, video, book) |
| `category` | string | Filter by category |
| `published` | boolean | Filter by published status |

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Hero Image",
      "type": "photo",
      "category": "hero_photo",
      "r2_key": "photos/hero.jpg",
      "is_published": 1,
      "display_order": 0
    }
  ]
}
```

---

#### GET /api/public/media/:id
Serve a published media file.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Media item ID |

**Response:** Binary file data with appropriate Content-Type header.

**Note:** Returns 404 if `is_published != 1`

---

#### GET /api/public/media-by-title/:title
Get media item by title.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | string | Media item title |

**Response:** Binary file data

---

#### GET /api/files/:type/:filename
Secure file download (checks access).

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | File type (videos, books, etc.) |
| `filename` | string | Filename |

**Note:** Requires authentication for protected files.

---

### Authentication

#### GET /api/oauth/google/redirect_url
Get OAuth login URL.

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

---

#### POST /api/sessions
Exchange auth code for session.

**Request Body:**
```json
{
  "code": "auth_code_from_google"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### GET /api/logout
Clear session.

**Response:**
```json
{
  "success": true
}
```

---

### Products

#### GET /api/products
List all active products.

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "product_key": "starter-kit",
      "name": "Contentpreneur Starter Kit",
      "price_cents": 6700,
      "is_active": 1
    }
  ]
}
```

---

#### POST /api/check-access
Check product access by email (fallback auth method).

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "productIds": [1, 2, 3],
  "products": [
    {
      "id": 1,
      "product_key": "starter-kit",
      "name": "Contentpreneur Starter Kit"
    }
  ]
}
```

---

### Lead Generation

#### POST /api/opt-in
Email opt-in for lead magnets.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "leadMagnet": "paids-workbook",
  "painPoints": "growing audience",
  "whatsapp": "+27123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed"
}
```

**Side Effects:**
- Creates record in `email_subscribers`
- Sends lead magnet delivery email via Resend
- Syncs to ConvertKit with tags

---

#### POST /api/consultation-request
Request coaching consultation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "whatsapp": "+27123456789",
  "followerCount": "50k-100k",
  "currentIncome": "$1k-5k",
  "goals": "Grow brand partnerships"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultation request submitted"
}
```

---

#### POST /api/brand-inquiry
Brand partnership inquiry.

**Request Body:**
```json
{
  "brandName": "Acme Corp",
  "contactEmail": "marketing@acme.com",
  "campaignDetails": "Looking for UGC creator",
  "budget": "$5k-10k",
  "timeline": "Q1 2024"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Checkout

#### POST /api/checkout/create-session
Create Paystack/Stripe payment session.

**Request Body:**
```json
{
  "productKeys": ["starter-kit"],
  "includeOrderBumps": ["influencers-code", "tax-guide"],
  "customerEmail": "customer@example.com",
  "customerName": "John Doe"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.paystack.com/...",
  "orderNumber": "ORD-1706123456789-abc123",
  "totalUSD": 9700,
  "totalZAR": 175460
}
```

**Process:**
1. Generates unique order_number
2. Calculates total in USD
3. Converts to ZAR using live exchange rate
4. Stores order in orders table with status='pending'
5. Creates order_items for each product
6. Initializes Paystack transaction
7. Returns Paystack checkout URL

---

#### GET /api/checkout/verify
Verify Paystack payment.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `reference` | string | Paystack payment reference |

**Response:**
```json
{
  "success": true,
  "order": {
    "order_number": "ORD-1706123456789-abc123",
    "payment_status": "completed",
    "total_amount_cents": 175460,
    "currency": "ZAR"
  }
}
```

---

### Analytics

#### GET /api/analytics/config
Get GA4 and Facebook Pixel IDs.

**Response:**
```json
{
  "ga4MeasurementId": "G-XXXXXXXXXX",
  "facebookPixelId": "123456789012345"
}
```

---

#### GET /api/exchange-rate
Get live USD to ZAR rate.

**Response:**
```json
{
  "rate": 18.09,
  "source": "frankfurter",
  "cachedAt": "2024-01-24T10:30:00Z"
}
```

**Note:** Exchange rate is cached for 1 hour.

---

## Authenticated Endpoints (OAuth Required)

These endpoints require the user to be logged in via OAuth.

#### GET /api/users/me
Get current user info.

**Response:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://..."
}
```

---

#### GET /api/user-products
Get user's purchased product IDs.

**Response:**
```json
{
  "productIds": [1, 2, 3],
  "productKeys": ["starter-kit", "influencers-code"]
}
```

---

#### GET /api/products/:productKey/files
Get files for owned product.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `productKey` | string | Product identifier |

**Response:**
```json
{
  "files": [
    {
      "id": 1,
      "title": "Module 1: Getting Started",
      "file_type": "video",
      "r2_key": "videos/module1.mp4",
      "display_order": 1
    }
  ]
}
```

**Note:** Returns 403 if user doesn't own the product.

---

## Admin Endpoints (Admin Auth Required)

All admin endpoints require OAuth login with an authorized email.

### Media Management

#### POST /api/media
Upload media file.

**Request:** Multipart form data
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | The file to upload |
| `title` | string | Media title |
| `type` | string | Type (photo, video, book) |
| `category` | string | Category |

**Response:**
```json
{
  "id": 39,
  "title": "Hero Image",
  "type": "photo",
  "r2_key": "photos/1706123456789-hero.jpg"
}
```

---

#### PATCH /api/media/:id
Update media metadata.

**Request Body:**
```json
{
  "title": "New Title",
  "category": "hero_photo",
  "is_published": 1,
  "display_order": 0
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### DELETE /api/media/:id
Delete media file.

**Response:**
```json
{
  "success": true
}
```

**Note:** Also deletes file from R2 storage.

---

### Data Management

#### GET /api/contacts
List email subscribers.

**Response:**
```json
{
  "contacts": [
    {
      "email": "user@example.com",
      "first_name": "John",
      "lead_magnet": "paids-workbook",
      "subscribed_at": "2024-01-24T10:30:00Z"
    }
  ]
}
```

---

#### GET /api/consultation-requests
List consultation requests.

**Response:**
```json
{
  "requests": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "follower_count": "50k-100k",
      "status": "pending"
    }
  ]
}
```

---

#### PATCH /api/consultation-requests/:id
Update consultation status.

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Status Values:** `pending`, `contacted`, `scheduled`, `completed`

---

#### GET /api/brand-inquiries
List brand inquiries.

---

#### PATCH /api/brand-inquiries/:id
Update brand inquiry status.

---

#### GET /api/admin/orders
List all orders.

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-...",
      "customer_email": "user@example.com",
      "payment_status": "completed",
      "total_amount_cents": 6700,
      "currency": "USD"
    }
  ]
}
```

---

#### GET /api/admin/customer-access
List access records.

**Response:**
```json
{
  "records": [
    {
      "id": 1,
      "customer_email": "user@example.com",
      "product_key": "starter-kit",
      "granted_at": "2024-01-24T10:30:00Z"
    }
  ]
}
```

---

#### POST /api/admin/grant-access
Manually grant product access.

**Request Body:**
```json
{
  "email": "user@example.com",
  "productKey": "starter-kit"
}
```

---

#### DELETE /api/admin/revoke-access/:id
Revoke access record.

---

## Webhook Endpoints

### POST /api/webhooks/stripe
Stripe payment webhook.

**Headers:**
| Header | Description |
|--------|-------------|
| `stripe-signature` | Stripe webhook signature |

**Security:** Signature verification with `STRIPE_WEBHOOK_SECRET`

---

### POST /api/webhooks/paystack
Paystack payment webhook.

**Headers:**
| Header | Description |
|--------|-------------|
| `x-paystack-signature` | HMAC SHA512 signature |

**Request Body:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "PAY-123...",
    "metadata": {
      "order_id": "42",
      "order_number": "ORD-..."
    }
  }
}
```

**Security:** HMAC SHA512 verification with `PAYSTACK_WEBHOOK_SECRET`

```typescript
const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
if (hash !== signature) return c.json({ error: 'Invalid' }, 400);
```

**Webhook Handler Actions:**
1. Verifies signature
2. Updates `order.payment_status = 'completed'`
3. Grants access to all products (including bundles)
4. Marks abandoned cart as recovered
5. Sends order confirmation email via Resend
6. Sends welcome email (if first purchase)
7. Syncs customer to ConvertKit
8. Schedules email sequences

---

## Cron Endpoints (Scheduled Jobs)

These endpoints are called by Cloudflare's cron scheduler.

### POST /api/cron/send-welcome-emails
Process email sequences.

**Trigger:** Scheduled (e.g., every 15 minutes)

**Process:**
1. Queries `email_sequences` for unsent emails where `scheduled_for <= NOW()`
2. Sends each email via Resend
3. Updates `is_sent = 1` and `sent_at`

---

### POST /api/cron/send-abandoned-cart-emails
Send cart recovery emails.

**Trigger:** Scheduled (e.g., every hour)

**Process:**
1. Queries `abandoned_carts` where:
   - `created_at > 1 hour ago`
   - `recovery_email_sent = 0`
   - `recovered = 0`
2. Sends recovery email via Resend
3. Updates `recovery_email_sent = 1`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Per-IP rate limiting on public endpoints
- Per-user rate limiting on authenticated endpoints
- Stricter limits on sensitive endpoints (checkout, webhooks)
