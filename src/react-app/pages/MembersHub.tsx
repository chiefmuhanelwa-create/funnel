import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Loader2,
  ArrowRight,
  Lock,
  CheckCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  Settings,
  Youtube,
  Instagram,
  LogOut,
  Twitter,
  Facebook,
  Linkedin,
  Calendar,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { PRODUCTS, TOOL_STACK } from '../config/products';
import { ShoppingCart, Clock, Sparkles } from 'lucide-react';

// Upsell products with checkout info
// NOTE: starter-kit is excluded (it's the entry product - already purchased)
// NOTE: content-arsenal is excluded until it's available
const UPSELL_PRODUCTS = [
  {
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'Bestselling eBook with 6,000+ copies sold',
    price: 19,
    originalPrice: 197,
    checkoutLink: '/checkout/influencers-code',
    badge: 'BESTSELLER',
  },
  {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'Essential tax strategies for SA content creators',
    price: 47,
    checkoutLink: '/checkout/tax-guide',
  },
  {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    description: '3 video modules on content strategy',
    price: 37,
    checkoutLink: '/checkout/content-foundations',
  },
  {
    key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur (Ebook + Hardcopy)',
    description: 'Physical book + digital eBook copy. Free SA shipping.',
    price: 37,
    originalPrice: 47,
    checkoutLink: '/checkout/contentpreneur-book-hardcopy',
    badge: 'COMING SOON',
    isPreOrder: true,
  },
];

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
  const { isAuthenticated, isLoading, user, hasAccessToProduct, loginWithEmail, emailAccess, logout } = useMemberAccess();
  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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

  // Get owned products only
  const ownedProducts = Object.entries(PRODUCTS).filter(([key]) => hasAccessToProduct(key));

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
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                <Crown size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Members Area</h1>
              <p className="text-gray-500 mt-2">Access your purchased content</p>
            </div>

            <form onSubmit={handleLogin}>
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
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user ? `, ${user.name.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Settings size={16} />
              Admin
            </Link>
          )}
        </div>

        {/* Free Strategy Call Banner */}
        <section className="mb-8">
          <Link
            to="/booking"
            className="block bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Calendar size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Free for Members</span>
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">NEW</span>
                </div>
                <h3 className="text-xl font-bold text-white">Book a 1-on-1 Strategy Session</h3>
                <p className="text-white/80 text-sm mt-1">
                  Get personalized guidance using the PAIDS Framework. Limited spots available.
                </p>
              </div>
              <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </Link>
        </section>

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
                      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:border-amber-300 transition-all group"
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

        {/* Upsells Section - Show products user doesn't own */}
        {(() => {
          const availableUpsells = UPSELL_PRODUCTS.filter(p => !hasAccessToProduct(p.key));
          if (availableUpsells.length === 0) return null;

          return (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-amber-500" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Expand Your Learning</h2>
              </div>

              {/* Tool Stack Promo - show if user doesn't have starter-kit */}
              {!hasStarterKit && (
                <div className="mb-6 p-5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shrink-0">
                      🛠️
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Unlock the NoChill Tool Stack</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Get access to our curated affiliate tools that generate multiple income streams.
                        Included with the Starter Kit!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableUpsells.map((product, index) => (
                  <motion.div
                    key={product.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-amber-200 transition-all">
                      {product.badge && (
                        <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                          product.badge === 'BESTSELLER' ? 'bg-purple-500 text-white' :
                          product.badge === 'BEST VALUE' ? 'bg-green-500 text-white' :
                          product.badge === 'COMING SOON' ? 'bg-amber-500 text-black' :
                          'bg-gray-500 text-white'
                        }`}>
                          {product.badge}
                        </span>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                          {product.includesToolStack && (
                            <span className="inline-flex items-center gap-1 mt-2 text-xs text-amber-600 font-medium">
                              🛠️ Includes Tool Stack Access
                            </span>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-amber-600">R{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">R{product.originalPrice}</span>
                              )}
                            </div>
                            <Link
                              to={product.checkoutLink}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded-lg transition-colors"
                            >
                              <ShoppingCart size={14} />
                              {product.isPreOrder ? 'Pre-Order' : 'Get Access'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Tool Stack Section - Only for Starter Kit owners */}
        {hasStarterKit && (
          <section className="mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-6 md:p-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
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

        {/* Social Media & Quick Links */}
        <section className="border-t border-gray-200 pt-8">
          {/* Social Media Links */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.youtube.com/@NOCHILLGOD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Youtube size={18} />
                YouTube
              </a>
              <a
                href="https://www.youtube.com/@NOCHILLVODCAST"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Youtube size={18} />
                Vodcast
              </a>
              <a
                href="https://www.instagram.com/nochill_god/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
              >
                <Instagram size={18} />
                Instagram
              </a>
              <a
                href="https://x.com/NOCHILL_GOD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Twitter size={18} />
                X / Twitter
              </a>
              <a
                href="https://www.tiktok.com/@nochillgod"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
              <a
                href="https://www.facebook.com/NdivhuwoMuhanelwaQuotes/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Facebook size={18} />
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/in/ndivhuwo-muhanelwa/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <a href="mailto:info@nochill.co.za" className="text-gray-500 hover:text-gray-900 transition-colors">
              Contact Support
            </a>
            <Link to="/members" className="text-gray-500 hover:text-gray-900 transition-colors">
              Members Home
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>

          <p className="mt-6 text-gray-400 text-xs">
            © 2026 NOCHILL PTY LTD. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
