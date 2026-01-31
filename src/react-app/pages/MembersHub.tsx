import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Loader2,
  ArrowRight,
  Lock,
  CheckCircle,
  LogOut,
  Mail,
  ExternalLink,
  ChevronRight,
  Settings,
  X,
  Phone,
  Calendar,
  Star,
  Sparkles,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { PRODUCTS, TOOL_STACK } from '../config/products';

// Admin emails
const ADMIN_EMAILS = ['info@nochill.co.za', 'ndivhuwo@nochill.co.za', 'chiefmuhanelwa@gmail.com'];

// Color mappings for Tailwind
const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600' },
  gold: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
};

export default function MembersHub() {
  const { isAuthenticated, isLoading, user, hasAccessToProduct, loginWithEmail, logout, emailAccess } = useMemberAccess();
  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showCoachingUpsell, setShowCoachingUpsell] = useState(false);
  const [showProBundleUpsell, setShowProBundleUpsell] = useState(false);

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsCheckingEmail(true);

    const result = await loginWithEmail(emailInput);
    if (!result.success) {
      setEmailError(result.error || 'No products found for this email.');
    }
    setIsCheckingEmail(false);
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const hasStarterKit = hasAccessToProduct('starter-kit');
  const hasProBundle = hasAccessToProduct('contentpreneur-pro');

  // Get owned and locked products
  const ownedProducts = Object.entries(PRODUCTS).filter(([key]) => hasAccessToProduct(key));
  const lockedProducts = Object.entries(PRODUCTS).filter(
    ([key]) => !hasAccessToProduct(key) && key !== 'contentpreneur-pro' && key !== 'strategy-call'
  );

  // Show coaching upsell after 10 seconds for starter kit owners who don't have coaching
  useEffect(() => {
    if (hasStarterKit && !hasAccessToProduct('strategy-call')) {
      const timer = setTimeout(() => {
        setShowCoachingUpsell(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [hasStarterKit]);

  // Show Pro Bundle upsell for users with individual products but not Pro Bundle
  useEffect(() => {
    if (ownedProducts.length > 0 && !hasProBundle && lockedProducts.length > 2) {
      const timer = setTimeout(() => {
        setShowProBundleUpsell(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [ownedProducts.length, hasProBundle, lockedProducts.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated && !emailAccess) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-md mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <Crown size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Members Area</h1>
              <p className="text-gray-500 mt-2">Access your purchased content</p>
            </div>

            <form onSubmit={handleEmailCheck}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Purchase Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-gray-50"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {emailError && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{emailError}</p>
              )}

              <button
                type="submit"
                disabled={isCheckingEmail}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
              >
                {isCheckingEmail ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Checking...
                  </>
                ) : (
                  <>
                    Access My Content
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Don't have access?{' '}
                <Link to="/contentpreneur-starter-kit" className="text-amber-600 font-medium hover:text-amber-700">
                  Get the Starter Kit →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Coaching Upsell Popup */}
      <AnimatePresence>
        {showCoachingUpsell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCoachingUpsell(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCoachingUpsell(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-4">
                  <Phone size={36} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ready to Accelerate?</h2>
                <p className="text-gray-500 mt-2">Get personalized guidance from Mr. NoChill himself</p>
              </div>

              <div className="bg-rose-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="text-rose-500" size={20} />
                  1:1 Strategy Session Includes:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-rose-500 shrink-0" size={16} />
                    60-minute personalized video call
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-rose-500 shrink-0" size={16} />
                    Custom content strategy for YOUR niche
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-rose-500 shrink-0" size={16} />
                    90-day actionable roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-rose-500 shrink-0" size={16} />
                    Follow-up email support
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">$1,500</span>
                  <span className="text-gray-500 ml-2">/ session</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCoachingUpsell(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <Link
                  to="/consultation"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book Now
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Bundle Upsell Popup */}
      <AnimatePresence>
        {showProBundleUpsell && !hasProBundle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProBundleUpsell(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowProBundleUpsell(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-amber-200 shadow-lg mb-4">
                  <img
                    src={PRODUCTS['starter-kit'].imageUrl}
                    alt="Pro Bundle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Unlock Everything</h2>
                <p className="text-gray-500 mt-2">Get the complete Contentpreneur system</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-200">
                <p className="font-bold text-gray-900 mb-3">Pro Bundle Includes:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {PRODUCTS['contentpreneur-pro'].features
                    .filter(f => !ownedProducts.some(([, p]) => p.name === f || p.shortName === f))
                    .map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="text-amber-500 shrink-0" size={14} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">$147</span>
                  <span className="text-gray-400 line-through ml-2">$170</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Save $23
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProBundleUpsell(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Not Now
                </button>
                <Link
                  to="/checkout/contentpreneur-pro"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-center"
                >
                  Get Pro Bundle →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user ? `, ${user.name.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Settings size={16} />
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* My Content Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            My Content
          </h2>

          {ownedProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
              <Lock className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-600">No products found for your account.</p>
              <Link
                to="/contentpreneur-starter-kit"
                className="inline-block mt-4 text-amber-600 font-medium hover:text-amber-700"
              >
                Browse Products →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedProducts.map(([key, product], index) => {
                const colors = COLOR_CLASSES[product.color] || COLOR_CLASSES.amber;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={product.accessLink}
                      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-amber-300 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {product.imageUrl ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.border} border text-3xl`}>
                            {product.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          <span className="inline-flex items-center mt-3 text-amber-600 text-sm font-semibold">
                            Access Now
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* 1:1 Coaching Upsell Banner - Only for those who don't have it */}
        {!hasAccessToProduct('strategy-call') && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Phone size={36} className="text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Need Personalized Guidance?</h3>
                  <p className="text-rose-100">
                    Book a 1:1 strategy session with Mr. NoChill. Get a custom roadmap tailored to YOUR goals.
                  </p>
                </div>
                <Link
                  to="/consultation"
                  className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-2 shrink-0"
                >
                  <Calendar size={18} />
                  Book Your Call
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tool Stack Section - Only for Starter Kit owners */}
        {hasStarterKit && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-6 md:p-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                    🛠️
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">NoChill Tool Stack</h2>
                    <p className="text-gray-600">Your Affiliate Money Machine — Click to sign up & start earning</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(TOOL_STACK).map(([key, section]) => (
                    <div key={key} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                          <h3 className="text-amber-600 font-bold text-sm">{section.title}</h3>
                          <p className="text-gray-500 text-xs">{section.subtitle}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {section.tools.map((tool) => (
                          <a
                            key={tool.name}
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all group"
                          >
                            <span className="text-2xl">{tool.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 text-sm group-hover:text-amber-600 transition-colors">
                                  {tool.name}
                                </p>
                                <span className="text-xs text-gray-400">{tool.role}</span>
                              </div>
                              <p className="text-gray-500 text-xs truncate">{tool.desc}</p>
                              {'pricing' in tool && (
                                <p className="text-xs text-amber-600 mt-0.5">{tool.pricing}</p>
                              )}
                            </div>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-amber-500 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-center text-gray-500 text-sm">
                  These are the exact tools used to build a content business generating multiple income streams.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Upgrade Section */}
        {lockedProducts.length > 0 && !hasProBundle && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="text-gray-400" size={24} />
              Expand Your Library
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {lockedProducts.slice(0, 4).map(([key, product]) => (
                <div
                  key={key}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-amber-200 transition-colors"
                >
                  {product.imageUrl ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200 opacity-60">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-2xl opacity-60">
                      {product.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{product.name}</h3>
                      <Lock size={14} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-lg font-bold text-amber-600">
                        ${(product.priceCents / 100).toFixed(0)}
                      </span>
                      <Link
                        to={product.purchaseLink}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        Get Access
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Bundle Upsell */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="text-4xl">👑</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Get Everything with Pro Bundle</h3>
                  <p className="text-gray-600 mt-1">
                    All courses, workbooks, and guides in one complete package. Save $23!
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <span className="text-2xl font-bold text-amber-600">$147</span>
                    <span className="text-gray-400 line-through">$170</span>
                    <Link
                      to="/checkout/contentpreneur-pro"
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
                    >
                      Get Pro Bundle →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="mailto:info@nochill.co.za" className="text-gray-500 hover:text-gray-900 transition-colors">
              Contact Support
            </a>
            <Link to="/contentpreneur-starter-kit" className="text-gray-500 hover:text-gray-900 transition-colors">
              Browse Products
            </Link>
            <Link to="/members" className="text-gray-500 hover:text-gray-900 transition-colors">
              Members Home
            </Link>
          </div>

          <p className="mt-6 text-gray-400 text-xs">
            © 2026 NOCHILL PTY LTD. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
