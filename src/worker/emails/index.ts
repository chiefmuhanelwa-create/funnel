import type { Env, Order } from '../types';

const RESEND_API_URL = 'https://api.resend.com/emails';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendEmail(env: Env, options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'Contentpreneur Hub <hello@contentpreneurhub.online>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(
  env: Env,
  order: Order,
  productKeys: string[]
): Promise<boolean> {
  const db = env.DB;

  // Check if already sent (deduplication)
  const existing = await db.prepare(`
    SELECT * FROM order_emails_sent
    WHERE order_id = ? AND email_type = 'order_confirmation'
  `).bind(order.id).first();

  if (existing) {
    console.log('Order confirmation already sent for order:', order.id);
    return true;
  }

  const currencySymbol = order.currency === 'ZAR' ? 'R' : '$';
  const formattedTotal = `${currencySymbol}${(order.total_amount_cents / 100).toFixed(2)}`;

  const productList = productKeys.map(key => `<li>${formatProductName(key)}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d946ef, #a21caf); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Order!</h1>
    </div>
    <div class="content">
      <p>Hi ${order.customer_name || 'there'},</p>
      <p>Your payment has been confirmed. Here are your order details:</p>

      <div class="order-details">
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Products:</strong></p>
        <ul>${productList}</ul>
        <p><strong>Total:</strong> ${formattedTotal}</p>
      </div>

      <p>You can access your purchases by logging in to your account:</p>

      <a href="https://contentpreneurhub.online/members" class="button">Access Your Content</a>

      <p style="margin-top: 30px;"><strong>How to access:</strong></p>
      <ol>
        <li>Click the button above or go to contentpreneurhub.online/members</li>
        <li>Click "Member Login" in the footer</li>
        <li>Sign in with Google using the email address: ${order.customer_email}</li>
        <li>Your purchased content will be waiting for you!</li>
      </ol>

      <div class="footer">
        <p>Questions? Reply to this email or contact us at hello@contentpreneurhub.online</p>
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const sent = await sendEmail(env, {
    from: 'Contentpreneur Hub <orders@contentpreneurhub.online>',
    to: order.customer_email,
    subject: `Order Confirmation - ${order.order_number}`,
    html,
  });

  if (sent) {
    // Record that email was sent
    await db.prepare(`
      INSERT INTO order_emails_sent (order_id, email_type)
      VALUES (?, 'order_confirmation')
    `).bind(order.id).run();
  }

  return sent;
}

export async function sendWelcomeEmail(
  env: Env,
  email: string,
  name: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d946ef, #a21caf); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to the Contentpreneur Family!</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>

      <p>Welcome! I'm so excited to have you here.</p>

      <p>You've just taken the first step towards building a successful content creation business, and I couldn't be more thrilled to be part of your journey.</p>

      <p>Here's what you should do first:</p>

      <ol>
        <li><strong>Log in to your account</strong> - Access all your purchased content</li>
        <li><strong>Start with Module 1</strong> - It sets the foundation for everything else</li>
        <li><strong>Join our community</strong> - Connect with other contentpreneurs</li>
      </ol>

      <a href="https://contentpreneurhub.online/members" class="button">Start Learning Now</a>

      <p style="margin-top: 30px;">Remember: Consistency beats perfection. Start where you are, use what you have, do what you can.</p>

      <p>To your success,<br>
      <strong>MN</strong><br>
      Contentpreneur Hub</p>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(env, {
    to: email,
    subject: 'Welcome to Contentpreneur Hub!',
    html,
  });
}

export async function sendWelcomeSequenceEmail(
  env: Env,
  email: string,
  sequenceType: string,
  emailNumber: number
): Promise<boolean> {
  // Day 2 welcome email
  if (sequenceType === 'welcome' && emailNumber === 2) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hey there!</p>

      <p>It's day 2 of your contentpreneur journey. How's it going?</p>

      <p>I wanted to check in and share something important:</p>

      <p><strong>The PAIDS Framework</strong> - This is the heart of everything I teach. If you haven't started with it yet, now is the time.</p>

      <p>PAIDS stands for:</p>
      <ul>
        <li><strong>P</strong>ositioning - Define your unique space</li>
        <li><strong>A</strong>udience - Know exactly who you serve</li>
        <li><strong>I</strong>ncome - Build multiple revenue streams</li>
        <li><strong>D</strong>istribution - Get your content seen</li>
        <li><strong>S</strong>ystems - Automate and scale</li>
      </ul>

      <p>Master these five pillars, and you'll have a sustainable content business.</p>

      <a href="https://contentpreneurhub.online/members" class="button">Continue Learning</a>

      <p style="margin-top: 30px;">Keep pushing forward!</p>

      <p>MN</p>
    </div>
  </div>
</body>
</html>
    `;

    return sendEmail(env, {
      to: email,
      subject: 'Day 2: The Framework That Changed Everything',
      html,
    });
  }

  return true;
}

export async function sendLeadMagnetEmail(
  env: Env,
  email: string,
  firstName: string,
  leadMagnet: string
): Promise<boolean> {
  const leadMagnetConfig: Record<string, { name: string; downloadUrl: string }> = {
    'paids-workbook': {
      name: 'PAIDS Framework Workbook',
      downloadUrl: 'https://contentpreneurhub.online/api/files/books/paids-workbook.pdf',
    },
    'niche-finder': {
      name: 'Niche Finder Workbook',
      downloadUrl: 'https://contentpreneurhub.online/api/files/books/niche-finder.pdf',
    },
  };

  const config = leadMagnetConfig[leadMagnet] || {
    name: 'Your Free Resource',
    downloadUrl: 'https://contentpreneurhub.online/members',
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d946ef, #a21caf); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Free Resource is Ready!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName || 'there'},</p>

      <p>Thanks for signing up! Here's your free <strong>${config.name}</strong>.</p>

      <a href="${config.downloadUrl}" class="button">Download Now</a>

      <p style="margin-top: 30px;"><strong>What's inside:</strong></p>
      <ul>
        <li>Step-by-step exercises to apply immediately</li>
        <li>Real-world examples and templates</li>
        <li>Actionable strategies you can implement today</li>
      </ul>

      <p><strong>Pro tip:</strong> Don't just read it - actually do the exercises. That's where the magic happens.</p>

      <p>If you find this helpful and want to go deeper, check out the <a href="https://contentpreneurhub.online/contentpreneur-starter-kit">Contentpreneur Starter Kit</a> - it's the complete system for building your content business.</p>

      <p>To your success,<br>
      <strong>MN</strong></p>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(env, {
    to: email,
    subject: `Here's your ${config.name}!`,
    html,
  });
}

export async function sendAbandonedCartEmail(
  env: Env,
  email: string,
  productKeys: string[],
  totalCents: number,
  currency: string
): Promise<boolean> {
  const currencySymbol = currency === 'ZAR' ? 'R' : '$';
  const formattedTotal = `${currencySymbol}${(totalCents / 100).toFixed(2)}`;
  const productList = productKeys.map(key => `<li>${formatProductName(key)}</li>`).join('');

  // Generate checkout URL with recovery flag
  const checkoutUrl = `https://contentpreneurhub.online/checkout/${productKeys[0]}?recovery=true&email=${encodeURIComponent(email)}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d946ef, #a21caf); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .cart-items { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You Left Something Behind...</h1>
    </div>
    <div class="content">
      <p>Hey there,</p>

      <p>I noticed you were checking out but didn't complete your order. No worries - I've saved your cart for you!</p>

      <div class="cart-items">
        <p><strong>Your cart:</strong></p>
        <ul>${productList}</ul>
        <p><strong>Total:</strong> ${formattedTotal}</p>
      </div>

      <p>Ready to continue?</p>

      <a href="${checkoutUrl}" class="button">Complete Your Order</a>

      <p style="margin-top: 30px;">If you have any questions or need help deciding, just reply to this email. I'm here to help!</p>

      <p>MN</p>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(env, {
    to: email,
    subject: 'You left something in your cart...',
    html,
  });
}

function formatProductName(productKey: string): string {
  const names: Record<string, string> = {
    'starter-kit': 'Contentpreneur Starter Kit',
    'influencers-code': "The Influencer's Code",
    'tax-guide': 'Creator Tax Guide SA',
    'niche-finder': 'Niche Finder Workbook',
    'paids-workbook': 'PAIDS Framework Workbook',
    'content-foundations': 'Content Foundations Masterclass',
    'contentpreneur-pro': 'Contentpreneur Pro Bundle',
    'coaching-session': '1-on-1 Coaching Session',
  };
  return names[productKey] || productKey;
}
