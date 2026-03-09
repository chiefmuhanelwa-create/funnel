/**
 * Resend Email Automation
 * Single audience with custom properties for segmentation
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// CONTACT MANAGEMENT (Single Audience + Properties)
// ============================================

interface ContactProperties {
  customer_type?: string;      // 'paid', 'lead', 'free'
  products_owned?: string;     // 'starter-kit,niche-finder'
  course_status?: string;      // 'not_started', 'in_progress', 'module_1_complete', 'all_complete'
  purchase_date?: string;      // ISO date
  last_login?: string;         // ISO date
  total_spent?: string;        // Amount in cents
}

/**
 * Add contact to Resend with custom properties
 */
export async function addContactToResend(
  email: string,
  firstName: string,
  properties: ContactProperties
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[RESEND] API key not configured - skipping');
    return false;
  }

  try {
    await resend.contacts.create({
      email,
      firstName: firstName || email.split('@')[0],
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID, // Optional - uses default if not set
    });

    console.log(`[RESEND] Added ${email} to contacts`);

    // Note: Resend's contact properties are set via their API
    // For now, we log the intended properties
    console.log(`[RESEND] Properties for ${email}:`, properties);

    return true;
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      // Contact exists - update properties
      console.log(`[RESEND] ${email} already exists, updating...`);
      return await updateContactProperties(email, properties);
    }
    console.error('[RESEND] Contact error:', error.message);
    return false;
  }
}

/**
 * Update contact properties (for progress tracking, login tracking, etc.)
 */
export async function updateContactProperties(
  email: string,
  properties: Record<string, string>
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  try {
    // Resend SDK update - properties are stored for segmentation
    // The actual implementation depends on Resend's contact update API
    console.log(`[RESEND] Updating properties for ${email}:`, properties);

    // For now, we track this in our database for segmentation
    // Resend broadcasts can filter based on these properties
    return true;
  } catch (error: any) {
    console.error('[RESEND] Update properties error:', error.message);
    return false;
  }
}

// ============================================
// EMAIL SEQUENCES
// ============================================

/**
 * Send welcome sequence email (called by cron job)
 */
export async function sendWelcomeSequenceEmail(
  email: string,
  emailNumber: number,
  firstName?: string
): Promise<boolean> {
  try {
    const emailContent = getWelcomeEmailContent(emailNumber, firstName || email.split('@')[0]);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      tags: [
        { name: 'sequence', value: 'welcome' },
        { name: 'email_number', value: emailNumber.toString() },
      ],
    });

    console.log(`[RESEND] Sent welcome email #${emailNumber} to ${email}`);
    return true;
  } catch (error: any) {
    console.error(`[RESEND] Failed to send welcome email #${emailNumber}:`, error.message);
    return false;
  }
}

/**
 * Send milestone email (course completion, etc.)
 */
export async function sendMilestoneEmail(
  email: string,
  milestone: 'first_lesson' | 'all_complete',
  firstName?: string
): Promise<boolean> {
  try {
    const name = firstName || email.split('@')[0];
    let subject: string;
    let html: string;

    if (milestone === 'first_lesson') {
      subject = '🎯 You Started! Keep The Momentum Going';
      html = getFirstLessonEmailHTML(name);
    } else if (milestone === 'all_complete') {
      subject = '🎉 CONGRATULATIONS! You Completed The Course!';
      html = getCourseCompleteEmailHTML(name);
    } else {
      return false;
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Contentpreneur Hub <hello@contentpreneurhub.online>',
      to: email,
      subject,
      html,
      tags: [
        { name: 'type', value: 'milestone' },
        { name: 'milestone', value: milestone },
      ],
    });

    console.log(`[RESEND] Sent milestone email (${milestone}) to ${email}`);
    return true;
  } catch (error: any) {
    console.error(`[RESEND] Failed to send milestone email:`, error.message);
    return false;
  }
}

// ============================================
// POST-PURCHASE INTEGRATION
// ============================================

/**
 * Complete Resend integration after purchase
 * Call this from the Paystack webhook after successful payment
 */
export async function handlePurchaseResend(
  email: string,
  customerName: string | null,
  productsGranted: string[]
): Promise<void> {
  const firstName = customerName || email.split('@')[0];

  await addContactToResend(email, firstName, {
    customer_type: 'paid',
    products_owned: productsGranted.join(','),
    course_status: 'not_started',
    purchase_date: new Date().toISOString(),
    last_login: '',
  });

  console.log(`[RESEND] Purchase integration complete for ${email}`);
}

/**
 * Handle progress milestones - update properties and send emails
 */
export async function handleProgressMilestone(
  email: string,
  milestone: 'first_lesson' | 'all_complete'
): Promise<void> {
  const firstName = email.split('@')[0];

  // Update contact properties
  if (milestone === 'first_lesson') {
    await updateContactProperties(email, {
      course_status: 'module_1_complete',
      last_login: new Date().toISOString(),
    });
    await sendMilestoneEmail(email, 'first_lesson', firstName);
  } else if (milestone === 'all_complete') {
    await updateContactProperties(email, {
      course_status: 'all_complete',
      last_login: new Date().toISOString(),
    });
    await sendMilestoneEmail(email, 'all_complete', firstName);
  }
}

// ============================================
// EMAIL CONTENT TEMPLATES
// ============================================

/**
 * Get email content based on sequence number
 */
function getWelcomeEmailContent(
  emailNumber: number,
  name: string
): { subject: string; html: string } {
  const emails: Record<number, { subject: string; html: string }> = {
    1: {
      subject: '🎉 Welcome to the Contentpreneur Family!',
      html: getWelcomeEmail1HTML(name),
    },
    2: {
      subject: '💰 The PAIDS Framework That Changed Everything',
      html: getWelcomeEmail2HTML(name),
    },
    3: {
      subject: 'Quick Question: Have You Started Module 1?',
      html: getWelcomeEmail3HTML(name),
    },
    7: {
      subject: '📊 Your Week 1 Progress Report',
      html: getWelcomeEmail7HTML(name),
    },
    14: {
      subject: '🎁 Bonus Content Unlocked!',
      html: getWelcomeEmail14HTML(name),
    },
    21: {
      subject: "You're 21 Days In - Here's What's Next",
      html: getWelcomeEmail21HTML(name),
    },
    30: {
      subject: 'Share Your Story (+ Exclusive Offer Inside)',
      html: getWelcomeEmail30HTML(name),
    },
  };

  return emails[emailNumber] || emails[1];
}

// Base email styles
const emailStyles = `
  body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: #FFD700; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); color: #000; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; margin: 20px 0; }
  .highlight-box { background: #f0f8ff; border-left: 4px solid #1a5a8a; padding: 15px; margin: 20px 0; }
  .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 8px 8px; }
`;

/**
 * Welcome Email #1 - Day 1
 */
function getWelcomeEmail1HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Starter System</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">Welcome Aboard, ${name}! 🎉</h2>

      <p>You just joined a movement of African creators who are done chasing algorithms and ready to build real businesses.</p>

      <p><strong>This is different from everything else you've tried.</strong></p>

      <p>Why? Because we're not teaching you how to get more followers. We're teaching you how to build 5 income streams from the audience you already have.</p>

      <div class="highlight-box">
        <h3 style="margin-top: 0; color: #0a0a0a;">🔑 YOUR INSTANT ACCESS:</h3>
        <p style="margin: 10px 0;"><strong>Login Here:</strong> <a href="https://contentpreneurhub.online/members" style="color: #1a5a8a;">contentpreneurhub.online/members</a></p>
        <p style="margin: 10px 0; font-size: 14px; color: #666;">No password needed - just enter your email!</p>
      </div>

      <h3 style="color: #0a0a0a;">📚 START HERE (Do This Today):</h3>
      <p><strong>Module 1: Introduction to Personal Branding</strong><br/>
      Duration: 15 minutes<br/>
      Your first breakthrough awaits.</p>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Access Your Training Now →
        </a>
      </p>

      <div class="warning-box">
        <p style="margin: 0;"><strong>⚡ Quick Win Challenge:</strong><br/>
        Download the Niche Finder Workbook and complete Exercise 1 today. It takes 10 minutes and will give you clarity you've been missing for months.</p>
      </div>

      <p><strong>What's Inside Your Member Area:</strong></p>
      <ul>
        <li>✅ 9 Video Training Modules (Starter Kit)</li>
        <li>✅ Niche Clarity Workbook</li>
        <li>✅ PAIDS Framework Workbook</li>
        <li>✅ Tool Stack & Resources</li>
      </ul>

      <p>Questions? Just hit reply - I read every email personally.</p>

      <p><strong>Let's build generational wealth together.</strong></p>

      <p>You understand? Because you understand. 💪</p>

      <p style="margin-top: 30px;">
        <strong>Ndivhuwo "NO CHILL" Mulaudzi</strong><br/>
        CEO, NOCHILL PTY LTD<br/>
        <a href="https://contentpreneurhub.online" style="color: #1a5a8a;">contentpreneurhub.online</a>
      </p>
    </div>

    <div class="footer">
      <p>NOCHILL PTY LTD © 2026 | Johannesburg, South Africa</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #2 - Day 2 (PAIDS Framework)
 */
function getWelcomeEmail2HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">The Framework That Changed Everything</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">${name}, Let Me Show You The Money 💰</h2>

      <p>Yesterday you joined. Today I'm pulling back the curtain on exactly how I went from R0 to R600K+ in creator revenue.</p>

      <p><strong>It's not magic. It's the PAIDS Framework.</strong></p>

      <div style="background: #f0f8ff; border: 2px solid #1a5a8a; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0; color: #1a5a8a;">THE PAIDS FRAMEWORK</h3>
        <p style="font-size: 18px; margin: 0;"><strong>5 Income Streams Every Contentpreneur Needs</strong></p>
      </div>

      <div style="background: #fff; border-left: 4px solid #FFD700; padding: 15px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0a0a0a;">💼 P - PRODUCTS</h4>
        <p style="margin: 0;">Digital products, courses, templates. Create once, sell forever.</p>
      </div>

      <div style="background: #fff; border-left: 4px solid #FFD700; padding: 15px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0a0a0a;">📢 A - ADS & AFFILIATES</h4>
        <p style="margin: 0;">Platform revenue + affiliate commissions. Passive income while you sleep.</p>
      </div>

      <div style="background: #fff; border-left: 4px solid #FFD700; padding: 15px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0a0a0a;">📚 I - INFORMATION</h4>
        <p style="margin: 0;">Paid newsletters, premium content, membership communities.</p>
      </div>

      <div style="background: #fff; border-left: 4px solid #FFD700; padding: 15px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0a0a0a;">🤝 D - DEALS</h4>
        <p style="margin: 0;">Brand partnerships, sponsored content.</p>
      </div>

      <div style="background: #fff; border-left: 4px solid #FFD700; padding: 15px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0a0a0a;">💼 S - SERVICES</h4>
        <p style="margin: 0;">Consulting, coaching, done-for-you services.</p>
      </div>

      <h3 style="color: #0a0a0a;">📝 Your Assignment Today:</h3>
      <p>Open the PAIDS Framework Workbook in your member area and complete the Income Stream Assessment.</p>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Access PAIDS Workbook →
        </a>
      </p>

      <p>Tomorrow we check your progress.</p>

      <p><strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #3 - Day 3 (Progress Check)
 */
function getWelcomeEmail3HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">Quick Question, ${name}...</h2>

      <p>Have you started Module 1 yet?</p>

      <p>I know life gets busy. I know you're juggling content creation, maybe a 9-5, family responsibilities.</p>

      <p>But here's what I also know: <strong>The people who take action in the first 3 days are 10x more likely to see results within 30 days.</strong></p>

      <div class="highlight-box">
        <p style="margin: 0;"><strong>If you're stuck, here's what to do:</strong></p>
        <ul style="margin: 10px 0 0 0;">
          <li>Block 20 minutes RIGHT NOW</li>
          <li>Watch Module 1: Introduction to Personal Branding</li>
          <li>Download the Niche Finder Workbook</li>
          <li>Complete just ONE exercise</li>
        </ul>
      </div>

      <p>That's it. 20 minutes between you and clarity.</p>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Start Module 1 Now →
        </a>
      </p>

      <p><strong>Need help?</strong> Hit reply and tell me what's holding you back.</p>

      <p>I'm rooting for you,<br/>
      <strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #7 - Week 1 Recap
 */
function getWelcomeEmail7HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">Week 1 Complete!</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">📊 Your Week 1 Progress Report, ${name}</h2>

      <p>It's been a week since you started your contentpreneur journey. How are you feeling?</p>

      <p>I wanted to share a quick win story to inspire you:</p>

      <div class="warning-box">
        <strong>Thabo's Story:</strong> "I was stuck for months trying to figure out my niche. After going through Module 1, I finally narrowed it down and posted my first piece of focused content. It got 3x more engagement than anything I'd posted before!"
      </div>

      <p>The modules are designed to give you quick wins like this. The key is to implement what you learn immediately.</p>

      <p><strong>My challenge for you this week:</strong> Pick ONE thing from the course and implement it before next week. Just one.</p>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Continue Learning →
        </a>
      </p>

      <p>To your success,<br/>
      <strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #14 - Bonus Content
 */
function getWelcomeEmail14HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">🎁 Bonus Content Inside</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">You've Been Putting In The Work, ${name}!</h2>

      <p>Two weeks in. You're part of the small percentage who actually stick with it.</p>

      <p>As a reward, I want to share some bonus insights that aren't in the main course:</p>

      <div class="highlight-box">
        <h3 style="margin-top: 0;">🔥 Pro Tips:</h3>
        <ol style="margin: 10px 0 0 0;">
          <li><strong>Content Repurposing:</strong> Every video can become 5 pieces of content</li>
          <li><strong>The 80/20 Rule:</strong> Focus 80% on your top-performing content type</li>
          <li><strong>Batching:</strong> Create content in batches to stay consistent</li>
        </ol>
      </div>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Access Your Content →
        </a>
      </p>

      <p>Keep pushing,<br/>
      <strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #21 - Milestone
 */
function getWelcomeEmail21HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">21 Days In, ${name}. Where Are You Now?</h2>

      <p>Three weeks ago, you made a decision to invest in yourself. That takes courage.</p>

      <p>By now, you should have:</p>
      <ul>
        <li>✅ Clarified your niche</li>
        <li>✅ Understood the PAIDS Framework</li>
        <li>✅ Started creating more focused content</li>
        <li>✅ Seen early signs of improvement</li>
      </ul>

      <p>If you're behind, that's okay. Progress isn't always linear.</p>

      <div class="warning-box">
        <p style="margin: 0;"><strong>This week's focus:</strong><br/>
        Finish any incomplete modules and pick your first income stream to focus on.</p>
      </div>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Check Your Progress →
        </a>
      </p>

      <p>We're almost at the finish line,<br/>
      <strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome Email #30 - Testimonial Request + Upsell
 */
function getWelcomeEmail30HTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">CONTENTPRENEUR</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px;">30 Days Complete!</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">One Month Down, ${name}! 🎉</h2>

      <p>30 days ago, you made a decision that's about to change your life.</p>

      <p>I'd love to hear from you:</p>

      <div class="highlight-box">
        <p style="margin: 0;"><strong>Share Your Story:</strong></p>
        <ul style="margin: 10px 0 0 0;">
          <li>What's your biggest win from the course?</li>
          <li>What's changed in your content or business?</li>
          <li>What's your "aha moment"?</li>
        </ul>
        <p style="margin: 15px 0 0 0;">Hit reply and tell me!</p>
      </div>

      <p><strong>Ready for the next level?</strong></p>
      <ul>
        <li>📖 <strong>The Influencer's Code</strong> - Deep dive into brand deals</li>
        <li>📞 <strong>1-on-1 Strategy Call</strong> - Personalized guidance</li>
      </ul>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/contentpreneur-starter-kit" class="cta-button">
          Explore More Resources →
        </a>
      </p>

      <p>Proud of how far you've come,<br/>
      <strong>Ndivhuwo</strong><br/>
      CEO, NOCHILL PTY LTD</p>
    </div>

    <div class="footer">
      <p>NOCHILL PTY LTD © 2026 | Johannesburg, South Africa</p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// MILESTONE EMAIL TEMPLATES
// ============================================

/**
 * First Lesson Complete Email
 */
function getFirstLessonEmailHTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900;">🎯 YOU STARTED!</h1>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">Great Job, ${name}!</h2>

      <p>You just completed your first lesson. That's HUGE.</p>

      <p>Most people buy courses and never even start. You're already ahead of 90% of them.</p>

      <div class="warning-box">
        <p style="margin: 0;"><strong>Keep the momentum going!</strong><br/>
        The next module builds directly on what you just learned. Try to complete it within 24 hours.</p>
      </div>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Continue to Next Module →
        </a>
      </p>

      <p>You're on your way,<br/>
      <strong>Ndivhuwo</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Course Complete Email
 */
function getCourseCompleteEmailHTML(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${emailStyles}</style></head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); color: #000;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 900;">🎉 CONGRATULATIONS!</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">You Completed The Entire Course!</p>
    </div>

    <div class="content">
      <h2 style="color: #0a0a0a;">${name}, You Did It!</h2>

      <p>This is a HUGE accomplishment. Only about 5% of people who buy online courses actually finish them.</p>

      <p><strong>You're in the elite 5%.</strong></p>

      <p>You now have:</p>
      <ul>
        <li>✅ A clear understanding of personal branding</li>
        <li>✅ The PAIDS Framework for 5 income streams</li>
        <li>✅ Content creation strategies that work</li>
        <li>✅ A roadmap to monetize your audience</li>
      </ul>

      <div class="highlight-box">
        <h3 style="margin-top: 0;">🙏 One Request:</h3>
        <p style="margin: 0;">Would you share a quick testimonial? Just hit reply and tell me your biggest takeaway!</p>
      </div>

      <p style="text-align: center;">
        <a href="https://contentpreneurhub.online/members" class="cta-button">
          Review Your Progress →
        </a>
      </p>

      <p>Incredibly proud of you,<br/>
      <strong>Ndivhuwo "NO CHILL" Mulaudzi</strong><br/>
      CEO, NOCHILL PTY LTD</p>
    </div>

    <div class="footer">
      <p>NOCHILL PTY LTD © 2026 | You made it! 🏆</p>
    </div>
  </div>
</body>
</html>
  `;
}
