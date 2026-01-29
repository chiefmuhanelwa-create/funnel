import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Loader2, Download, ArrowRight, User } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { DOCUMENTS } from '../config/assets';

export default function Members() {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasAccessToProduct,
    getAllAccessibleProducts,
    loginWithEmail,
    emailAccess,
  } = useMemberAccess();

  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  const products = [
    {
      key: 'starter-kit',
      name: 'Contentpreneur Starter Kit',
      description: '9-module course to build your content business',
      icon: Play,
      link: '/members/starter-kit',
      type: 'Course',
    },
    {
      key: 'influencers-code',
      name: "The Influencer's Code",
      description: 'Comprehensive eBook on influencer success',
      icon: BookOpen,
      link: DOCUMENTS.influencersCode,
      type: 'eBook',
      isDownload: true,
    },
    {
      key: 'niche-finder',
      name: 'Niche Finder Workbook',
      description: 'Find your profitable content niche',
      icon: FileText,
      link: DOCUMENTS.nicheFinderWorkbook,
      type: 'Workbook',
      isDownload: true,
    },
    {
      key: 'paids-workbook',
      name: 'PAIDS Framework Workbook',
      description: 'Master the 5 pillars of content success',
      icon: FileText,
      link: DOCUMENTS.paidsFrameworkWorkbook,
      type: 'Workbook',
      isDownload: true,
    },
    {
      key: 'tax-guide',
      name: 'Creator Tax Guide SA',
      description: 'Essential tax tips for content creators',
      icon: FileText,
      link: DOCUMENTS.taxGuide,
      type: 'Guide',
      isDownload: true,
    },
  ];

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
      <div className="min-h-screen flex items-center justify-center bg-dark-500 pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
          <p className="mt-4 text-white/50">Loading your content...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and no email access, show login options
  if (!isAuthenticated && !emailAccess) {
    return (
      <div className="min-h-screen bg-dark-500 pt-20">
        <div className="container-tight py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center mb-6">
              <User size={28} className="text-dark-500" />
            </div>

            <h1 className="text-section text-white">
              Access Your <span className="text-gradient-gold">Content</span>
            </h1>
            <p className="mt-4 text-white/60">
              Log in to access your purchased courses and resources
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
                  <p className="mt-2 text-xs text-white/40">
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

            <p className="text-white/50">
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

  // Show accessible products
  const ownedProducts = products.filter(p => hasAccessToProduct(p.key));

  return (
    <div className="min-h-screen bg-dark-500 pt-20">
      <div className="container-content py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Welcome header */}
          <div className="mb-10">
            <h1 className="text-section text-white">
              Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="mt-2 text-white/50">
              Access your purchased content below
            </p>
          </div>

          {ownedProducts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-white/60">
                You don't have any products yet.{' '}
                <Link to="/contentpreneur-starter-kit" className="text-gold-500 font-semibold hover:text-gold-400">
                  Get started with the Starter Kit
                </Link>
              </p>
            </div>
          ) : (
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
                      className="card card-hover block h-full group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0">
                          <product.icon className="text-gold-500" size={24} />
                        </div>
                        <div className="flex-1">
                          <span className="badge badge-gold text-xs">{product.type}</span>
                          <h3 className="mt-2 font-semibold text-white group-hover:text-gold-500 transition-colors">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-white/50">
                            {product.description}
                          </p>
                          <span className="mt-4 inline-flex items-center text-gold-500 font-medium text-sm">
                            <Download size={16} className="mr-2" />
                            Download PDF
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to={product.link} className="card card-hover block h-full group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0">
                          <product.icon className="text-gold-500" size={24} />
                        </div>
                        <div className="flex-1">
                          <span className="badge badge-gold text-xs">{product.type}</span>
                          <h3 className="mt-2 font-semibold text-white group-hover:text-gold-500 transition-colors">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-white/50">
                            {product.description}
                          </p>
                          <span className="mt-4 inline-flex items-center text-gold-500 font-medium text-sm group-hover:gap-2 transition-all">
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
          )}

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Need help?</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:support@contentpreneurhub.online"
                className="text-white/50 hover:text-gold-500 text-sm transition-colors"
              >
                Contact Support
              </a>
              <Link
                to="/contentpreneur-starter-kit"
                className="text-white/50 hover:text-gold-500 text-sm transition-colors"
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
