/**
 * Central configuration for all media assets
 * All files are stored in Vercel Blob Storage
 */

const BLOB_BASE = 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com';

// ============================================
// PDF DOCUMENTS
// ============================================
export const DOCUMENTS = {
  // Free Lead Magnets
  nicheFinderWorkbook: `${BLOB_BASE}/books/niche-finder-workbook-zDf2eK4ewDWfKF4zKYePqOknzp2Bsz.pdf`,
  paidsFrameworkWorkbook: `${BLOB_BASE}/books/paids-framework-workbook-BJp7ZDOwewto1JEHOVczIRkJgsidyQ.pdf`,
  taxGuide: `${BLOB_BASE}/books/tax-for-contentpreneur-guide--3--u5txr7rnqYaoei36UoUIpiLNMB2pP8.pdf`,

  // Paid Products
  influencersCode: `${BLOB_BASE}/books/the-influencer-s-code---cracking-the-secrets-of-personal-branding-and-influence-in-the-digital-age-2WYoudRZpZ5DzSn9rSIncT2QJ7RGZp.pdf`,
} as const;

// ============================================
// PRODUCT MOCKUPS & IMAGES
// ============================================
export const IMAGES = {
  // Course Mockups
  contentFoundationsMockup: `${BLOB_BASE}/images/3-module-course-mockup.jpeg`,
  starterKitCourseMockup: `${BLOB_BASE}/images/9-modules-course-mockup--starter-kit-.jpeg`,

  // Workbook Mockups
  nicheWorkbookMockup: `${BLOB_BASE}/images/niche-workbook-mockup.jpeg`,
  paidsWorkbookMockup: `${BLOB_BASE}/images/paids-mockup.jpeg`,
  taxGuideMockup: `${BLOB_BASE}/images/tax-guide-mockup.jpeg`,

  // Book Mockups
  influencersCodeMockup: `${BLOB_BASE}/images/the-influencer-s-code-mockup--book-cover-.jpeg`,

  // Hero/Profile Images
  heroImage: 'https://019bb654-d68c-7f4b-bdd4-908a2a75512e.mochausercontent.com/unnamed.jpg',

  // Story/About Images
  vusiPhoto: `${BLOB_BASE}/images/img-2566.jpg`,
  aboutPhoto: `${BLOB_BASE}/images/unnamed.jpg`,
} as const;

// ============================================
// FEATURED VIDEOS
// ============================================
export const VIDEOS = {
  // META Event Speaking Video (June 2025)
  metaEvent: `${BLOB_BASE}/videos/nochill-x-meta---28-june-2025-v2-mOUwfO6QILpGKHA2JtXQkaLtSgQp8M.mp4`,
} as const;

// ============================================
// COURSE VIDEOS - 9 Module Personal Branding Course
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
} as const;

// ============================================
// PRODUCT DOWNLOADS - Mapping products to their files
// ============================================
export const PRODUCT_DOWNLOADS = {
  'niche-finder': {
    name: 'Niche Finder Workbook',
    files: [
      { name: 'Niche Finder Workbook.pdf', url: DOCUMENTS.nicheFinderWorkbook },
    ],
  },
  'paids-workbook': {
    name: 'PAIDS Framework Workbook',
    files: [
      { name: 'PAIDS Framework Workbook.pdf', url: DOCUMENTS.paidsFrameworkWorkbook },
    ],
  },
  'tax-guide': {
    name: 'Tax Guide for Contentpreneurs',
    files: [
      { name: 'Tax Guide for Contentpreneurs.pdf', url: DOCUMENTS.taxGuide },
    ],
  },
  'influencers-code': {
    name: "The Influencer's Code",
    files: [
      { name: "The Influencer's Code - Complete eBook.pdf", url: DOCUMENTS.influencersCode },
    ],
  },
  'starter-kit': {
    name: 'Contentpreneur Starter Kit',
    files: [
      { name: 'PAIDS Framework Workbook.pdf', url: DOCUMENTS.paidsFrameworkWorkbook },
      { name: 'Niche Finder Workbook.pdf', url: DOCUMENTS.nicheFinderWorkbook },
    ],
    course: COURSE_VIDEOS.starterKit,
  },
} as const;

// Type exports
export type CourseModule = typeof COURSE_VIDEOS.starterKit[number];
export type ProductDownload = typeof PRODUCT_DOWNLOADS[keyof typeof PRODUCT_DOWNLOADS];
