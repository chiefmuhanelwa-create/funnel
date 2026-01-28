# Email System

This document details the email infrastructure for Contentpreneur Hub, including transactional emails, marketing sequences, and third-party integrations.

## Overview

| Service | Purpose |
|---------|---------|
| **Resend API** | Transactional emails (order confirmations, welcome emails, lead magnet delivery) |
| **ConvertKit** | Email marketing (nurture sequences, broadcasts, automation) |

## Configuration

### Resend API

```typescript
// Environment variables
RESEND_API_KEY=re_xxxxxxxxxxxxx

// Sender domain
contentpreneurhub.online

// From addresses
orders@contentpreneurhub.online  // Order confirmations
hello@contentpreneurhub.online   // Welcome, abandoned cart
```

### ConvertKit

```typescript
// Environment variables
CONVERTKIT_API_KEY=xxxxxxxxxxxx
CONVERTKIT_API_SECRET=xxxxxxxxxxxx

// Client location
src/worker/utils/convertkit.ts
```

---

## Email Types

### 1. Order Confirmation Email

**Trigger:** Immediately after payment webhook confirms successful payment

**Template:** `src/worker/emails/orderConfirmation.ts`

**Content:**
- Order number
- Product list (expanded to show bundled items)
- Total amount
- Access URL
- Login instructions

**Currency Handling:**
- Shows `R` for ZAR
- Shows `$` for USD

**Deduplication:** Checks `order_emails_sent` table before sending

```typescript
// Example order confirmation data
{
  orderNumber: "ORD-1706123456789-abc123",
  customerName: "John Doe",
  products: [
    { name: "Contentpreneur Starter Kit", price: "R 1,209.63" },
    { name: "Niche Finder Workbook", price: "Included" },
    { name: "PAIDS Framework Workbook", price: "Included" }
  ],
  total: "R 1,209.63",
  accessUrl: "https://contentpreneurhub.online/members",
  loginInstructions: "Click the link above and sign in with Google..."
}
```

### 2. Welcome Email Sequence

**Trigger:** First purchase only

**Schedule:**
- Day 1: Sent immediately via webhook
- Day 2: Scheduled in `email_sequences` table, sent by cron

**Template:** `src/worker/emails/welcomeSequence.ts`

```typescript
// Welcome sequence scheduling
async function scheduleWelcomeSequence(db, customerEmail) {
  // Day 1 email sent immediately by webhook

  // Schedule Day 2 email
  const day2 = new Date();
  day2.setDate(day2.getDate() + 1);

  await db.prepare(`
    INSERT INTO email_sequences (customer_email, sequence_type, email_number, scheduled_for)
    VALUES (?, 'welcome', 2, ?)
  `).bind(customerEmail, day2.toISOString()).run();
}
```

### 3. Lead Magnet Delivery

**Trigger:** User opts in for free workbook

**Template:** `src/worker/emails/leadMagnetDelivery.ts`

**Content:**
- Download link to PDF
- Next steps
- Call to action for paid products

```typescript
// Lead magnet delivery data
{
  firstName: "John",
  leadMagnetName: "PAIDS Framework Workbook",
  downloadUrl: "https://contentpreneurhub.online/api/files/books/paids-workbook.pdf",
  nextSteps: [
    "Download your workbook",
    "Complete the exercises",
    "Join our community"
  ]
}
```

### 4. Abandoned Cart Recovery

**Trigger:** 1 hour after cart abandonment

**Template:** `src/worker/emails/abandonedCartRecovery.ts`

**Content:**
- Products left in cart
- Checkout link to recover cart
- Urgency messaging

```typescript
// Abandoned cart data
{
  customerEmail: "user@example.com",
  products: ["Contentpreneur Starter Kit"],
  checkoutUrl: "https://contentpreneurhub.online/checkout/starter-kit?recovery=true",
  expiresIn: "24 hours"
}
```

---

## ConvertKit Integration

### Client Implementation

```typescript
// src/worker/utils/convertkit.ts
export async function syncToConvertKit(env, data) {
  const { email, firstName, tags, customFields } = data;

  // 1. Subscribe/update subscriber
  const subscriber = await createOrUpdateSubscriber(env, {
    email,
    first_name: firstName,
    fields: customFields
  });

  // 2. Add tags
  for (const tag of tags) {
    await addTagToSubscriber(env, subscriber.id, tag);
  }

  return subscriber;
}
```

### Sync Events

#### Lead Magnet Opt-In

```typescript
await syncToConvertKit(env, {
  email: 'user@example.com',
  firstName: 'John',
  tags: ['lead-magnet-paids-workbook'],
  customFields: {
    lead_magnet: 'paids-workbook',
    pain_points: 'growing audience',
    whatsapp: '+27123456789'
  }
});
```

#### Purchase Completion

```typescript
await syncToConvertKit(env, {
  email: 'customer@example.com',
  firstName: 'John',
  tags: ['customer', 'purchased-ORD-123', 'starter-kit', 'influencers-code'],
  customFields: {
    last_purchase_date: '2024-01-24',
    total_spent: '67.00',
    products_purchased: 'starter-kit, influencers-code'
  }
});
```

### ConvertKit Tags

| Tag | Description |
|-----|-------------|
| `customer` | Has made a purchase |
| `purchased-{order_number}` | Specific order reference |
| `{product_key}` | Product they purchased |
| `lead-magnet-{name}` | Free resource they opted in for |

### ConvertKit Custom Fields

| Field | Description |
|-------|-------------|
| `lead_magnet` | Which free resource they downloaded |
| `pain_points` | Self-reported challenges |
| `whatsapp` | WhatsApp number |
| `last_purchase_date` | Most recent purchase |
| `total_spent` | Lifetime value |
| `products_purchased` | List of purchased products |

---

## Email Sequences (Cron Job)

### Processing Scheduled Emails

**Endpoint:** `POST /api/cron/send-welcome-emails`

```typescript
async function processEmailSequences(env) {
  // Get unsent emails that are due
  const emails = await db.prepare(`
    SELECT * FROM email_sequences
    WHERE is_sent = 0
      AND scheduled_for <= datetime('now')
  `).all();

  for (const email of emails.results) {
    // Get email template based on sequence type and number
    const template = getEmailTemplate(email.sequence_type, email.email_number);

    // Send via Resend
    await sendEmail(env, {
      to: email.customer_email,
      subject: template.subject,
      html: template.html
    });

    // Mark as sent
    await db.prepare(`
      UPDATE email_sequences
      SET is_sent = 1, sent_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(email.id).run();
  }
}
```

### Scheduling Cron in Cloudflare

```toml
# wrangler.toml
[triggers]
crons = [
  "*/15 * * * *"  # Every 15 minutes for email sequences
]
```

---

## Email Deduplication

### Why It's Needed

Webhooks can fire multiple times for the same event. Without deduplication:
- Customer receives multiple order confirmations
- Welcome emails sent repeatedly
- Poor customer experience

### Implementation

```typescript
async function sendOrderConfirmationEmail(env, order) {
  // Check if already sent
  const existing = await db.prepare(`
    SELECT * FROM order_emails_sent
    WHERE order_id = ? AND email_type = 'order_confirmation'
  `).bind(order.id).first();

  if (existing) {
    console.log(`Order confirmation already sent for order ${order.id}`);
    return { sent: false, reason: 'already_sent' };
  }

  // Send email
  const result = await sendEmail(env, {
    to: order.customer_email,
    subject: `Order Confirmation - ${order.order_number}`,
    template: 'orderConfirmation',
    data: order
  });

  // Record that it was sent
  await db.prepare(`
    INSERT INTO order_emails_sent (order_id, email_type)
    VALUES (?, 'order_confirmation')
  `).bind(order.id).run();

  return { sent: true, messageId: result.id };
}
```

### Email Types Tracked

| Email Type | Description |
|------------|-------------|
| `order_confirmation` | Order receipt email |
| `welcome_day1` | First welcome email |
| `welcome_day2` | Second welcome email |
| `cart_recovery` | Abandoned cart email |

---

## Email Templates

### Template Structure

```typescript
// src/worker/emails/orderConfirmation.ts
export function orderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
} {
  return {
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Email-safe CSS */
          </style>
        </head>
        <body>
          <h1>Thank you for your order!</h1>
          <p>Order Number: ${data.orderNumber}</p>
          <!-- ... -->
        </body>
      </html>
    `
  };
}
```

### Email-Safe CSS Guidelines

- Use inline styles
- Avoid flexbox/grid (use tables for layout)
- Use web-safe fonts
- Include fallback colors
- Test across email clients (Gmail, Outlook, Apple Mail)

---

## Sending Emails with Resend

### Basic Send

```typescript
import { Resend } from 'resend';

async function sendEmail(env, options) {
  const resend = new Resend(env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: options.from || 'hello@contentpreneurhub.online',
    to: options.to,
    subject: options.subject,
    html: options.html
  });

  return result;
}
```

### With Template

```typescript
async function sendOrderConfirmation(env, order) {
  const template = orderConfirmationEmail({
    orderNumber: order.order_number,
    customerName: order.customer_name,
    products: await getOrderProducts(order.id),
    total: formatMoney(order.total_amount_cents, order.currency),
    accessUrl: 'https://contentpreneurhub.online/members'
  });

  return sendEmail(env, {
    from: 'orders@contentpreneurhub.online',
    to: order.customer_email,
    subject: template.subject,
    html: template.html
  });
}
```

---

## Abandoned Cart Flow

### Tracking Cart Abandonment

```typescript
// Called when checkout page loads but payment not completed
async function trackCheckoutStarted(data) {
  await db.prepare(`
    INSERT INTO abandoned_carts (customer_email, product_keys, total_amount_cents, currency)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(customer_email) DO UPDATE SET
      product_keys = excluded.product_keys,
      total_amount_cents = excluded.total_amount_cents,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    data.email,
    JSON.stringify(data.productKeys),
    data.total,
    data.currency
  ).run();
}
```

### Recovery Cron Job

```typescript
// POST /api/cron/send-abandoned-cart-emails
async function processAbandonedCarts(env) {
  // Find carts abandoned > 1 hour ago
  const carts = await db.prepare(`
    SELECT * FROM abandoned_carts
    WHERE created_at < datetime('now', '-1 hour')
      AND recovery_email_sent = 0
      AND recovered = 0
  `).all();

  for (const cart of carts.results) {
    const template = abandonedCartRecoveryEmail({
      products: JSON.parse(cart.product_keys),
      checkoutUrl: generateRecoveryUrl(cart),
      totalAmount: formatMoney(cart.total_amount_cents, cart.currency)
    });

    await sendEmail(env, {
      to: cart.customer_email,
      subject: "You left something behind...",
      html: template.html
    });

    await db.prepare(`
      UPDATE abandoned_carts
      SET recovery_email_sent = 1
      WHERE id = ?
    `).bind(cart.id).run();
  }
}
```

### Marking Cart as Recovered

```typescript
// Called when payment completes
async function markCartRecovered(customerEmail) {
  await db.prepare(`
    UPDATE abandoned_carts
    SET recovered = 1, updated_at = CURRENT_TIMESTAMP
    WHERE customer_email = ?
  `).bind(customerEmail).run();
}
```

---

## Error Handling

### Retry Failed Emails

```typescript
async function sendEmailWithRetry(env, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendEmail(env, options);
    } catch (error) {
      if (i === maxRetries - 1) {
        // Log to error tracking
        console.error('Email send failed after retries:', error);
        throw error;
      }
      // Wait before retry (exponential backoff)
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### Logging

```typescript
// Log all email sends for debugging
async function sendEmail(env, options) {
  console.log('Sending email:', {
    to: options.to,
    subject: options.subject,
    timestamp: new Date().toISOString()
  });

  const result = await resend.emails.send(/* ... */);

  console.log('Email sent:', {
    messageId: result.id,
    to: options.to
  });

  return result;
}
```
