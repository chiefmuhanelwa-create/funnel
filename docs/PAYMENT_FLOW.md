# Payment Flow & Processing

This document details the complete payment processing system for Contentpreneur Hub, including checkout flow, payment verification, webhook handling, and access granting.

## Overview

### Dual Payment System

| Provider | Currency | Use Case |
|----------|----------|----------|
| **Paystack** (Primary) | ZAR | South African customers |
| **Stripe** (Secondary) | USD | International customers |

### Key Features
- Live USD to ZAR conversion via Frankfurter API
- Exchange rate cached for 1 hour
- Product bundles with automatic access granting
- Abandoned cart recovery
- Email sequences triggered on purchase

---

## Complete Checkout Flow

### Step 1: Customer Landing

```
Customer lands on product page (e.g., /contentpreneur-starter-kit)
         │
         ▼
Clicks "Enroll Now"
         │
         ▼
Redirects to /checkout/starter-kit
```

### Step 2: Checkout Page

The checkout page renders:
- Main product (required)
- Order bumps (optional add-ons)
- Form fields (if not logged in)
- Total calculation in real-time

```typescript
// Frontend: Real-time total calculation
const calculateTotal = () => {
  let total = mainProduct.price_cents;
  selectedBumps.forEach(bump => {
    total += bump.price_cents;
  });
  return total;
};
```

### Step 3: Initiate Payment

Customer clicks "Complete Order":

```typescript
// Frontend request
POST /api/checkout/create-session
{
  productKeys: ['starter-kit'],
  includeOrderBumps: ['influencers-code', 'tax-guide'],
  customerEmail: 'customer@example.com',
  customerName: 'John Doe'
}
```

### Step 4: Backend Order Creation

```typescript
// Backend processing
async function createCheckoutSession(data) {
  // 1. Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${randomString(6)}`;

  // 2. Calculate total in USD
  const totalUSD = calculateTotal(data.productKeys, data.includeOrderBumps);

  // 3. Get live exchange rate
  const rate = await getExchangeRate('USD', 'ZAR');
  const totalZAR = Math.round(totalUSD * rate);

  // 4. Create order record (status: pending)
  const order = await db.prepare(`
    INSERT INTO orders (order_number, customer_email, customer_name,
                        payment_status, total_amount_cents, currency)
    VALUES (?, ?, ?, 'pending', ?, 'ZAR')
  `).bind(orderNumber, data.customerEmail, data.customerName, totalZAR).run();

  // 5. Create order_items for each product
  for (const productKey of allProducts) {
    await db.prepare(`
      INSERT INTO order_items (order_id, product_key, price_cents)
      VALUES (?, ?, ?)
    `).bind(order.id, productKey, getPriceForProduct(productKey)).run();
  }

  // 6. Initialize Paystack transaction
  const paystack = await initializePaystack({
    email: data.customerEmail,
    amount: totalZAR, // Amount in kobo (cents)
    currency: 'ZAR',
    metadata: {
      order_id: order.id,
      order_number: orderNumber
    }
  });

  // 7. Return checkout URL
  return {
    checkoutUrl: paystack.authorization_url,
    orderNumber,
    totalUSD,
    totalZAR
  };
}
```

### Step 5: Paystack Payment

```
Customer redirected to Paystack
         │
         ▼
Paystack handles:
  - Payment form
  - Card processing
  - 3D Secure authentication
         │
         ▼
Customer completes payment
         │
         ▼
Paystack redirects to: /checkout/success?reference={paystack_ref}
```

### Step 6: Success Page Verification

```typescript
// Success page polls for verification
const verifyPayment = async (reference) => {
  const response = await fetch(`/api/checkout/verify?reference=${reference}`);
  const data = await response.json();

  if (data.order.payment_status === 'completed') {
    // Show success message
    // Display order details
    // Show access instructions
  } else {
    // Continue polling or show pending message
  }
};
```

### Step 7: Webhook Processing (Parallel)

While the success page polls, Paystack sends a webhook:

```
POST /api/webhooks/paystack
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

---

## Webhook Handler Details

### Signature Verification

```typescript
const verifyPaystackSignature = (body: string, signature: string, secret: string) => {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(body)
    .digest('hex');

  return hash === signature;
};

app.post('/api/webhooks/paystack', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('x-paystack-signature');

  if (!verifyPaystackSignature(body, signature, env.PAYSTACK_WEBHOOK_SECRET)) {
    return c.json({ error: 'Invalid signature' }, 400);
  }

  // Process webhook...
});
```

### Webhook Handler Actions

```typescript
async function handlePaystackWebhook(event, data, env) {
  if (event !== 'charge.success') return;

  const { order_id, order_number } = data.metadata;

  // 1. Update order status
  await db.prepare(`
    UPDATE orders
    SET payment_status = 'completed', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(order_id).run();

  // 2. Grant product access (including bundles)
  const orderItems = await getOrderItems(order_id);
  for (const item of orderItems) {
    await grantProductAccess(db, customerEmail, item.product_key, order_id);
  }

  // 3. Mark abandoned cart as recovered
  await db.prepare(`
    UPDATE abandoned_carts
    SET recovered = 1, updated_at = CURRENT_TIMESTAMP
    WHERE customer_email = ?
  `).bind(customerEmail).run();

  // 4. Send order confirmation email
  await sendOrderConfirmationEmail(env, order);

  // 5. Send welcome email (if first purchase)
  const isFirstPurchase = await checkFirstPurchase(customerEmail);
  if (isFirstPurchase) {
    await sendWelcomeEmail(env, customerEmail);
  }

  // 6. Sync to ConvertKit
  await syncToConvertKit(env, {
    email: customerEmail,
    firstName: customerName,
    tags: ['customer', `purchased-${order_number}`],
    customFields: {
      total_spent: formatMoney(totalAmount),
      products_purchased: productKeys.join(', ')
    }
  });

  // 7. Schedule email sequences
  await scheduleWelcomeSequence(db, customerEmail);
}
```

---

## Product Bundles System

### Bundle Definitions

```typescript
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  // $67 starter kit includes these two workbooks

  'contentpreneur-pro': ['starter-kit', 'influencers-code', 'tax-guide', 'content-foundations'],
  // $147 pro bundle includes all 4 products
};
```

### Access Grant Function

```typescript
async function grantProductAccess(
  db: D1Database,
  email: string,
  productKey: string,
  orderId: number
): Promise<{ granted: string[], skipped: string[], failed: string[] }> {
  const result = { granted: [], skipped: [], failed: [] };

  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Get main product
  const product = await getProductByKey(productKey);
  if (!product) {
    result.failed.push(productKey);
    return result;
  }

  // Get all products to grant (main + bundled)
  const productsToGrant = [productKey];
  if (PRODUCT_BUNDLES[productKey]) {
    productsToGrant.push(...PRODUCT_BUNDLES[productKey]);
  }

  // Grant access to each product
  for (const key of productsToGrant) {
    const prod = await getProductByKey(key);
    if (!prod) {
      result.failed.push(key);
      continue;
    }

    // Check if already has access
    const existing = await db.prepare(`
      SELECT * FROM customer_access
      WHERE customer_email = ? AND product_id = ?
    `).bind(normalizedEmail, prod.id).first();

    if (existing) {
      result.skipped.push(key);
      continue;
    }

    // Grant access
    await db.prepare(`
      INSERT INTO customer_access (customer_email, product_id, order_id)
      VALUES (?, ?, ?)
    `).bind(normalizedEmail, prod.id, orderId).run();

    result.granted.push(key);
  }

  return result;
}
```

---

## Currency Conversion

### Exchange Rate Fetching

```typescript
async function getExchangeRate(from: string, to: string): Promise<number> {
  // Check cache first (1 hour TTL)
  const cached = await getFromCache(`exchange-rate-${from}-${to}`);
  if (cached && cached.timestamp > Date.now() - 3600000) {
    return cached.rate;
  }

  // Fetch from Frankfurter API
  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${from}&to=${to}`
  );
  const data = await response.json();
  const rate = data.rates[to];

  // Cache the rate
  await setCache(`exchange-rate-${from}-${to}`, {
    rate,
    timestamp: Date.now()
  });

  return rate;
}
```

### Price Display

```typescript
// Frontend: Display prices in ZAR
const displayPrice = (priceUSD: number, exchangeRate: number) => {
  const priceZAR = Math.round(priceUSD * exchangeRate);
  return `R ${(priceZAR / 100).toFixed(2)}`;
};
```

---

## Abandoned Cart Recovery

### Cart Tracking

```typescript
// When user starts checkout but doesn't complete
async function trackAbandonedCart(data) {
  await db.prepare(`
    INSERT INTO abandoned_carts (customer_email, product_keys, total_amount_cents)
    VALUES (?, ?, ?)
    ON CONFLICT(customer_email) DO UPDATE SET
      product_keys = excluded.product_keys,
      total_amount_cents = excluded.total_amount_cents,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    data.email,
    JSON.stringify(data.productKeys),
    data.total
  ).run();
}
```

### Recovery Cron Job

```typescript
// POST /api/cron/send-abandoned-cart-emails
async function sendAbandonedCartEmails(env) {
  // Find carts abandoned > 1 hour ago that haven't been recovered or emailed
  const carts = await db.prepare(`
    SELECT * FROM abandoned_carts
    WHERE created_at < datetime('now', '-1 hour')
      AND recovery_email_sent = 0
      AND recovered = 0
  `).all();

  for (const cart of carts.results) {
    // Send recovery email
    await sendEmail(env, {
      to: cart.customer_email,
      subject: "You left something behind...",
      template: 'abandonedCartRecovery',
      data: {
        products: JSON.parse(cart.product_keys),
        checkoutUrl: generateCheckoutUrl(cart)
      }
    });

    // Mark as sent
    await db.prepare(`
      UPDATE abandoned_carts
      SET recovery_email_sent = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(cart.id).run();
  }
}
```

---

## Email Deduplication

### Preventing Duplicate Emails

```typescript
async function sendOrderConfirmationEmail(env, order) {
  // Check if already sent
  const existing = await db.prepare(`
    SELECT * FROM order_emails_sent
    WHERE order_id = ? AND email_type = 'order_confirmation'
  `).bind(order.id).first();

  if (existing) {
    console.log('Order confirmation already sent, skipping');
    return;
  }

  // Send email
  await sendEmail(env, {
    to: order.customer_email,
    subject: `Order Confirmation - ${order.order_number}`,
    template: 'orderConfirmation',
    data: { order }
  });

  // Record that it was sent
  await db.prepare(`
    INSERT INTO order_emails_sent (order_id, email_type)
    VALUES (?, 'order_confirmation')
  `).bind(order.id).run();
}
```

---

## Order Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER CHECKOUT FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

Customer                    Frontend                    Backend                    Paystack
   │                           │                           │                          │
   │  Click "Enroll Now"       │                           │                          │
   │ ─────────────────────────>│                           │                          │
   │                           │                           │                          │
   │                           │  POST /checkout/create    │                          │
   │                           │ ─────────────────────────>│                          │
   │                           │                           │                          │
   │                           │                           │  Initialize Transaction  │
   │                           │                           │ ────────────────────────>│
   │                           │                           │                          │
   │                           │                           │  Checkout URL            │
   │                           │                           │ <────────────────────────│
   │                           │                           │                          │
   │                           │  Redirect URL             │                          │
   │                           │ <─────────────────────────│                          │
   │                           │                           │                          │
   │  Redirect to Paystack     │                           │                          │
   │ <─────────────────────────│                           │                          │
   │                           │                           │                          │
   │  Complete Payment         │                           │                          │
   │ ──────────────────────────────────────────────────────────────────────────────>│
   │                           │                           │                          │
   │  Redirect to Success      │                           │  Webhook                 │
   │ <──────────────────────────────────────────────────────────────────────────────│
   │                           │                           │ <────────────────────────│
   │                           │                           │                          │
   │                           │  GET /checkout/verify     │  Process webhook:        │
   │                           │ ─────────────────────────>│  - Update order          │
   │                           │                           │  - Grant access          │
   │                           │                           │  - Send emails           │
   │                           │  Verification result      │  - Sync ConvertKit       │
   │                           │ <─────────────────────────│                          │
   │                           │                           │                          │
   │  Show success message     │                           │                          │
   │ <─────────────────────────│                           │                          │
```

---

## Error Handling

### Payment Failures

```typescript
// Handle failed payments
app.post('/api/webhooks/paystack', async (c) => {
  const { event, data } = await c.req.json();

  if (event === 'charge.failed') {
    const { order_id } = data.metadata;

    // Update order status
    await db.prepare(`
      UPDATE orders
      SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(order_id).run();

    // Optionally send failure notification
    // await sendPaymentFailedEmail(env, order);
  }
});
```

### Retry Logic

For transient failures (network issues), implement exponential backoff:

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

---

## Testing Payments

### Paystack Test Mode

Use test API keys and test card numbers:
- **Test Card:** 4084 0841 1111 1111
- **Expiry:** Any future date
- **CVV:** 408

### Webhook Testing

Use ngrok or similar to expose local webhook endpoint:
```bash
ngrok http 8787
# Use the ngrok URL as your webhook endpoint in Paystack dashboard
```
