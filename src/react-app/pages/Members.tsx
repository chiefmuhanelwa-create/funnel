import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Loader2, Download, ArrowRight, User, Lock, ShoppingCart, Clock } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { DOCUMENTS, IMAGES } from '../config/assets';

interface Product {
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  link: string;
  checkoutLink: string;
  type: string;
  isDownload?: boolean;
  price?: number;
  originalPrice?: number;
  isPreOrder?: boolean;
  imageUrl?: string;
}

// All available products with their access links and checkout links
const ALL_PRODUCTS: Product[] = [
  {
    key: 'starter-kit',
    name: 'Contentpreneur Starter Kit',
    description: '10-module course to build your content business',
    icon: Play,
    link: '/members/starter-kit',
    checkoutLink: '/checkout/starter-kit',
    type: 'Course',
    price: 67,
    imageUrl: IMAGES.starterKitCourseMockup,
  },
  {
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'Bestselling eBook with 6,000+ copies sold',
    icon: BookOpen,
    link: DOCUMENTS.influencersCode,
    checkoutLink: '/checkout/influencers-code',
    type: 'eBook',
    isDownload: true,
    price: 19,
    originalPrice: 197,
    imageUrl: IMAGES.influencersCodeMockup,
  },
  {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    description: '3-module course on content strategy',
    icon: Play,
    link: '/members/content-foundations',
    checkoutLink: '/checkout/content-foundations',
    type: 'Course',
    price: 37,
    imageUrl: IMAGES.contentFoundationsMockup,
  },
  {
    key: 'niche-finder',
    name: 'Niche Finder Workbook',
    description: 'Find your profitable content niche',
    icon: FileText,
    link: DOCUMENTS.nicheFinderWorkbook,
    checkoutLink: '/checkout/niche-finder',
    type: 'Workbook',
    isDownload: true,
    price: 17,
    imageUrl: IMAGES.nicheWorkbookMockup,
  },
  {
    key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    description: 'Master the 5 pillars of content success',
    icon: FileText,
    link: DOCUMENTS.paidsFrameworkWorkbook,
    checkoutLink: '/checkout/paids-workbook',
    type: 'Workbook',
    isDownload: true,
    price: 17,
    imageUrl: IMAGES.paidsWorkbookMockup,
  },
  {
    key: 'tax-guide',
    name: 'Creator Tax Guide SA',
    description: 'Essential tax tips for content creators',
    icon: FileText,
    link: DOCUMENTS.taxGuide,
    checkoutLink: '/checkout/tax-guide',
    type: 'Guide',
    isDownload: true,
    price: 47,
    imageUrl: IMAGES.taxGuideMockup,
  },
  {
    key: 'content-arsenal',
    name: 'Content Arsenal Pack',
    description: '100+ templates and swipe files',
    icon: FileText,
    link: '/members/content-arsenal',
    checkoutLink: '/checkout/content-arsenal',
    type: 'Templates',
    price: 37,
    originalPrice: 97,
  },
  {
    key: 'contentpreneur-book-ebook',
    name: 'Contentpreneur Guide (eBook)',
    description: 'The definitive guide to building a content business',
    icon: BookOpen,
    link: '/members/contentpreneur-book',
    checkoutLink: '/checkout/contentpreneur-book-ebook',
    type: 'eBook',
    price: 19,
    isPreOrder: true,
    imageUrl: IMAGES.influencersCodeMockup,
  },
  {
    key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur Guide (Hardcopy + eBook)',
    description: 'Physical book + digital copy. Free SA shipping.',
    icon: BookOpen,
    link: '/members/contentpreneur-book',
    checkoutLink: '/checkout/contentpreneur-book-hardcopy',
    type: 'Book',
    price: 37,
    isPreOrder: true,
    imageUrl: IMAGES.influencersCodeMockup,
  },
];

// Products shown as locked upsells if not owned
const UPSELL_KEYS = [
  'influencers-code',
  'content-arsenal',
  'tax-guide',
  'content-foundations',
  'contentpreneur-book-ebook',
  'contentpreneur-book-hardcopy',
];

// Products that are bundled with starter-kit (don't show separately as owned)
const STARTER_KIT_BUNDLED = ['niche-finder', 'paids-workbook'];

export default function Members() {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasAccessToProduct,
    loginWithEmail,
    emailAccess,
  } = useMemberAccess();

  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsCheckingEmail(true);

    const result = await loginWithEmail(emailInput);

    if (!result.success) {
      setEmailError(result.error || 'No products found for this email. Make sure you\'re using the email you purchased with.');
    }

    setIsCheckingEmail(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading your content...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and no email access, show login options
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
              <User size={28} className="text-gray-900" />
            </div>

            <h1 className="text-section text-gray-900">
              Access Your <span className="text-gradient-gold">Content</span>
            </h1>
            <p className="mt-4 text-gray-500">
              Log in to access your purchased courses and resources
            </p>

            <div className="mt-10">
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

  // Check if user owns starter-kit (for bundling logic)
  const ownsStarterKit = hasAccessToProduct('starter-kit');

  // Separate owned and locked products
  // Don't show niche-finder/paids-workbook separately if user owns starter-kit (avoid duplicates)
  const ownedProducts = ALL_PRODUCTS.filter(p => {
    if (!hasAccessToProduct(p.key)) return false;
    // Hide bundled products if user owns starter-kit (they're included with it)
    if (ownsStarterKit && STARTER_KIT_BUNDLED.includes(p.key)) return false;
    return true;
  });

  const lockedUpsells = ALL_PRODUCTS.filter(p =>
    UPSELL_KEYS.includes(p.key) && !hasAccessToProduct(p.key)
  );

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Welcome header */}
          <div className="mb-10">
            <h1 className="text-section text-gray-900">
              Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="mt-2 text-gray-500">
              Access your purchased content below
            </p>
          </div>

          {/* Owned Products Section */}
          {ownedProducts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500">
                You don't have any products yet.{' '}
                <Link to="/contentpreneur-starter-kit" className="text-gold-500 font-semibold hover:text-gold-400">
                  Get started with the Starter Kit
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Your Products
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedProducts.map((product, index) => (
                  <motion.div
                    key={product.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {product.isDownload ? (
                      <a
                        href={product.link}
                        download
                        className="card card-hover block h-full group border-2 border-green-500/20"
                      >
                        <div className="flex items-start gap-4">
                          {product.imageUrl ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-green-500/20">
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                              <product.icon className="text-green-600" size={24} />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="badge bg-green-500/20 text-green-700 text-xs">{product.type}</span>
                              <span className="text-xs text-green-600 font-medium">OWNED</span>
                            </div>
                            <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-gold-500 transition-colors">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.description}
                            </p>
                            <span className="mt-4 inline-flex items-center text-green-600 font-medium text-sm">
                              <Download size={16} className="mr-2" />
                              Download PDF
                            </span>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link to={product.link} className="card card-hover block h-full group border-2 border-green-500/20">
                        <div className="flex items-start gap-4">
                          {product.imageUrl ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-green-500/20">
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                              <product.icon className="text-green-600" size={24} />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="badge bg-green-500/20 text-green-700 text-xs">{product.type}</span>
                              <span className="text-xs text-green-600 font-medium">OWNED</span>
                            </div>
                            <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-gold-500 transition-colors">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.description}
                            </p>
                            <span className="mt-4 inline-flex items-center text-green-600 font-medium text-sm group-hover:gap-2 transition-all">
                              Access Now
                              <ArrowRight size={16} className="ml-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Locked Upsells Section */}
          {lockedUpsells.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-gray-400" />
                Expand Your Learning
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedUpsells.map((product, index) => (
                  <motion.div
                    key={product.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="card h-full border-2 border-gray-200 bg-gray-50/50 relative overflow-hidden">
                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {product.isPreOrder && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            <Clock size={12} />
                            COMING SOON
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                          <Lock size={12} />
                          LOCKED
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        {product.imageUrl ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                            <product.icon className="text-gray-400" size={24} />
                          </div>
                        )}
                        <div className="flex-1">
                          <span className="badge bg-gray-200 text-gray-600 text-xs">{product.type}</span>
                          <h3 className="mt-2 font-semibold text-gray-700">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.description}
                          </p>

                          {/* Price */}
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-lg font-bold text-gold-600">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                            )}
                          </div>

                          {/* Get Access / Pre-Order Button */}
                          <Link
                            to={product.checkoutLink}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold text-sm rounded-lg transition-colors"
                          >
                            <ShoppingCart size={16} />
                            {product.isPreOrder ? 'Pre-Order Now' : 'Get Access'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need help?</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:support@contentpreneurhub.online"
                className="text-gray-500 hover:text-gold-500 text-sm transition-colors"
              >
                Contact Support
              </a>
              <Link
                to="/contentpreneur-starter-kit"
                className="text-gray-500 hover:text-gold-500 text-sm transition-colors"
              >
                Browse More Products
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
