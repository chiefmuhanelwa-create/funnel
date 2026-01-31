import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Play,
  BookOpen,
  FileText,
  Loader2,
  ArrowRight,
  Lock,
  CheckCircle,
  Zap,
  Target,
  DollarSign,
  Users,
  Calendar,
  Download,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import PAIDSHub from '../components/PAIDSHub';
import ToolStackSection from '../components/ToolStackSection';

// Admin emails that can access /admin
const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

interface Product {
  id: number;
  key: string;
  name: string;
  description: string;
  price_cents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ElementType;
  accessLink: string;
  purchaseLink: string;
  features?: string[];
}

const PRODUCTS: Product[] = [
  // Beginner Level
  {
    id: 1,
    key: 'starter-kit',
    name: '9-Module Personal Branding Course',
    description: 'Complete system to build your personal brand and monetize your content',
    price_cents: 6700,
    level: 'beginner',
    icon: Play,
    accessLink: '/members/starter-kit',
    purchaseLink: '/contentpreneur-starter-kit',
    features: ['9 Video Modules', 'PAIDS Framework', 'Workbooks Included'],
  },
  {
    id: 10,
    key: 'content-foundations',
    name: '4-Module Content Creation Foundations',
    description: 'Essential groundwork for building your authentic brand',
    price_cents: 3700,
    level: 'beginner',
    icon: Target,
    accessLink: '/members/content-foundations',
    purchaseLink: '/products/content-foundations',
    features: ['Self Reflection', 'SWOT Analysis', 'Value Alignment'],
  },
  {
    id: 7,
    key: 'niche-finder',
    name: 'Niche Finder Workbook',
    description: 'Find your profitable niche in 90 minutes',
    price_cents: 1700,
    level: 'beginner',
    icon: FileText,
    accessLink: '/members/niche-finder',
    purchaseLink: '/products/niche-finder',
  },
  {
    id: 8,
    key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    description: 'Build 5 income streams in 30 days',
    price_cents: 1700,
    level: 'beginner',
    icon: FileText,
    accessLink: '/members/paids-workbook',
    purchaseLink: '/products/paids-workbook',
  },
  // Intermediate Level
  {
    id: 2,
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'Complete blueprint from creator to influential personal brand',
    price_cents: 1900,
    level: 'intermediate',
    icon: BookOpen,
    accessLink: '/members/influencers-code',
    purchaseLink: '/products/influencers-code',
    features: ['13 Chapters', '3Es Formula', 'DARES Framework'],
  },
  {
    id: 6,
    key: 'contentpreneur-book',
    name: 'Contentpreneur Ebook + Physical Book',
    description: 'The complete contentpreneur guide in digital and print',
    price_cents: 2700,
    level: 'intermediate',
    icon: BookOpen,
    accessLink: '/members/contentpreneur-book',
    purchaseLink: '/products/contentpreneur-book',
  },
  {
    id: 3,
    key: 'content-arsenal',
    name: 'Content Arsenal Expansion Pack',
    description: 'Advanced content creation tools and templates',
    price_cents: 3700,
    level: 'intermediate',
    icon: Zap,
    accessLink: '/members/content-arsenal',
    purchaseLink: '/products/content-arsenal',
  },
  {
    id: 9,
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'SARS compliance guide for South African creators',
    price_cents: 4700,
    level: 'intermediate',
    icon: FileText,
    accessLink: '/members/tax-guide',
    purchaseLink: '/products/tax-guide',
    features: ['VDP Process', '6 Tax Types', '35% Rule'],
  },
  // Advanced Level
  {
    id: 5,
    key: 'strategy-call',
    name: '1:1 Coaching Session',
    description: '60-minute personalized strategy call with Mr. NoChill',
    price_cents: 150000,
    level: 'advanced',
    icon: Calendar,
    accessLink: '/consultation',
    purchaseLink: '/products/coaching',
    features: ['90-Day Roadmap', 'Custom Strategy', 'Templates Included'],
  },
];

const LEVEL_CONFIG = {
  beginner: {
    label: 'Beginner',
    description: 'Perfect for newcomers',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'For scaling creators',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  advanced: {
    label: 'Advanced',
    description: 'For established professionals',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
};

// Product mockup images/gradients
const PRODUCT_IMAGES: Record<string, string> = {
  'starter-kit': '/images/products/starter-kit.jpg',
  'content-foundations': '/images/products/content-foundations.jpg',
  'niche-finder': '/images/products/niche-finder.jpg',
  'paids-workbook': '/images/products/paids-workbook.jpg',
  'influencers-code': '/images/products/influencers-code.jpg',
  'contentpreneur-book': '/images/products/contentpreneur-book.jpg',
  'content-arsenal': '/images/products/content-arsenal.jpg',
  'tax-guide': '/images/products/tax-guide.jpg',
  'strategy-call': '/images/products/coaching.jpg',
};

export default function MembersHub() {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasAccessToProduct,
    loginWithEmail,
    logout,
    emailAccess,
  } = useMemberAccess();

  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [activeLevel, setActiveLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsCheckingEmail(true);

    const result = await loginWithEmail(emailInput);

    if (!result.success) {
      setEmailError(result.error || "No products found for this email. Make sure you're using the email you purchased with.");
    }

    setIsCheckingEmail(false);
  };

  // Get owned product keys
  const ownedProductKeys = PRODUCTS.filter(p => hasAccessToProduct(p.key)).map(p => p.key);

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  // Filter products by level
  const filteredProducts = activeLevel === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.level === activeLevel);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading your hub...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated && !emailAccess) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-tight py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center mb-6">
              <Crown size={28} className="text-gray-900" />
            </div>

            <h1 className="text-section text-gray-900">
              Contentpreneur <span className="text-gradient-gold">Hub</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Access your courses, workbooks, and exclusive resources
            </p>

            <div className="mt-10">
              {/* Email Login */}
              <form onSubmit={handleEmailCheck}>
                <div className="text-left">
                  <label className="label">Enter Your Purchase Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Use the same email you used when purchasing
                  </p>
                </div>

                {emailError && (
                  <div className="mt-3 p-4 bg-error-500/10 border border-error-500/20 text-error-400 rounded-xl text-sm">
                    {emailError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCheckingEmail}
                  className="mt-4 btn-primary w-full btn-lg"
                >
                  {isCheckingEmail ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Checking Access...
                    </span>
                  ) : (
                    'Access My Purchases'
                  )}
                </button>
              </form>
            </div>

            <div className="divider my-10" />

            <p className="text-gray-500">
              Don't have access yet?{' '}
              <Link to="/contentpreneur-starter-kit" className="text-gold-500 font-semibold hover:text-gold-400">
                Get the Starter Kit
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Crown size={24} className="text-gray-900" />
            </div>
            <div>
              <span className="badge badge-gold text-xs">Contentpreneur Hub</span>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back{user ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm">{user.email}</p>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-gray-900 rounded-lg font-semibold text-sm hover:bg-gold-400 transition-colors"
                >
                  <Settings size={16} />
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* My Content Section */}
        {ownedProductKeys.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle size={20} className="text-success-400" />
              My Content
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.filter(p => hasAccessToProduct(p.key)).map((product, index) => {
                const levelInfo = LEVEL_CONFIG[product.level];
                const IconComponent = product.icon;

                return (
                  <motion.div
                    key={product.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={product.accessLink}
                      className="card card-hover block h-full group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${levelInfo.iconBg} flex items-center justify-center shrink-0`}>
                          <IconComponent size={24} className={levelInfo.textColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-gold-500 transition-colors truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <span className="mt-3 inline-flex items-center text-gold-500 font-medium text-sm group-hover:gap-2 transition-all">
                            Access Now
                            <ArrowRight size={16} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Explore Resources Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Explore Resources</h2>

            {/* Level Filter */}
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeLevel === level
                      ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                      : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {level === 'all' ? 'All' : LEVEL_CONFIG[level].label}
                </button>
              ))}
            </div>
          </div>

          {/* Products by Level */}
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
            const levelProducts = filteredProducts.filter(p => p.level === level);
            if (levelProducts.length === 0) return null;

            const levelInfo = LEVEL_CONFIG[level];

            return (
              <div key={level} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${levelInfo.iconBg} flex items-center justify-center`}>
                    {level === 'beginner' && <Target size={16} className={levelInfo.textColor} />}
                    {level === 'intermediate' && <Zap size={16} className={levelInfo.textColor} />}
                    {level === 'advanced' && <Crown size={16} className={levelInfo.textColor} />}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${levelInfo.textColor}`}>{levelInfo.label}</h3>
                    <p className="text-xs text-gray-400">{levelInfo.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelProducts.map((product, index) => {
                    const isOwned = hasAccessToProduct(product.key);
                    const IconComponent = product.icon;
                    const productImage = PRODUCT_IMAGES[product.key];

                    return (
                      <motion.div
                        key={product.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white border ${levelInfo.borderColor} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}
                      >
                        {/* Product Image/Mockup */}
                        <div className={`relative h-40 ${levelInfo.bgColor} flex items-center justify-center overflow-hidden`}>
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient on error
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {/* Fallback gradient with icon */}
                          <div className={`absolute inset-0 ${levelInfo.bgColor} flex items-center justify-center`}>
                            <div className={`w-20 h-20 rounded-2xl ${levelInfo.iconBg} border-2 ${levelInfo.borderColor} flex items-center justify-center shadow-lg`}>
                              <IconComponent size={40} className={levelInfo.textColor} />
                            </div>
                          </div>

                          {/* Owned badge */}
                          {isOwned && (
                            <div className="absolute top-3 right-3 z-10">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                <CheckCircle size={12} className="mr-1" />
                                Owned
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Features */}
                          {product.features && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {product.features.map((feature, i) => (
                                <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                            <p className={`text-xl font-bold ${levelInfo.textColor}`}>
                              ${(product.price_cents / 100).toFixed(0)}
                            </p>
                            {isOwned ? (
                              <Link
                                to={product.accessLink}
                                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 text-sm font-medium rounded-lg transition-colors"
                              >
                                Access Now
                                <ArrowRight size={14} className="ml-1" />
                              </Link>
                            ) : (
                              <Link
                                to={product.purchaseLink}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                              >
                                Get Started
                                <ArrowRight size={14} className="ml-1" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* PAIDS Hub Section - Full Monetization Hub */}
        <PAIDSHub userOwnedProductKeys={ownedProductKeys} />

        {/* Tool Stack Section */}
        <ToolStackSection hasStarterKit={hasAccessToProduct('starter-kit')} />

        {/* Quick Links */}
        <section className="py-12 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@contentpreneurhub.online"
              className="text-gray-500 hover:text-gold-500 text-sm transition-colors flex items-center gap-1"
            >
              Contact Support
              <ExternalLink size={14} />
            </a>
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-gold-500 text-sm transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/contentpreneur-starter-kit"
              className="text-gray-500 hover:text-gold-500 text-sm transition-colors"
            >
              Browse Products
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gold-500 hover:text-gold-400 text-sm transition-colors flex items-center gap-1"
              >
                <Settings size={14} />
                Admin Panel
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
