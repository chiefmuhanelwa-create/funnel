import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Loader2 } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Members() {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasAccessToProduct,
    getAllAccessibleProducts,
    login,
    checkEmailAccess,
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
      link: '/members/influencers-code',
      type: 'eBook',
    },
    {
      key: 'niche-finder',
      name: 'Niche Finder Workbook',
      description: 'Find your profitable content niche',
      icon: FileText,
      link: '/api/files/books/niche-finder.pdf',
      type: 'Workbook',
      isDownload: true,
    },
    {
      key: 'paids-workbook',
      name: 'PAIDS Framework Workbook',
      description: 'Master the 5 pillars of content success',
      icon: FileText,
      link: '/api/files/books/paids-workbook.pdf',
      type: 'Workbook',
      isDownload: true,
    },
    {
      key: 'tax-guide',
      name: 'Creator Tax Guide SA',
      description: 'Essential tax tips for content creators',
      icon: FileText,
      link: '/api/files/books/tax-guide.pdf',
      type: 'Guide',
      isDownload: true,
    },
  ];

  const accessibleProducts = getAllAccessibleProducts();

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsCheckingEmail(true);

    const hasAccess = await checkEmailAccess(emailInput);

    if (!hasAccess) {
      setEmailError('No products found for this email. Make sure you\'re using the email you purchased with.');
    }

    setIsCheckingEmail(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  // If not authenticated and no email access, show login options
  if (!isAuthenticated && !emailAccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Access Your Content
            </h1>
            <p className="mt-4 text-gray-600">
              Log in to access your purchased courses and resources
            </p>

            <div className="mt-8 space-y-6">
              {/* OAuth Login */}
              <div>
                <button
                  onClick={login}
                  className="btn-primary w-full py-4 text-lg"
                >
                  Sign in with Google
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Recommended for the best experience
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Lookup */}
              <form onSubmit={handleEmailCheck}>
                <div className="text-left">
                  <label className="label">Check access with email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="input"
                    placeholder="Enter your purchase email"
                    required
                  />
                </div>

                {emailError && (
                  <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {emailError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCheckingEmail}
                  className="mt-4 btn-secondary w-full"
                >
                  {isCheckingEmail ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Checking...
                    </span>
                  ) : (
                    'Check Access'
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have access yet?{' '}
                <Link to="/contentpreneur-starter-kit" className="text-primary-600 font-semibold">
                  Get the Starter Kit
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show accessible products
  const ownedProducts = products.filter(p => hasAccessToProduct(p.key));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}!
              </h1>
              <p className="mt-2 text-gray-600">
                Access your purchased content below
              </p>
            </div>
          </div>

          {ownedProducts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">
                You don't have any products yet.{' '}
                <Link to="/contentpreneur-starter-kit" className="text-primary-600 font-semibold">
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
                      className="card card-hover block h-full"
                    >
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <product.icon className="text-primary-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {product.type}
                          </span>
                          <h3 className="mt-2 font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {product.description}
                          </p>
                          <span className="mt-3 inline-flex items-center text-primary-600 font-medium text-sm">
                            Download PDF
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link to={product.link} className="card card-hover block h-full">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <product.icon className="text-primary-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {product.type}
                          </span>
                          <h3 className="mt-2 font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {product.description}
                          </p>
                          <span className="mt-3 inline-flex items-center text-primary-600 font-medium text-sm">
                            Access Now →
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
