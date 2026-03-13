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

  // Generate download links for purchased products
  const downloadLinks = generateDownloadLinks(productKeys);
  const hasDownloads = downloadLinks.length > 0;
  const hasCourse = productKeys.some(key => ['starter-kit', 'content-foundations', 'contentpreneur-pro'].includes(key));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .downloads { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fde68a; }
    .download-link { display: block; background: #f59e0b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin: 8px 0; text-align: center; font-weight: 600; }
    .download-link:hover { background: #d97706; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; }
    .course-access { background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #a7f3d0; }
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
      <p>Your payment has been confirmed and your content is ready! Here are your order details:</p>

      <div class="order-details">
        <p><strong>Order Number:</strong> ${order.order_number}</p>
        <p><strong>Products Purchased:</strong></p>
        <ul>${productList}</ul>
        <p><strong>Total:</strong> ${formattedTotal}</p>
      </div>

      ${hasDownloads ? `
      <div class="downloads">
        <h3 style="margin-top: 0; color: #92400e;">Your Downloads</h3>
        <p style="color: #78350f; font-size: 14px;">Click below to download your files directly:</p>
        ${downloadLinks.map(link => `
          <a href="${link.url}" class="download-link">${link.name}</a>
        `).join('')}
      </div>
      ` : ''}

      ${hasCourse ? `
      <div class="course-access">
        <h3 style="margin-top: 0; color: #065f46;">Video Course Access</h3>
        <p style="color: #047857; font-size: 14px;">Your video modules are ready to watch in your members area:</p>
        <a href="https://contentpreneurhub.online/members" class="button" style="background: #10b981;">Start Watching Now</a>
      </div>
      ` : ''}

      <div style="margin-top: 30px;">
        <h3>Access Your Members Area</h3>
        <p>All your content is also available in your personal members hub:</p>

        <a href="https://contentpreneurhub.online/members" class="button">Go to Members Hub</a>

        <p style="margin-top: 20px;"><strong>How to access:</strong></p>
        <ol>
          <li>Click the button above or go to contentpreneurhub.online/members</li>
          <li>Enter your email: <strong>${order.customer_email}</strong></li>
          <li>All your purchased content will be waiting for you!</li>
        </ol>
      </div>

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
    subject: `Order Confirmation - ${order.order_number} | Your Content is Ready!`,
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

// Generate download links for products
function generateDownloadLinks(productKeys: string[]): Array<{ name: string; url: string }> {
  const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

  const productDownloads: Record<string, Array<{ name: string; url: string }>> = {
    'niche-finder': [
      { name: 'Niche Finder Workbook (PDF)', url: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf` },
    ],
    'paids-workbook': [
      { name: 'PAIDS Framework Workbook (PDF)', url: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf` },
    ],
    'tax-guide': [
      { name: 'Tax Guide for Contentpreneurs (PDF)', url: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf` },
    ],
    'influencers-code': [
      { name: "The Influencer's Code eBook (PDF)", url: `${BLOB_BASE}/books/the-influencer-s-code---cracking-the-secrets-of-personal-branding-and-influence-in-the-digital-age-2WYoudRZpZ5DzSn9rSIncT2QJ7RGZp.pdf` },
    ],
    'starter-kit': [
      { name: 'PAIDS Framework Workbook (PDF)', url: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf` },
      { name: 'Niche Finder Workbook (PDF)', url: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf` },
    ],
    'contentpreneur-pro': [
      { name: "The Influencer's Code eBook (PDF)", url: `${BLOB_BASE}/books/the-influencer-s-code---cracking-the-secrets-of-personal-branding-and-influence-in-the-digital-age-2WYoudRZpZ5DzSn9rSIncT2QJ7RGZp.pdf` },
      { name: 'Tax Guide for Contentpreneurs (PDF)', url: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf` },
      { name: 'PAIDS Framework Workbook (PDF)', url: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf` },
      { name: 'Niche Finder Workbook (PDF)', url: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf` },
    ],
  };

  // Collect all downloads, avoiding duplicates
  const downloads: Array<{ name: string; url: string }> = [];
  const seenUrls = new Set<string>();

  for (const key of productKeys) {
    const productDownloadList = productDownloads[key] || [];
    for (const download of productDownloadList) {
      if (!seenUrls.has(download.url)) {
        downloads.push(download);
        seenUrls.add(download.url);
      }
    }
  }

  return downloads;
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
  const emailStyles = `
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 8px; }
    .button { display: inline-block; background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .tip-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  `;

  // Day 2: PAIDS Framework Introduction
  if (sequenceType === 'welcome' && emailNumber === 2) {
    const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
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
</html>`;

    return sendEmail(env, {
      to: email,
      subject: 'Day 2: The Framework That Changed Everything',
      html,
    });
  }

  // Day 3: Module Progress Check
  if (sequenceType === 'welcome' && emailNumber === 3) {
    const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="content">
      <p>Hey!</p>
      <p>Quick check-in - have you completed Module 1 yet?</p>
      <p>I know life gets busy, but here's the thing: <strong>the people who see results are the ones who take action</strong>.</p>
      <div class="tip-box">
        <strong>Today's Challenge:</strong> Watch just ONE module and take notes on the key takeaway. That's it. 15 minutes of focused learning.
      </div>
      <p>Remember: You don't have to be perfect. You just have to start.</p>
      <a href="https://contentpreneurhub.online/members" class="button">Continue Module 1</a>
      <p style="margin-top: 30px;">You've got this!</p>
      <p>MN</p>
    </div>
  </div>
</body>
</html>`;

    return sendEmail(env, {
      to: email,
      subject: 'Day 3: Quick check-in on your progress',
      html,
    });
  }

  // Day 7: Week 1 Recap & Quick Win Story
  if (sequenceType === 'welcome' && emailNumber === 7) {
    const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="content">
      <p>Hey!</p>
      <p>It's been a week since you started your contentpreneur journey. How are you feeling?</p>
      <p>I wanted to share a quick win story to inspire you:</p>
      <div class="tip-box">
        <strong>Thabo's Story:</strong> "I was stuck for months trying to figure out my niche. After going through Module 1, I finally narrowed it down and posted my first piece of focused content. It got 3x more engagement than anything I'd posted before!"
      </div>
      <p>The modules are designed to give you quick wins like this. The key is to implement what you learn immediately.</p>
      <p><strong>My challenge for you this week:</strong> Pick ONE thing from the course and implement it before next week. Just one.</p>
      <a href="https://contentpreneurhub.online/members" class="button">Keep Learning</a>
      <p style="margin-top: 30px;">To your success,</p>
      <p>MN</p>
    </div>
  </div>
</body>
</html>`;

    return sendEmail(env, {
      to: email,
      subject: 'Week 1 complete - here\'s a quick win story',
      html,
    });
  }

  // Day 14: Upsell Complementary Product
  if (sequenceType === 'welcome' && emailNumber === 14) {
    const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="content">
      <p>Hey!</p>
      <p>You're two weeks into your contentpreneur journey. By now, you should have a solid foundation.</p>
      <p>Many creators at this stage ask me: <strong>"What's next?"</strong></p>
      <p>If you're ready to go deeper, I recommend:</p>
      <ul>
        <li><strong>The Influencer's Code</strong> - My complete guide to building influence and landing brand deals</li>
        <li><strong>1-on-1 Strategy Call</strong> - Get personalized guidance for your specific situation</li>
      </ul>
      <p>But here's the truth: the Starter Kit alone has everything you need to build your first income streams. Don't rush to add more until you've implemented what you have.</p>
      <p><strong>Focus on action over accumulation.</strong></p>
      <a href="https://contentpreneurhub.online/members" class="button">Access Your Content</a>
      <p style="margin-top: 30px;">Keep building,</p>
      <p>MN</p>
    </div>
  </div>
</body>
</html>`;

    return sendEmail(env, {
      to: email,
      subject: 'Two weeks in - what\'s next?',
      html,
    });
  }

  // Day 30: Request Testimonial
  if (sequenceType === 'welcome' && emailNumber === 30) {
    const html = `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="content">
      <p>Hey!</p>
      <p>It's been a month since you started the Contentpreneur Starter Kit. I'd love to hear how it's going!</p>
      <p>Have you:</p>
      <ul>
        <li>Clarified your niche?</li>
        <li>Started implementing the PAIDS Framework?</li>
        <li>Seen any improvements in your content or engagement?</li>
        <li>Made your first sale or landed a deal?</li>
      </ul>
      <p><strong>I'd love to hear your story.</strong></p>
      <p>Hit reply and share your biggest win or breakthrough from the course. Your story could inspire other creators just like you!</p>
      <p>Even small wins count - sometimes the biggest transformations start with tiny shifts.</p>
      <a href="mailto:hello@contentpreneurhub.online?subject=My Contentpreneur Journey" class="button">Share Your Story</a>
      <p style="margin-top: 30px;">Looking forward to hearing from you,</p>
      <p>MN</p>
    </div>
  </div>
</body>
</html>`;

    return sendEmail(env, {
      to: email,
      subject: 'Month 1 check-in - how\'s it going?',
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
  const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';
  const leadMagnetConfig: Record<string, { name: string; downloadUrl: string }> = {
    'paids-workbook': {
      name: 'PAIDS Framework Workbook',
      downloadUrl: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf`,
    },
    'niche-finder': {
      name: 'Niche Finder Workbook',
      downloadUrl: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf`,
    },
    'tax-guide': {
      name: 'Tax Guide for Contentpreneurs',
      downloadUrl: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf`,
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
    'starter-kit': '9-Module Personal Branding Course',
    'influencers-code': "The Influencer's Code (eBook)",
    'tax-guide': 'Tax Guide for Contentpreneurs',
    'niche-finder': 'Niche Finder Workbook',
    'paids-workbook': 'PAIDS Framework Workbook',
    'content-foundations': 'Content Foundations Course',
    'contentpreneur-pro': 'Contentpreneur Pro Bundle',
    'coaching-session': '1:1 Strategy Call',
    'content-arsenal': 'Content Arsenal Expansion Pack',
    'social-media-intro': 'Introduction to Social Media Course',
    'contentpreneur-book': 'Contentpreneur Guide (eBook + Print)',
    'contentpreneur-book-ebook': 'Contentpreneur Guide (eBook)',
    'contentpreneur-book-hardcopy': 'Contentpreneur Guide (Hardcopy + eBook)',
  };
  return names[productKey] || productKey;
}
