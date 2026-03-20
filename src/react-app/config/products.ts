// Centralized Product Configuration
// Single source of truth for all product data
//
// IMPORTANT: All prices are in ZAR CENTS (e.g., 69900 = R699.00)
// No currency conversion needed - all prices displayed directly in South African Rand

export interface Product {
  key: string;
  name: string;
  shortName: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  icon: string; // Emoji icon (fallback)
  imageUrl?: string; // Product mockup image URL
  color: string; // Tailwind color class
  features: string[];
  accessLink: string;
  purchaseLink: string;
  category: 'course' | 'ebook' | 'workbook' | 'guide' | 'bundle' | 'service';
  isPreOrder?: boolean; // Product available for pre-order only
  preOrderDate?: string; // Expected availability date
}

// Image URLs from Vercel Blob Storage
const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';
const PRODUCT_IMAGES = {
  starterKit: `${BLOB_BASE}/images/9-modules-course-mockup--starter-kit-.jpeg`,
  contentFoundations: `${BLOB_BASE}/images/3-module-course-mockup.jpeg`,
  influencersCode: `${BLOB_BASE}/images/the-influencer-s-code-mockup--book-cover-.jpeg`,
  taxGuide: `${BLOB_BASE}/images/tax-guide-mockup.jpeg`,
  nicheFinder: `${BLOB_BASE}/images/niche-workbook-mockup.jpeg`,
  paidsWorkbook: `${BLOB_BASE}/images/paids-mockup.jpeg`,
  contentpreneurBook: `${BLOB_BASE}/images/the-influencer-s-code-mockup--book-cover-.jpeg`,
  proBundle: `${BLOB_BASE}/images/branding-starter-kit-copy.jpeg`,
};

export const PRODUCTS: Record<string, Product> = {
  'starter-kit': {
    key: 'starter-kit',
    name: '9-Module Personal Branding Course',
    shortName: 'Starter Kit',
    description: 'Complete system to build and monetize your personal brand with 9 video modules, workbooks, and the NoChill Tool Stack.',
    priceCents: 69900, // R699.00
    icon: '🚀',
    imageUrl: PRODUCT_IMAGES.starterKit,
    color: 'amber',
    category: 'course',
    features: [
      'Introduction Video',
      'Module 1: What is a Personal Brand',
      'Module 2: Blueprint to Build a Personal Brand',
      'Module 3: The 3Cs Framework - Mindset',
      'Module 4: SWOT Analysis',
      'Module 5: 3Es Content Idea Formula',
      'Module 6: Understand Social Media Platforms',
      'Module 7: Community Building',
      'Module 8: PAIDS Framework',
      'Bonus Module 9: Formula to Create Online Asset',
      'Niche Finder Workbook (PDF)',
      'PAIDS Framework Workbook (PDF)',
      'NoChill Tool Stack Access',
    ],
    accessLink: '/members/starter-kit',
    purchaseLink: '/contentpreneur-starter-kit',
  },
  'influencers-code': {
    key: 'influencers-code',
    name: "The Influencer's Code",
    shortName: "Influencer's Code",
    description: 'Bestselling eBook with 6,000+ copies sold. 14 chapters on content monetization, the 3Es Formula, and PAIDS Method.',
    priceCents: 24900, // R249.00
    originalPriceCents: 49900, // R499.00
    icon: '📖',
    imageUrl: PRODUCT_IMAGES.influencersCode,
    color: 'purple',
    category: 'ebook',
    features: [
      '14 Chapters on Monetization',
      'The 3Es Formula',
      'Algorithm Mastery',
      'PAIDS Monetization Method',
      'DARES Scale System',
    ],
    accessLink: '/members/influencers-code',
    purchaseLink: '/checkout/influencers-code',
  },
  'content-foundations': {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    shortName: 'Content Foundations',
    description: 'Master content creation fundamentals with 3 comprehensive video modules.',
    priceCents: 39900, // R399.00
    icon: '🎯',
    imageUrl: PRODUCT_IMAGES.contentFoundations,
    color: 'blue',
    category: 'course',
    features: [
      'Module 1: Self Reflection',
      'Module 2: SWOT Analysis',
      'Module 3: Value Alignment',
    ],
    accessLink: '/members/content-foundations',
    purchaseLink: '/checkout/content-foundations',
  },
  'tax-guide': {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    shortName: 'Tax Guide',
    description: 'Essential tax strategies and legal protection for South African content creators.',
    priceCents: 44900, // R449.00
    icon: '📋',
    imageUrl: PRODUCT_IMAGES.taxGuide,
    color: 'slate',
    category: 'guide',
    features: [
      'Tax Deductions for Creators',
      'Business Structure Guidance',
      'Quarterly Tax Planning',
      'International Income (SA Laws)',
      'Legal Protection Essentials',
    ],
    accessLink: '/members/tax-guide',
    purchaseLink: '/checkout/tax-guide',
  },
  'niche-finder': {
    key: 'niche-finder',
    name: 'Niche Finder Workbook',
    shortName: 'Niche Finder',
    description: 'Step-by-step PDF workbook to discover your profitable content niche in 90 minutes.',
    priceCents: 19900, // R199.00
    icon: '🎯',
    imageUrl: PRODUCT_IMAGES.nicheFinder,
    color: 'green',
    category: 'workbook',
    features: [
      'Niche Discovery Exercises',
      'Market Research Framework',
      'Audience Profiling',
    ],
    accessLink: '/members/niche-finder',
    purchaseLink: '/checkout/niche-finder',
  },
  'paids-workbook': {
    key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    shortName: 'PAIDS Workbook',
    description: 'Master the PAIDS monetization framework to build 5 income streams.',
    priceCents: 19900, // R199.00
    icon: '💰',
    imageUrl: PRODUCT_IMAGES.paidsWorkbook,
    color: 'emerald',
    category: 'workbook',
    features: [
      'Products Income Stream',
      'Ads Income Stream',
      'Influence Income Stream',
      'Digital Assets Stream',
      'Services Income Stream',
    ],
    accessLink: '/members/paids-workbook',
    purchaseLink: '/checkout/paids-workbook',
  },
  'contentpreneur-pro': {
    key: 'contentpreneur-pro',
    name: 'Contentpreneur Pro Bundle',
    shortName: 'Pro Bundle',
    description: 'The complete system: Everything you need from mindset to monetization. Save R400!',
    priceCents: 129900, // R1,299.00
    originalPriceCents: 169900, // R1,699.00
    icon: '👑',
    imageUrl: PRODUCT_IMAGES.proBundle,
    color: 'gold',
    category: 'bundle',
    features: [
      '9-Module Personal Branding Course',
      'Niche Finder Workbook',
      'PAIDS Framework Workbook',
      "The Influencer's Code eBook",
      'Tax Guide for Contentpreneurs',
      'Content Foundations Course',
      'NoChill Tool Stack Access',
    ],
    accessLink: '/members',
    purchaseLink: '/checkout/contentpreneur-pro',
  },
  'coaching-session': {
    key: 'coaching-session',
    name: '1:1 Strategy Call',
    shortName: 'Strategy Call',
    description: '60-minute personalized strategy session with Mr. NoChill. From bathroom floors to boardrooms - get the same frameworks that built 3M+ followers.',
    priceCents: 499900, // R4,999.00
    originalPriceCents: 999900, // R9,999.00
    icon: '📞',
    color: 'rose',
    category: 'service',
    features: [
      '60-Minute Video Call',
      '90-Day Action Plan',
      'Session Recording',
      '7-Day Email Follow-up',
    ],
    accessLink: '/consultation',
    purchaseLink: '/products/coaching',
  },
  'contentpreneur-book': {
    key: 'contentpreneur-book',
    name: 'Contentpreneur Guide (eBook + Print)',
    shortName: 'Contentpreneur Book',
    description: 'The definitive guide to building a profitable content business. Available as eBook and physical book with free SA shipping.',
    priceCents: 29900, // R299.00
    originalPriceCents: 49900, // R499.00
    icon: '📚',
    imageUrl: PRODUCT_IMAGES.contentpreneurBook,
    color: 'indigo',
    category: 'ebook',
    features: [
      '10 Comprehensive Chapters',
      'eBook + Physical Book',
      'Free SA Shipping',
      'Lifetime Updates',
    ],
    accessLink: '/members/contentpreneur-book',
    purchaseLink: '/checkout/contentpreneur-book',
  },
  'content-arsenal': {
    key: 'content-arsenal',
    name: 'Content Arsenal Expansion Pack',
    shortName: 'Content Arsenal',
    description: '100+ templates, swipe files, and tools to streamline your content creation workflow.',
    priceCents: 39900, // R399.00
    originalPriceCents: 89900, // R899.00
    icon: '🛠️',
    imageUrl: PRODUCT_IMAGES.starterKit,
    color: 'cyan',
    category: 'bundle',
    features: [
      '100+ Templates',
      'Content Calendar Templates',
      'Caption Swipe Files',
      'Analytics Dashboards',
      'Lifetime Access',
    ],
    accessLink: '/members/content-arsenal',
    purchaseLink: '/checkout/content-arsenal',
  },
  'contentpreneur-book-ebook': {
    key: 'contentpreneur-book-ebook',
    name: 'Contentpreneur Guide (eBook)',
    shortName: 'Contentpreneur eBook',
    description: 'The definitive digital guide to building a profitable content business. Instant download.',
    priceCents: 24900, // R249.00
    originalPriceCents: 29900, // R299.00
    icon: '📱',
    imageUrl: PRODUCT_IMAGES.contentpreneurBook,
    color: 'indigo',
    category: 'ebook',
    features: [
      '10 Comprehensive Chapters',
      'Instant PDF Download',
      'Lifetime Updates',
      'Mobile-Friendly Format',
    ],
    accessLink: '/members/contentpreneur-book',
    purchaseLink: '/checkout/contentpreneur-book-ebook',
    isPreOrder: true,
    preOrderDate: 'Coming April 2026',
  },
  'contentpreneur-book-hardcopy': {
    key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur (Ebook + Hardcopy)',
    shortName: 'Contentpreneur Book',
    description: 'Physical book delivered to your door + digital eBook copy. Free shipping within South Africa.',
    priceCents: 39900, // R399.00
    originalPriceCents: 49900, // R499.00
    icon: '📚',
    imageUrl: PRODUCT_IMAGES.contentpreneurBook,
    color: 'indigo',
    category: 'ebook',
    features: [
      '10 Comprehensive Chapters',
      'Physical Hardcover Book',
      'eBook Included',
      'Free SA Shipping',
      'Author-Signed Copy',
    ],
    accessLink: '/members/contentpreneur-book',
    purchaseLink: '/checkout/contentpreneur-book-hardcopy',
    isPreOrder: true,
    preOrderDate: 'Coming April 2026',
  },
};

// Bundle configurations - what products get unlocked when purchasing
export const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': [
    'starter-kit',
    'content-foundations',
    'influencers-code',
    'tax-guide',
    'niche-finder',
    'paids-workbook',
  ],
};

// Order bump configurations for checkout pages (discounted prices when purchased together)
// These appear as checkboxes on the checkout page
export const ORDER_BUMPS: Record<string, Array<{
  key: string;
  discountedPrice: number;
  savings: string;
  headline?: string;
  description?: string;
}>> = {
  'starter-kit': [
    {
      key: 'influencers-code',
      discountedPrice: 14900, // R149
      savings: '40% OFF',
      headline: "Add The Influencer's Code",
      description: 'The bestselling eBook with 14 chapters on content monetization',
    },
    {
      key: 'tax-guide',
      discountedPrice: 29900, // R299
      savings: '33% OFF',
      headline: 'Add Tax Guide for Contentpreneurs',
      description: 'Essential tax strategies for South African creators',
    },
  ],
  'influencers-code': [
    {
      key: 'paids-workbook',
      discountedPrice: 14900, // R149
      savings: '25% OFF',
      headline: 'Add PAIDS Framework Workbook',
      description: 'Turn the concepts into action with this implementation guide',
    },
    {
      key: 'niche-finder',
      discountedPrice: 14900, // R149
      savings: '25% OFF',
      headline: 'Add Niche Finder Workbook',
      description: 'Discover your profitable niche in 90 minutes',
    },
  ],
  'niche-finder': [
    {
      key: 'paids-workbook',
      discountedPrice: 14900, // R149
      savings: '25% OFF',
      headline: 'Add PAIDS Framework',
      description: 'Found your niche? Now monetize it with 5 income streams',
    },
    {
      key: 'influencers-code',
      discountedPrice: 14900, // R149
      savings: '40% OFF',
      headline: "Add The Influencer's Code",
      description: 'The complete guide to content monetization',
    },
  ],
  'paids-workbook': [
    {
      key: 'niche-finder',
      discountedPrice: 14900, // R149
      savings: '25% OFF',
      headline: 'Add Niche Finder',
      description: 'Perfect pair - find your niche then monetize it',
    },
    {
      key: 'influencers-code',
      discountedPrice: 14900, // R149
      savings: '40% OFF',
      headline: "Add The Influencer's Code",
      description: '14 chapters on building influence and income',
    },
  ],
  'tax-guide': [
    {
      key: 'influencers-code',
      discountedPrice: 14900, // R149
      savings: '40% OFF',
      headline: "Add The Influencer's Code",
      description: 'Learn how to maximize your creator income',
    },
    {
      key: 'content-arsenal',
      discountedPrice: 29900, // R299
      savings: '25% OFF',
      headline: 'Add Content Arsenal',
      description: '100+ templates to streamline your workflow',
    },
  ],
  'content-foundations': [
    {
      key: 'starter-kit',
      discountedPrice: 34900, // R349
      savings: 'Save R350',
      headline: 'Upgrade to Full Starter Kit',
      description: 'Get all 9 modules + bonus workbooks + tool stack',
    },
  ],
  'contentpreneur-book-ebook': [
    {
      key: 'content-arsenal',
      discountedPrice: 29900, // R299
      savings: '25% OFF',
      headline: 'Add Content Arsenal',
      description: '100+ templates to implement what you learn',
    },
  ],
  'contentpreneur-book-hardcopy': [
    {
      key: 'content-arsenal',
      discountedPrice: 29900, // R299
      savings: '25% OFF',
      headline: 'Add Content Arsenal',
      description: '100+ templates to implement what you learn',
    },
  ],
  'content-arsenal': [
    {
      key: 'influencers-code',
      discountedPrice: 14900, // R149
      savings: '40% OFF',
      headline: "Add The Influencer's Code",
      description: 'The strategy behind the templates',
    },
    {
      key: 'starter-kit',
      discountedPrice: 49900, // R499
      savings: '29% OFF',
      headline: 'Add Starter Kit Course',
      description: 'Complete video training to use these tools',
    },
  ],
};

// Post-purchase upsells (shown on success page)
export const POST_PURCHASE_UPSELLS: Record<string, Array<{
  key: string;
  headline: string;
  subheadline: string;
  discountedPrice: number;
  originalPrice: number;
  savings: string;
  urgency?: string;
}>> = {
  'starter-kit': [
    {
      key: 'influencers-code',
      headline: "Special Offer: The Influencer's Code",
      subheadline: 'The perfect companion to your course - 14 chapters on monetization',
      discountedPrice: 14900, // R149
      originalPrice: 24900, // R249
      savings: '40% OFF',
      urgency: 'One-time offer for new students',
    },
  ],
  'influencers-code': [
    {
      key: 'starter-kit',
      headline: 'Upgrade: Get the Full Video Course',
      subheadline: 'Put what you learned into action with 9 video modules',
      discountedPrice: 49900, // R499
      originalPrice: 69900, // R699
      savings: '29% OFF',
      urgency: 'Reader-only discount',
    },
  ],
  'niche-finder': [
    {
      key: 'starter-kit',
      headline: 'Ready for the Full System?',
      subheadline: 'Get the complete course to build your personal brand',
      discountedPrice: 49900, // R499
      originalPrice: 69900, // R699
      savings: '29% OFF',
    },
  ],
  'paids-workbook': [
    {
      key: 'starter-kit',
      headline: 'Ready for the Full System?',
      subheadline: 'Get the complete course to build your personal brand',
      discountedPrice: 49900, // R499
      originalPrice: 69900, // R699
      savings: '29% OFF',
    },
  ],
  'tax-guide': [
    {
      key: 'starter-kit',
      headline: 'Now Build Your Income',
      subheadline: 'The complete system to generate income worth taxing',
      discountedPrice: 49900, // R499
      originalPrice: 69900, // R699
      savings: '29% OFF',
    },
  ],
};

// Upgrade paths
export const UPGRADE_PATHS: Record<string, { to: string; price: number; savings: number }> = {
  'content-foundations': { to: 'starter-kit', price: 34900, savings: 35000 }, // R349 upgrade, save R350
};

// Tool Stack with affiliate links - Complete NoChill Contentpreneur Tool Stack
export const TOOL_STACK = {
  thinking: {
    title: 'POWER 1 — THINKING & STRATEGY',
    subtitle: 'Where ideas, clarity and decisions come from',
    icon: '🧠',
    tools: [
      { name: 'ChatGPT', role: 'AI Brain', desc: 'Idea generation, script writing, caption creation', icon: '🤖', link: 'https://chat.openai.com', pricing: 'Free | $20/mo' },
      { name: 'Claude', role: 'Writing Partner', desc: 'Long-form content, deep thinking, nuanced writing', icon: '✍️', link: 'https://claude.ai', pricing: 'Free | $20/mo' },
      { name: 'Perplexity', role: 'Research Engine', desc: 'Fast, accurate data gathering with sources', icon: '🔍', link: 'https://perplexity.ai', pricing: 'Free | $20/mo' },
      { name: 'Notion', role: 'Command Center', desc: 'Content calendar, products, clients - all organized', icon: '📋', link: 'https://notion.so', pricing: 'Free | $10/mo' },
    ],
  },
  creation: {
    title: 'POWER 2 — CONTENT CREATION',
    subtitle: 'How I produce content at scale',
    icon: '🎬',
    tools: [
      { name: 'CapCut', role: 'Video Editor', desc: 'Fast mobile & desktop editing with auto-captions', icon: '🎬', link: 'https://capcut.com', pricing: 'Free | $9.99/mo' },
      { name: 'Canva', role: 'Design Studio', desc: 'Graphics, thumbnails, templates, brand kit', icon: '🎨', link: 'https://canva.com', pricing: 'Free | $12.99/mo' },
      { name: 'Descript', role: 'Audio/Video Magic', desc: 'Edit videos by editing text, Studio Sound', icon: '🎙️', link: 'https://descript.com', pricing: 'Free | $12/mo' },
      { name: 'Riverside', role: 'Recording Studio', desc: 'Studio-quality remote recording', icon: '🎧', link: 'https://riverside.fm', pricing: 'Free | $15/mo' },
    ],
  },
  automation: {
    title: 'POWER 3 — AUTOMATION & WORKFLOW',
    subtitle: 'Systems that save 20+ hours per week',
    icon: '⚡',
    tools: [
      { name: 'Make.com', role: 'Automation Hub', desc: 'Connect apps, automate complex workflows', icon: '🔧', link: 'https://make.com', pricing: 'Free | $9/mo' },
      { name: 'Zapier', role: 'Workflow Builder', desc: 'No-code automation for simple tasks', icon: '⚡', link: 'https://zapier.com', pricing: 'Free | $20/mo' },
      { name: 'Buffer', role: 'Social Scheduling', desc: 'Post everywhere from one dashboard', icon: '📤', link: 'https://buffer.com', pricing: 'Free | $6/mo' },
      { name: 'ManyChat', role: 'DM Automation', desc: 'Convert followers to customers via DMs', icon: '💬', link: 'https://manychat.com', pricing: 'Free | $15/mo' },
    ],
  },
  monetization: {
    title: 'POWER 4 — MONETIZATION & SALES',
    subtitle: 'Where followers become income',
    icon: '💰',
    tools: [
      { name: 'Gumroad', role: 'Digital Products', desc: 'Sell ebooks, courses, templates instantly', icon: '💰', link: 'https://gumroad.com', pricing: 'Free + 10% | $10/mo + 3.5%' },
      { name: 'Paystack', role: 'Payments', desc: 'Accept African payments seamlessly', icon: '💳', link: 'https://paystack.com', pricing: '1.5% + fees' },
      { name: 'ConvertKit', role: 'Email Marketing', desc: 'Build and monetize your email list', icon: '📧', link: 'https://convertkit.com', pricing: 'Free | $9/mo' },
      { name: 'Calendly', role: 'Booking System', desc: 'Automate consultation scheduling', icon: '📆', link: 'https://calendly.com', pricing: 'Free | $8/mo' },
    ],
  },
};

// Extended Tool Stack with additional recommendations
export const EXTENDED_TOOLS = {
  videoEditing: {
    title: 'Video Editing Tools',
    beginner: [
      { name: 'InShot', desc: 'Simple mobile editing', pricing: 'Free | $3/mo', link: 'https://inshot.com' },
      { name: 'VLLO', desc: 'Great filters & effects', pricing: 'Free | $6/mo', link: 'https://vllo.io' },
    ],
    intermediate: [
      { name: 'Filmora', desc: 'User-friendly desktop editor', pricing: '$50/year', link: 'https://filmora.wondershare.com' },
      { name: 'DaVinci Resolve', desc: 'Professional color grading', pricing: 'FREE', link: 'https://blackmagicdesign.com/products/davinciresolve' },
    ],
    advanced: [
      { name: 'Adobe Premiere Pro', desc: 'Industry standard editing', pricing: '$22.99/mo', link: 'https://adobe.com/premiere' },
      { name: 'After Effects', desc: 'Motion graphics & animation', pricing: '$22.99/mo', link: 'https://adobe.com/aftereffects' },
    ],
  },
  stockResources: {
    title: 'Stock Photos & Videos',
    free: [
      { name: 'Unsplash', desc: 'High-quality stock photos', link: 'https://unsplash.com' },
      { name: 'Pexels', desc: 'Free photos & videos', link: 'https://pexels.com' },
      { name: 'Pixabay', desc: 'Images, videos, music', link: 'https://pixabay.com' },
    ],
    paid: [
      { name: 'Envato Elements', desc: 'Unlimited downloads', pricing: '$16.50/mo', link: 'https://elements.envato.com' },
      { name: 'Storyblocks', desc: 'Unlimited video stock', pricing: '$25/mo', link: 'https://storyblocks.com' },
    ],
  },
};

// Helper functions
export function getProductIcon(key: string): string {
  return PRODUCTS[key]?.icon || '📦';
}

export function getProductName(key: string): string {
  return PRODUCTS[key]?.name || key;
}

export function getProductShortName(key: string): string {
  return PRODUCTS[key]?.shortName || key;
}

export function formatPrice(cents: number): string {
  return `R${(cents / 100).toFixed(0)}`;
}

export function getProductsFromBundle(key: string): string[] {
  const products = [key];
  if (PRODUCT_BUNDLES[key]) {
    PRODUCT_BUNDLES[key].forEach(p => {
      if (!products.includes(p)) products.push(p);
      // Recursively add nested bundles
      if (PRODUCT_BUNDLES[p]) {
        PRODUCT_BUNDLES[p].forEach(nested => {
          if (!products.includes(nested)) products.push(nested);
        });
      }
    });
  }
  return products;
}
