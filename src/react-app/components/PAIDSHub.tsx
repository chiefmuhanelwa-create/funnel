import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Megaphone,
  BookOpen,
  Gift,
  Wrench,
  CheckCircle,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { IMAGES } from '../config/assets';

interface PAIDSHubProps {
  userOwnedProductKeys: string[];
}

interface PAIDSItem {
  title: string;
  promise: string;
  link?: string;
  accessLink?: string;
  productKey?: string;
  type: 'paid' | 'free';
  partOf?: string;
  image?: string;
}

const PAIDS_CATEGORIES = [
  {
    letter: 'P',
    title: 'PRODUCTS',
    description: 'Physical & digital items you sell',
    icon: Package,
    gradient: 'from-green-500 to-emerald-600',
    items: [
      {
        title: "The Influencer's Code eBook",
        promise: 'The complete blueprint to content monetization',
        link: '/products/influencers-code',
        accessLink: '/members/influencers-code',
        productKey: 'influencers-code',
        type: 'paid' as const,
        image: IMAGES.influencersCodeMockup,
      },
      {
        title: 'Niche Finder Workbook',
        promise: 'Discover your profitable niche in 90 minutes',
        link: '/products/niche-finder',
        accessLink: '/members/niche-finder',
        productKey: 'niche-finder',
        type: 'paid' as const,
        partOf: 'Included in Starter Kit',
        image: IMAGES.nicheWorkbookMockup,
      },
      {
        title: 'PAIDS Framework Workbook',
        promise: 'Build 5 income streams step by step',
        link: '/products/paids-workbook',
        accessLink: '/members/paids-workbook',
        productKey: 'paids-workbook',
        type: 'paid' as const,
        partOf: 'Included in Starter Kit',
        image: IMAGES.paidsWorkbookMockup,
      },
      {
        title: 'Tax Guide for Contentpreneurs',
        promise: 'SARS compliance guide for SA creators',
        link: '/products/tax-guide',
        accessLink: '/members/tax-guide',
        productKey: 'tax-guide',
        type: 'paid' as const,
        image: IMAGES.taxGuideMockup,
      },
    ],
    cta: { text: 'View All Products', link: '/contentpreneur-starter-kit' },
  },
  {
    letter: 'I',
    title: 'INFORMATION',
    description: 'Courses, books, educational content',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-600',
    items: [
      {
        title: 'Contentpreneur Starter Kit',
        promise: 'Complete 9-module course to build your brand',
        link: '/contentpreneur-starter-kit',
        accessLink: '/members/starter-kit',
        productKey: 'starter-kit',
        type: 'paid' as const,
        image: IMAGES.starterKitCourseMockup,
      },
      {
        title: 'Content Foundations Course',
        promise: 'Essential groundwork in 4 modules',
        link: '/products/content-foundations',
        accessLink: '/members/content-foundations',
        productKey: 'content-foundations',
        type: 'paid' as const,
        image: IMAGES.contentFoundationsMockup,
      },
    ],
    cta: { text: 'Get the Starter Kit', link: '/contentpreneur-starter-kit' },
  },
  {
    letter: 'S',
    title: 'SERVICES',
    description: 'Coaching, consulting, done-for-you work',
    icon: Wrench,
    gradient: 'from-purple-500 to-pink-600',
    items: [
      {
        title: '1:1 Coaching with Mr NoChill',
        promise: 'Direct strategy sessions with 3M+ experience',
        link: '/products/coaching',
        productKey: 'strategy-call',
        type: 'paid' as const,
      },
    ],
    cta: { text: 'Book a Call', link: '/products/coaching' },
  },
  {
    letter: 'A',
    title: 'ADS & AFFILIATES',
    description: 'Partnerships and sponsored content',
    icon: Megaphone,
    gradient: 'from-orange-500 to-red-600',
    items: [
      {
        title: 'The Contentpreneur Tool Stack',
        promise: 'Every tool I use to run my business',
        link: '#tool-stack',
        type: 'free' as const,
      },
      {
        title: 'AI Brain Stack',
        promise: 'The AI tools powering my content',
        link: '#tool-stack',
        type: 'free' as const,
      },
      {
        title: 'Creator Gear Guide',
        promise: 'Camera, mic, and equipment picks',
        link: '#tool-stack',
        type: 'free' as const,
      },
    ],
    cta: { text: 'Explore All Tools', link: '#tool-stack' },
  },
  {
    letter: 'D',
    title: 'DEALS',
    description: 'Templates, tools, calculators',
    icon: Gift,
    gradient: 'from-yellow-500 to-orange-500',
    items: [
      {
        title: 'Influencer Pricing Tool',
        promise: 'Calculate your rates instantly',
        link: '#tool-stack',
        type: 'free' as const,
      },
      {
        title: 'Media Kit Template',
        promise: 'Professional media kit in minutes',
        link: '#tool-stack',
        type: 'free' as const,
      },
    ],
    cta: { text: 'Get Free Tools', link: '#tool-stack' },
  },
];

export default function PAIDSHub({ userOwnedProductKeys }: PAIDSHubProps) {
  const isOwned = (productKey?: string) => {
    if (!productKey) return false;
    return userOwnedProductKeys.includes(productKey);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
            Your <span className="text-gradient-gold">Monetization Hub</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Everything you need to turn content into cash, organized by outcome
          </p>
        </motion.div>

        {/* PAIDS Categories */}
        <div className="space-y-12">
          {PAIDS_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.letter}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: catIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}
                >
                  <category.icon size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {category.letter} — {category.title}
                  </h3>
                  <p className="text-sm text-white/50">{category.description}</p>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {category.items.map((item, itemIndex) => {
                  const owned = isOwned(item.productKey);
                  const href = owned && item.accessLink ? item.accessLink : item.link;

                  return (
                    <motion.div
                      key={itemIndex}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative"
                    >
                      <Link
                        to={href || '#'}
                        className={`block p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 h-full ${
                          owned ? 'ring-2 ring-green-500/50' : ''
                        }`}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          {owned ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold shadow-lg">
                              <CheckCircle size={12} />
                              OWNED
                            </span>
                          ) : item.type === 'free' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold shadow-lg">
                              FREE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold shadow-lg">
                              <Lock size={12} />
                              PREMIUM
                            </span>
                          )}
                        </div>

                        {/* Product Image (if available) */}
                        {item.image && (
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden mb-4">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <h4 className="font-bold text-lg text-gray-900 pr-20 mb-2 hover:text-blue-900 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {item.promise}
                        </p>

                        {/* Part Of Tag */}
                        {item.partOf && !owned && (
                          <p className="text-xs font-semibold text-blue-600 mb-2">
                            {item.partOf}
                          </p>
                        )}

                        {/* Access Link */}
                        {owned && (
                          <div className="flex items-center gap-2 text-green-600 font-bold text-sm mt-3">
                            <CheckCircle size={16} />
                            Access Now →
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Category CTA */}
              <div className="mt-6 text-center">
                <Link
                  to={category.cta.link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                >
                  {category.cta.text}
                  {category.cta.link.startsWith('#') ? (
                    <ExternalLink size={16} />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
