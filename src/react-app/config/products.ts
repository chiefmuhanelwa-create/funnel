// Centralized Product Configuration
// Single source of truth for all product data

export interface Product {
  key: string;
  name: string;
  shortName: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  icon: string; // Emoji icon
  color: string; // Tailwind color class
  features: string[];
  accessLink: string;
  purchaseLink: string;
  category: 'course' | 'ebook' | 'workbook' | 'guide' | 'bundle' | 'service';
}

export const PRODUCTS: Record<string, Product> = {
  'starter-kit': {
    key: 'starter-kit',
    name: '9-Module Personal Branding Course',
    shortName: 'Starter Kit',
    description: 'Complete system to build and monetize your personal brand with 9 video modules, workbooks, and the NoChill Tool Stack.',
    priceCents: 6700,
    icon: '🚀',
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
    description: 'Bestselling eBook with 6,000+ copies sold. 13 chapters on content monetization, the 3Es Formula, and PAIDS Method.',
    priceCents: 1900,
    originalPriceCents: 19700,
    icon: '📖',
    color: 'purple',
    category: 'ebook',
    features: [
      '13 Chapters on Monetization',
      'The 3Es Formula',
      'Algorithm Mastery',
      'PAIDS Monetization Method',
      'DARES Scale System',
    ],
    accessLink: '/members/influencers-code',
    purchaseLink: '/products/influencers-code',
  },
  'content-foundations': {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    shortName: 'Content Foundations',
    description: 'Master content creation fundamentals with 3 comprehensive video modules.',
    priceCents: 3700,
    icon: '🎯',
    color: 'blue',
    category: 'course',
    features: [
      'Module 1: Self Reflection',
      'Module 2: SWOT Analysis',
      'Module 3: Value Alignment',
    ],
    accessLink: '/members/content-foundations',
    purchaseLink: '/products/content-foundations',
  },
  'tax-guide': {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    shortName: 'Tax Guide',
    description: 'Essential tax strategies and legal protection for South African content creators.',
    priceCents: 4700,
    icon: '📋',
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
    purchaseLink: '/products/tax-guide',
  },
  'niche-finder': {
    key: 'niche-finder',
    name: 'Niche Finder Workbook',
    shortName: 'Niche Finder',
    description: 'Step-by-step PDF workbook to discover your profitable content niche in 90 minutes.',
    priceCents: 1500,
    icon: '🎯',
    color: 'green',
    category: 'workbook',
    features: [
      'Niche Discovery Exercises',
      'Market Research Framework',
      'Audience Profiling',
    ],
    accessLink: '/members/niche-finder',
    purchaseLink: '/products/niche-finder',
  },
  'paids-workbook': {
    key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    shortName: 'PAIDS Workbook',
    description: 'Master the PAIDS monetization framework to build 5 income streams.',
    priceCents: 1500,
    icon: '💰',
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
    purchaseLink: '/products/paids-workbook',
  },
  'contentpreneur-pro': {
    key: 'contentpreneur-pro',
    name: 'Contentpreneur Pro Bundle',
    shortName: 'Pro Bundle',
    description: 'The complete system: Everything you need from mindset to monetization. Save $23!',
    priceCents: 14700,
    originalPriceCents: 17000,
    icon: '👑',
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
    purchaseLink: '/products/contentpreneur-pro',
  },
  'strategy-call': {
    key: 'strategy-call',
    name: '1:1 Coaching Session',
    shortName: 'Coaching',
    description: '60-minute personalized strategy call with Mr. NoChill.',
    priceCents: 150000,
    icon: '📞',
    color: 'rose',
    category: 'service',
    features: [
      '60-Minute Video Call',
      'Personalized Strategy',
      '90-Day Roadmap',
      'Follow-up Email Support',
    ],
    accessLink: '/consultation',
    purchaseLink: '/products/coaching',
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

// Order bump configurations for checkout pages
export const ORDER_BUMPS: Record<string, Array<{ key: string; discountedPrice: number; savings: string }>> = {
  'starter-kit': [
    { key: 'influencers-code', discountedPrice: 1900, savings: '90% OFF' },
    { key: 'tax-guide', discountedPrice: 4700, savings: '' },
    { key: 'content-foundations', discountedPrice: 3700, savings: '' },
  ],
};

// Upgrade paths
export const UPGRADE_PATHS: Record<string, { to: string; price: number; savings: number }> = {
  'content-foundations': { to: 'starter-kit', price: 3000, savings: 3700 },
};

// Tool Stack with affiliate links
export const TOOL_STACK = {
  thinking: {
    title: 'POWER 1 — THINKING & STRATEGY',
    subtitle: 'Where ideas, clarity and decisions come from',
    icon: '🧠',
    tools: [
      { name: 'ChatGPT', role: 'Brain', desc: 'Ideas, scripts, captions, strategy', icon: '🤖', link: 'https://chat.openai.com' },
      { name: 'Claude', role: 'Writing Partner', desc: 'Long-form content, deep thinking', icon: '✍️', link: 'https://claude.ai' },
      { name: 'Perplexity', role: 'Research', desc: 'Fast accurate data gathering', icon: '🔍', link: 'https://perplexity.ai' },
      { name: 'Notion', role: 'Command Center', desc: 'Everything organized in one place', icon: '📋', link: 'https://notion.so' },
    ],
  },
  creation: {
    title: 'POWER 2 — CONTENT CREATION',
    subtitle: 'How I produce content at scale',
    icon: '🎬',
    tools: [
      { name: 'CapCut', role: 'Video Editor', desc: 'Fast mobile & desktop editing', icon: '🎬', link: 'https://capcut.com' },
      { name: 'Canva', role: 'Graphics', desc: 'Thumbnails, posts, stories', icon: '🎨', link: 'https://canva.com' },
      { name: 'Descript', role: 'Audio/Video', desc: 'Podcast editing, transcription', icon: '🎙️', link: 'https://descript.com' },
      { name: 'Riverside', role: 'Recording', desc: 'Studio-quality remote recording', icon: '🎧', link: 'https://riverside.fm' },
    ],
  },
  automation: {
    title: 'POWER 3 — AUTOMATION & WORKFLOW',
    subtitle: 'Systems that save 20+ hours per week',
    icon: '⚡',
    tools: [
      { name: 'Zapier', role: 'Automation', desc: 'Connect all your tools', icon: '⚡', link: 'https://zapier.com' },
      { name: 'Later', role: 'Scheduling', desc: 'Social media scheduling', icon: '📅', link: 'https://later.com' },
      { name: 'Buffer', role: 'Publishing', desc: 'Multi-platform posting', icon: '📤', link: 'https://buffer.com' },
      { name: 'Make', role: 'Workflows', desc: 'Advanced automation', icon: '🔧', link: 'https://make.com' },
    ],
  },
  monetization: {
    title: 'POWER 4 — MONETIZATION & SALES',
    subtitle: 'Where followers become income',
    icon: '💰',
    tools: [
      { name: 'Gumroad', role: 'Digital Sales', desc: 'Sell courses & ebooks', icon: '💰', link: 'https://gumroad.com' },
      { name: 'Paystack', role: 'Payments', desc: 'Accept African payments', icon: '💳', link: 'https://paystack.com' },
      { name: 'ConvertKit', role: 'Email', desc: 'Build & nurture your list', icon: '📧', link: 'https://convertkit.com' },
      { name: 'Calendly', role: 'Bookings', desc: 'Schedule calls & coaching', icon: '📆', link: 'https://calendly.com' },
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
  return `$${(cents / 100).toFixed(0)}`;
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
