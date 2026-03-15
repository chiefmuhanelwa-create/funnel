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
    name: 'Your Resource',
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
      <h1>Your Resource is Ready!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName || 'there'},</p>

      <p>Thanks for signing up! Here's your <strong>${config.name}</strong>.</p>

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

// Send Contentpreneur Starter Kit email for unqualified leads
export async function sendStarterKitEmail(
  env: Env,
  email: string
): Promise<boolean> {
  const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C9A84C, #E8C96A); color: #0A0A0A; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 10px 0 0; opacity: 0.8; }
    .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; }
    .download-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 20px 0; }
    .download-card h3 { margin: 0 0 12px; color: #111; }
    .download-card p { margin: 0 0 16px; color: #666; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #C9A84C, #E8C96A); color: #0A0A0A; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .button:hover { opacity: 0.9; }
    .resources { margin: 30px 0; }
    .resource-item { display: flex; align-items: center; padding: 16px; background: #fefce8; border-radius: 8px; margin: 10px 0; }
    .resource-item span { margin-left: 12px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding: 20px; }
    .cta-box { background: #0A0A0A; color: #F0EEE8; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; }
    .cta-box h3 { color: #C9A84C; margin: 0 0 12px; }
    .cta-box p { margin: 0 0 20px; opacity: 0.8; }
    .cta-button { display: inline-block; background: #C9A84C; color: #0A0A0A; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Contentpreneur Starter Kit</h1>
      <p>Everything you need to start building your content business</p>
    </div>
    <div class="content">
      <p>Hey there,</p>

      <p>I appreciate your honesty about where you are right now. Building a content business is a journey, and everyone starts somewhere different.</p>

      <p>I've put together a Starter Kit to help you build at your own pace. These are the same foundations our coaching clients use — now they're yours.</p>

      <div class="download-card">
        <h3>📘 PAIDS Framework Workbook</h3>
        <p>The 5-pillar system for building a sustainable content business. Master Positioning, Audience, Income, Distribution, and Systems.</p>
        <a href="${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf" class="button">Download PAIDS Workbook</a>
      </div>

      <div class="download-card">
        <h3>🎯 Niche Finder Workbook</h3>
        <p>Stop guessing and find your profitable niche. This workbook helps you identify the intersection of passion, expertise, and market demand.</p>
        <a href="${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf" class="button">Download Niche Finder</a>
      </div>

      <div class="resources">
        <h3>What to do next:</h3>
        <div class="resource-item">
          <span>1️⃣ Start with the Niche Finder — clarity on your niche unlocks everything else</span>
        </div>
        <div class="resource-item">
          <span>2️⃣ Work through the PAIDS Framework — this is the roadmap for your business</span>
        </div>
        <div class="resource-item">
          <span>3️⃣ Take action — implement one thing from each workbook this week</span>
        </div>
      </div>

      <div class="cta-box">
        <h3>Ready to Accelerate Your Growth?</h3>
        <p>When you're ready to invest in personalized guidance, our 1-on-1 strategy sessions are available. We'll map your content business and show you exactly where you're leaving money on the table.</p>
        <a href="https://contentpreneurhub.online/booking" class="cta-button">Apply for a Strategy Session</a>
      </div>

      <p>Remember: Consistency beats perfection. Start where you are, use what you have, do what you can.</p>

      <p>To your success,<br>
      <strong>MN</strong><br>
      Contentpreneur Hub</p>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
        <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you requested the Contentpreneur Starter Kit.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(env, {
    to: email,
    subject: 'Your Contentpreneur Starter Kit is Ready',
    html,
  });
}

// Send booking confirmation email to qualified leads who booked via Calendly
export async function sendBookingConfirmationEmail(
  env: Env,
  email: string,
  fullName: string,
  bookedDate: string,
  bookedTime: string
): Promise<boolean> {
  // 5-minute pre-call video URL - TODO: Update this with the actual video URL when available
  const PRE_CALL_VIDEO_URL = 'https://contentpreneurhub.online/pre-call-video';
  const WHATSAPP_NUMBER = '+27 68 510 3161';

  const firstName = fullName.split(' ')[0];

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C9A84C, #E8C96A); color: #0A0A0A; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 10px 0 0; opacity: 0.8; }
    .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; }
    .booking-card { background: #0A0A0A; color: #F0EEE8; border-radius: 12px; padding: 30px; margin: 24px 0; text-align: center; }
    .booking-card h2 { color: #C9A84C; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    .booking-card .date { font-size: 24px; font-weight: bold; margin: 0 0 4px; }
    .booking-card .time { font-size: 20px; color: #C9A84C; margin: 0; }
    .video-card { background: linear-gradient(135deg, #C9A84C, #E8C96A); border-radius: 12px; padding: 30px; margin: 24px 0; text-align: center; }
    .video-card h3 { color: #0A0A0A; margin: 0 0 12px; font-size: 20px; }
    .video-card p { color: #0A0A0A; opacity: 0.8; margin: 0 0 20px; }
    .video-button { display: inline-block; background: #0A0A0A; color: #F0EEE8; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
    .video-button:hover { opacity: 0.9; }
    .checklist { background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .checklist h3 { margin: 0 0 16px; color: #111; }
    .checklist-item { display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .checklist-item:last-child { border-bottom: none; }
    .checklist-item .number { width: 28px; height: 28px; background: #C9A84C; color: #0A0A0A; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; margin-right: 12px; flex-shrink: 0; }
    .checklist-item p { margin: 0; color: #374151; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .warning p { margin: 0; color: #92400e; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're Booked! 🎉</h1>
      <p>Your Strategy Session is confirmed</p>
    </div>
    <div class="content">
      <p>Hey ${firstName},</p>

      <p>Amazing — you're officially booked for your 1-on-1 Contentpreneur Strategy Session!</p>

      <div class="booking-card">
        <h2>Your Session</h2>
        <p class="date">${bookedDate}</p>
        <p class="time">${bookedTime}</p>
      </div>

      <div class="video-card">
        <h3>⚠️ IMPORTANT: Watch This First</h3>
        <p>This 5-minute video will prepare you for our session. <strong>Sessions with unprepped applicants get rescheduled.</strong></p>
        <a href="${PRE_CALL_VIDEO_URL}" class="video-button">▶️ Watch Pre-Call Video</a>
      </div>

      <div class="checklist">
        <h3>Before Your Call:</h3>
        <div class="checklist-item">
          <span class="number">1</span>
          <p><strong>Watch the 5-min video above</strong> — this is required. It will help us make the most of your session.</p>
        </div>
        <div class="checklist-item">
          <span class="number">2</span>
          <p><strong>Save our WhatsApp number:</strong> ${WHATSAPP_NUMBER} — we'll send you a reminder 1 hour before your call.</p>
        </div>
        <div class="checklist-item">
          <span class="number">3</span>
          <p><strong>Come with clarity on your goals</strong> — the more specific you are, the more valuable your session will be.</p>
        </div>
      </div>

      <div class="warning">
        <p><strong>Note:</strong> If you need to reschedule, please do so at least 24 hours in advance using the link in your calendar invite. No-shows or last-minute cancellations may lose their spot.</p>
      </div>

      <p>Looking forward to mapping out your content business with you!</p>

      <p>To your success,<br>
      <strong>MN</strong><br>
      Contentpreneur Hub</p>

      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Contentpreneur Hub. All rights reserved.</p>
        <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you booked a Strategy Session.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail(env, {
    to: email,
    subject: `🎉 You're Booked! Strategy Session on ${bookedDate}`,
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
    'contentpreneur-book': 'Contentpreneur Guide (eBook + Print)',
    'contentpreneur-book-ebook': 'Contentpreneur Guide (eBook)',
    'contentpreneur-book-hardcopy': 'Contentpreneur Guide (Hardcopy + eBook)',
  };
  return names[productKey] || productKey;
}
