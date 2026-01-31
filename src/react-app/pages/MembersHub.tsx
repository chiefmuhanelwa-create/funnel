import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { PRODUCTS, TOOL_STACK, getProductIcon } from '../config/products';

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

  // Get owned and locked products
  const ownedProducts = Object.entries(PRODUCTS).filter(([key]) => hasAccessToProduct(key));
  const lockedProducts = Object.entries(PRODUCTS).filter(
    ([key]) => !hasAccessToProduct(key) && key !== 'contentpreneur-pro' && key !== 'strategy-call'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated && !emailAccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
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
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
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
    <div className="min-h-screen bg-gray-50 pt-20">
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
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
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
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.border} border text-3xl`}>
                          {product.icon}
                        </div>
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

        {/* Tool Stack Section - Only for Starter Kit owners */}
        {hasStarterKit && (
          <section className="mb-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                  🛠️
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">NoChill Tool Stack</h2>
                  <p className="text-gray-400">Your Affiliate Money Machine — Click to sign up</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(TOOL_STACK).map(([key, section]) => (
                  <div key={key} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <h3 className="text-amber-400 font-bold text-sm">{section.title}</h3>
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
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                          <span className="text-2xl">{tool.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">
                              {tool.name}
                            </p>
                            <p className="text-gray-400 text-xs">{tool.desc}</p>
                          </div>
                          <ExternalLink size={14} className="text-gray-500 group-hover:text-amber-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-gray-400 text-sm">
                These are the exact tools I use to run a content business generating multiple income streams.
              </p>
            </div>
          </section>
        )}

        {/* Upgrade Section */}
        {lockedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="text-gray-400" size={24} />
              Expand Your Library
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {lockedProducts.slice(0, 4).map(([key, product]) => {
                const colors = COLOR_CLASSES[product.color] || COLOR_CLASSES.slate;

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-2xl opacity-50`}>
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{product.name}</h3>
                        <Lock size={14} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
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
                );
              })}
            </div>

            {/* Pro Bundle Upsell */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👑</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Get Everything with Pro Bundle</h3>
                  <p className="text-gray-600 mt-1">
                    All courses, workbooks, and guides in one complete package. Save $23!
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-2xl font-bold text-amber-600">$147</span>
                    <span className="text-gray-400 line-through">$170</span>
                    <Link
                      to="/products/contentpreneur-pro"
                      className="ml-auto px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
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
            <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Back to Homepage
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
