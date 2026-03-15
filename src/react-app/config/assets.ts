/**
 * Central configuration for all media assets
 * All files are stored in Vercel Blob Storage
 *
 * Last synced with admin uploads: 2026-03-13
 */

const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

// ============================================
// PDF DOCUMENTS (All books from admin uploads)
// ============================================
export const DOCUMENTS = {
  // Workbooks
  nicheFinderWorkbook: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf`,
  paidsFrameworkWorkbook: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf`,

  // Guides
  taxGuide: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf`,

  // eBooks
  influencersCode: `${BLOB_BASE}/books/the-influencer-s-code---cracking-the-secrets-of-personal-branding-and-influence-in-the-digital-age-2WYoudRZpZ5DzSn9rSIncT2QJ7RGZp.pdf`,
} as const;

// ============================================
// PRODUCT MOCKUPS & IMAGES (All images from admin uploads)
// ============================================
export const IMAGES = {
  // Course Mockups
  contentFoundationsMockup: `${BLOB_BASE}/images/3-module-course-mockup.jpeg`,
  starterKitCourseMockup: `${BLOB_BASE}/images/9-modules-course-mockup--starter-kit-.jpeg`,
  brandingStarterKit: `${BLOB_BASE}/images/branding-starter-kit-copy.jpeg`,

  // Workbook Mockups
  nicheWorkbookMockup: `${BLOB_BASE}/images/niche-workbook-mockup.jpeg`,
  paidsWorkbookMockup: `${BLOB_BASE}/images/paids-mockup.jpeg`,
  taxGuideMockup: `${BLOB_BASE}/images/tax-guide-mockup.jpeg`,

  // Book Mockups
  influencersCodeMockup: `${BLOB_BASE}/images/the-influencer-s-code-mockup--book-cover-.jpeg`,
  contentpreneurBookMockup: `${BLOB_BASE}/images/the-influencer-s-code-mockup--book-cover-.jpeg`,

  // Hero/Profile Images
  heroImage: `${BLOB_BASE}/images/unnamed.jpg`,
  vusiPhoto: `${BLOB_BASE}/images/img-2566.jpg`,
  aboutPhoto: `${BLOB_BASE}/images/unnamed.jpg`,
} as const;

// ============================================
// FEATURED VIDEOS (Testimonials & Events)
// ============================================
export const VIDEOS = {
  // META Event Speaking Video (June 2025)
  metaEvent: `${BLOB_BASE}/videos/nochill-x-meta---28-june-2025-v2.mp4`,

  // Testimonials
  testimonials: `${BLOB_BASE}/videos/nochill---testimonials-1CG5gB8Tc5df4hyRKg4FFvbVvjpG1B.mp4`,

  // 3Es Content Formula (Standalone video)
  threesFormula: `${BLOB_BASE}/videos/nochill---3-e-s-x6R3hNsQSn4A0xxctzbcdzdVSQYXUT.mp4`,
} as const;

// ============================================
// COURSE VIDEOS - 9 Module Personal Branding Course (Starter Kit)
// ============================================
export const COURSE_VIDEOS = {
  starterKit: [
    {
      id: 0,
      label: 'INTRODUCTION',
      title: 'Welcome to Your Personal Branding Journey',
      description: 'Welcome to your personal branding journey. Set the foundation for your transformation from content creator to contentpreneur.',
      duration: '1:19',
      videoUrl: `${BLOB_BASE}/videos/introduction-vwD67IgXgiDQTgl3M61OxROSK5eN9Z.mp4`,
    },
    {
      id: 1,
      label: 'MODULE 1',
      title: 'What is a Personal Brand',
      description: "Understand what personal branding really means and why it's the most powerful asset you can build in the digital age.",
      duration: '1:42',
      videoUrl: `${BLOB_BASE}/videos/1.-what-is-a-personal-brand-JzfK1BwI9SNuAKFmztW0ivJOkZZzHv.mp4`,
    },
    {
      id: 2,
      label: 'MODULE 2',
      title: 'A Blueprint to Build a Personal Brand',
      description: 'Get the step-by-step framework to build your personal brand from scratch. This is the exact blueprint used to build a 3M+ following.',
      duration: '2:26',
      videoUrl: `${BLOB_BASE}/videos/2.-a-blueprint-to-build-a-personal-brand-NlDzGRu7DMjntxzEf58tPSmj6pW2ye.mp4`,
    },
    {
      id: 3,
      label: 'MODULE 3',
      title: 'The 3Cs - Mindset',
      description: 'Master the psychological foundations required for success: Confidence, Consistency, and Courage.',
      duration: '4:16',
      videoUrl: `${BLOB_BASE}/videos/3.-the-3cs-framework-YLQXELu1jbdELfqZRG02sqULJIklC8.mp4`,
    },
    {
      id: 4,
      label: 'MODULE 4',
      title: 'SWOT Analysis',
      description: 'Identify your Strengths, Weaknesses, Opportunities, and Threats to position yourself strategically in your niche.',
      duration: '9:31',
      videoUrl: `${BLOB_BASE}/videos/4.-swot-analysis-ejnI1OENvE41I84WrRRbkPV4q2OWjA.mp4`,
    },
    {
      id: 5,
      label: 'MODULE 5',
      title: '3Es Content Idea Formula',
      description: 'Learn the proven formula for creating content that Educates, Entertains, and Engages your audience consistently.',
      duration: '7:10',
      videoUrl: `${BLOB_BASE}/videos/3es-content-idea-formula-SPasaQiEa3MHy81NSyOsSdg9RriA3l.mp4`,
    },
    {
      id: 6,
      label: 'MODULE 6',
      title: 'Understand Social Media Platforms',
      description: "Master each platform's unique algorithm, audience, and content strategy for maximum growth and monetization.",
      duration: '4:09',
      videoUrl: `${BLOB_BASE}/videos/5.-understand-social-media-platforms-0KJncVlmNj90xWRG3ctg5J0MJmfQsd.mp4`,
    },
    {
      id: 7,
      label: 'MODULE 7',
      title: 'Community Building',
      description: 'Build a loyal community around your personal brand that supports, engages, and buys from you.',
      duration: '6:32',
      videoUrl: `${BLOB_BASE}/videos/6.-community-building-u9d7U9nYMB0S9H9HkzSe5xeXgOO7N2.mp4`,
    },
    {
      id: 8,
      label: 'MODULE 8',
      title: 'PAIDS Framework',
      description: 'The exact 5-stream income system: Products, Ads/Affiliates, Information, Deals, and Services.',
      duration: '4:51',
      videoUrl: `${BLOB_BASE}/videos/7.-paids-framework-Ummp8NUrd0GHkqHrS1AEWTPu2bPaPK.mp4`,
    },
    {
      id: 9,
      label: 'BONUS - MODULE 9',
      title: 'Formula to Create Online Asset',
      description: 'Build assets that generate income 24/7 — email lists, digital products, automated systems, and owned platforms.',
      duration: '3:20',
      videoUrl: `${BLOB_BASE}/videos/9.-formula-to-create-online-asset-KJZqSed1vBCC01ADDdM9vwpw6hQZiJ.mp4`,
      isBonus: true,
    },
  ],
  contentFoundations: [
    {
      id: 1,
      label: 'MODULE 1',
      title: 'Self Reflection',
      description: 'Discover your authentic voice and unique strengths through guided self-reflection exercises. Understand who you truly are as a creator.',
      duration: '15:00',
      videoUrl: `${BLOB_BASE}/videos/lesson-1---self-reflection-U2iJQ229HpT5FUwrV7XM6Xgtivu68N.mp4`,
    },
    {
      id: 2,
      label: 'MODULE 2',
      title: 'SWOT Analysis for Content Creation',
      description: 'Identify your Strengths, Weaknesses, Opportunities & Threats as a creator. Position yourself strategically in your niche.',
      duration: '12:00',
      videoUrl: `${BLOB_BASE}/videos/lesson-2---swot-analysis-for-content-creation-VpLMPP3GoZdI0gHw5tu9MJU9sC6ZpL.mp4`,
    },
    {
      id: 3,
      label: 'MODULE 3',
      title: 'Value Alignment',
      description: 'Build content that reflects your true values and resonates deeply with your ideal audience. Create with purpose and authenticity.',
      duration: '10:00',
      videoUrl: `${BLOB_BASE}/videos/lesson-3--value-alignment-8ttvnPAxtUK7G9xBIQpyTNuVb7aZxH.mp4`,
    },
  ],
} as const;

// ============================================
// COMPREHENSIVE PRODUCT-TO-ASSETS MAPPING
// Maps each product to all its associated files, images, and videos
// ============================================
export const PRODUCT_ASSETS: Record<string, {
  name: string;
  mockupImage?: string;
  files: Array<{ name: string; url: string; description?: string; type: 'pdf' | 'video' }>;
  course?: typeof COURSE_VIDEOS.starterKit;
  isPreOrder?: boolean;
}> = {
  'niche-finder': {
    name: 'Niche Finder Workbook',
    mockupImage: IMAGES.nicheWorkbookMockup,
    files: [
      {
        name: 'Niche Finder Workbook.pdf',
        url: DOCUMENTS.nicheFinderWorkbook,
        description: '6 guided exercises to find your profitable niche',
        type: 'pdf',
      },
    ],
  },
  'paids-workbook': {
    name: 'PAIDS Framework Workbook',
    mockupImage: IMAGES.paidsWorkbookMockup,
    files: [
      {
        name: 'PAIDS Framework Workbook.pdf',
        url: DOCUMENTS.paidsFrameworkWorkbook,
        description: 'Complete implementation guide for 5 income streams',
        type: 'pdf',
      },
    ],
  },
  'tax-guide': {
    name: 'Tax Guide for Contentpreneurs',
    mockupImage: IMAGES.taxGuideMockup,
    files: [
      {
        name: 'Tax Guide for Contentpreneurs.pdf',
        url: DOCUMENTS.taxGuide,
        description: 'Complete SARS compliance guide with VDP process',
        type: 'pdf',
      },
    ],
  },
  'influencers-code': {
    name: "The Influencer's Code",
    mockupImage: IMAGES.influencersCodeMockup,
    files: [
      {
        name: "The Influencer's Code - Complete eBook.pdf",
        url: DOCUMENTS.influencersCode,
        description: 'Full 14-chapter guide to personal branding and influence',
        type: 'pdf',
      },
    ],
  },
  'starter-kit': {
    name: '9-Module Personal Branding Course',
    mockupImage: IMAGES.starterKitCourseMockup,
    files: [
      {
        name: 'PAIDS Framework Workbook.pdf',
        url: DOCUMENTS.paidsFrameworkWorkbook,
        description: 'Master the PAIDS monetization framework',
        type: 'pdf',
      },
      {
        name: 'Niche Finder Workbook.pdf',
        url: DOCUMENTS.nicheFinderWorkbook,
        description: 'Discover your profitable content niche',
        type: 'pdf',
      },
    ],
    course: COURSE_VIDEOS.starterKit,
  },
  'content-foundations': {
    name: 'Content Foundations Course',
    mockupImage: IMAGES.contentFoundationsMockup,
    files: [],
    course: COURSE_VIDEOS.contentFoundations,
  },
  'contentpreneur-pro': {
    name: 'Contentpreneur Pro Bundle',
    mockupImage: IMAGES.brandingStarterKit,
    files: [
      {
        name: "The Influencer's Code - Complete eBook.pdf",
        url: DOCUMENTS.influencersCode,
        description: '14-chapter guide to personal branding',
        type: 'pdf',
      },
      {
        name: 'Tax Guide for Contentpreneurs.pdf',
        url: DOCUMENTS.taxGuide,
        description: 'SARS compliance guide',
        type: 'pdf',
      },
      {
        name: 'PAIDS Framework Workbook.pdf',
        url: DOCUMENTS.paidsFrameworkWorkbook,
        description: '5 income streams framework',
        type: 'pdf',
      },
      {
        name: 'Niche Finder Workbook.pdf',
        url: DOCUMENTS.nicheFinderWorkbook,
        description: 'Find your profitable niche',
        type: 'pdf',
      },
    ],
    course: COURSE_VIDEOS.starterKit,
  },
  'contentpreneur-book-ebook': {
    name: 'Contentpreneur Guide (eBook)',
    mockupImage: IMAGES.contentpreneurBookMockup,
    files: [],
    isPreOrder: true,
  },
  'contentpreneur-book-hardcopy': {
    name: 'Contentpreneur Guide (Hardcopy + eBook)',
    mockupImage: IMAGES.contentpreneurBookMockup,
    files: [],
    isPreOrder: true,
  },
};

// Legacy export for backwards compatibility
export const PRODUCT_DOWNLOADS = PRODUCT_ASSETS;

// ============================================
// UPSELL CONFIGURATIONS
// Products to offer after purchase (post-purchase upsells)
// ============================================
export const POST_PURCHASE_UPSELLS: Record<string, Array<{
  productKey: string;
  headline: string;
  subheadline: string;
  discountedPrice: number;
  originalPrice: number;
  savings: string;
  urgency?: string;
}>> = {
  'starter-kit': [
    {
      productKey: 'influencers-code',
      headline: "Wait! Add The Influencer's Code",
      subheadline: 'The perfect companion to your Starter Kit - 14 chapters on monetizing your influence',
      discountedPrice: 1200,
      originalPrice: 1900,
      savings: '37% OFF',
      urgency: 'One-time offer - not available later',
    },
    {
      productKey: 'content-foundations',
      headline: 'Upgrade: Add Content Foundations',
      subheadline: '3 deep-dive video modules on building your content strategy',
      discountedPrice: 2500,
      originalPrice: 3700,
      savings: '32% OFF',
    },
  ],
  'influencers-code': [
    {
      productKey: 'starter-kit',
      headline: 'Complete Your Journey',
      subheadline: 'Get the full 9-module video course to implement what you learned',
      discountedPrice: 4700,
      originalPrice: 6700,
      savings: '30% OFF',
      urgency: 'Special reader discount',
    },
  ],
  'content-foundations': [
    {
      productKey: 'starter-kit',
      headline: 'Upgrade to the Full Course',
      subheadline: 'Get all 9 modules + bonus workbooks + tool stack access',
      discountedPrice: 3000,
      originalPrice: 6700,
      savings: '55% OFF (Upgrade Price)',
    },
  ],
  'tax-guide': [
    {
      productKey: 'influencers-code',
      headline: 'Ready to Make More Money to Tax?',
      subheadline: "Learn how to maximize your creator income with The Influencer's Code",
      discountedPrice: 1200,
      originalPrice: 1900,
      savings: '37% OFF',
    },
  ],
};

// ============================================
// EMAIL DELIVERY CONFIGURATION
// What files to include in order confirmation emails
// ============================================
export const EMAIL_DELIVERY_ASSETS: Record<string, {
  productName: string;
  downloadLinks: Array<{ name: string; url: string }>;
  accessLink: string;
  hasCourse: boolean;
  isPreOrder?: boolean;
}> = {
  'niche-finder': {
    productName: 'Niche Finder Workbook',
    downloadLinks: [
      { name: 'Download Niche Finder Workbook (PDF)', url: DOCUMENTS.nicheFinderWorkbook },
    ],
    accessLink: '/members/niche-finder',
    hasCourse: false,
  },
  'paids-workbook': {
    productName: 'PAIDS Framework Workbook',
    downloadLinks: [
      { name: 'Download PAIDS Workbook (PDF)', url: DOCUMENTS.paidsFrameworkWorkbook },
    ],
    accessLink: '/members/paids-workbook',
    hasCourse: false,
  },
  'tax-guide': {
    productName: 'Tax Guide for Contentpreneurs',
    downloadLinks: [
      { name: 'Download Tax Guide (PDF)', url: DOCUMENTS.taxGuide },
    ],
    accessLink: '/members/tax-guide',
    hasCourse: false,
  },
  'influencers-code': {
    productName: "The Influencer's Code",
    downloadLinks: [
      { name: "Download The Influencer's Code (PDF)", url: DOCUMENTS.influencersCode },
    ],
    accessLink: '/members/influencers-code',
    hasCourse: false,
  },
  'starter-kit': {
    productName: '9-Module Personal Branding Course',
    downloadLinks: [
      { name: 'Download PAIDS Workbook (PDF)', url: DOCUMENTS.paidsFrameworkWorkbook },
      { name: 'Download Niche Finder Workbook (PDF)', url: DOCUMENTS.nicheFinderWorkbook },
    ],
    accessLink: '/members/starter-kit',
    hasCourse: true,
  },
  'content-foundations': {
    productName: 'Content Foundations Course',
    downloadLinks: [],
    accessLink: '/members/content-foundations',
    hasCourse: true,
  },
  'contentpreneur-pro': {
    productName: 'Contentpreneur Pro Bundle',
    downloadLinks: [
      { name: "Download The Influencer's Code (PDF)", url: DOCUMENTS.influencersCode },
      { name: 'Download Tax Guide (PDF)', url: DOCUMENTS.taxGuide },
      { name: 'Download PAIDS Workbook (PDF)', url: DOCUMENTS.paidsFrameworkWorkbook },
      { name: 'Download Niche Finder Workbook (PDF)', url: DOCUMENTS.nicheFinderWorkbook },
    ],
    accessLink: '/members',
    hasCourse: true,
  },
  'contentpreneur-book-ebook': {
    productName: 'Contentpreneur Guide (eBook)',
    downloadLinks: [],
    accessLink: '/members/contentpreneur-book-ebook',
    hasCourse: false,
    isPreOrder: true,
  },
  'contentpreneur-book-hardcopy': {
    productName: 'Contentpreneur Guide (Hardcopy + eBook)',
    downloadLinks: [],
    accessLink: '/members/contentpreneur-book-hardcopy',
    hasCourse: false,
    isPreOrder: true,
  },
};

// Type exports
export type CourseModule = typeof COURSE_VIDEOS.starterKit[number];
export type ProductAsset = typeof PRODUCT_ASSETS[keyof typeof PRODUCT_ASSETS];
export type UpsellConfig = typeof POST_PURCHASE_UPSELLS[keyof typeof POST_PURCHASE_UPSELLS][number];
