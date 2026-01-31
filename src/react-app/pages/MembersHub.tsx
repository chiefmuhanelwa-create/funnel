import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Play,
  FileText,
  Loader2,
  ArrowRight,
  Lock,
  CheckCircle,
  LogOut,
  Mail,
  BookOpen,
  Wrench,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  DollarSign,
  Settings,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

// Admin emails
const ADMIN_EMAILS = ['info@nochill.co.za', 'ndivhuwo@nochill.co.za', 'chiefmuhanelwa@gmail.com'];

// Product definitions with access links
const PRODUCTS = {
  'starter-kit': {
    name: '9-Module Personal Branding Course',
    description: 'Complete system to build and monetize your personal brand',
    icon: Play,
    color: 'amber',
    accessLink: '/members/starter-kit',
  },
  'niche-finder': {
    name: 'Niche Finder Workbook',
    description: 'Find your profitable niche in 90 minutes',
    icon: Target,
    color: 'blue',
    accessLink: '/members/niche-finder',
  },
  'paids-workbook': {
    name: 'PAIDS Framework Workbook',
    description: 'Build 5 income streams step by step',
    icon: FileText,
    color: 'green',
    accessLink: '/members/paids-workbook',
  },
  'content-foundations': {
    name: 'Content Foundations Course',
    description: 'Master the fundamentals of content creation',
    icon: BookOpen,
    color: 'purple',
    accessLink: '/members/content-foundations',
  },
  'influencers-code': {
    name: "The Influencer's Code",
    description: 'Complete blueprint from creator to influential brand',
    icon: Sparkles,
    color: 'pink',
    accessLink: '/members/influencers-code',
  },
  'tax-guide': {
    name: 'Tax Guide for Contentpreneurs',
    description: 'SARS compliance guide for SA creators',
    icon: FileText,
    color: 'slate',
    accessLink: '/members/tax-guide',
  },
} as const;

// Tool Stack data
const TOOL_STACK = {
  thinking: {
    title: 'POWER 1 — THINKING & STRATEGY',
    subtitle: 'Where ideas, clarity and decisions come from',
    tools: [
      { name: 'ChatGPT', role: 'Brain', desc: 'Ideas, scripts, captions, strategy', icon: '🧠' },
      { name: 'Claude', role: 'Writing Partner', desc: 'Long-form content, deep thinking', icon: '✍️' },
      { name: 'Perplexity', role: 'Research', desc: 'Fast accurate data gathering', icon: '🔍' },
      { name: 'Notion', role: 'Command Center', desc: 'Everything organized in one place', icon: '📋' },
    ],
  },
  creation: {
    title: 'POWER 2 — CONTENT CREATION',
    subtitle: 'How I produce content at scale',
    tools: [
      { name: 'CapCut', role: 'Video Editor', desc: 'Fast mobile & desktop editing', icon: '🎬' },
      { name: 'Canva', role: 'Graphics', desc: 'Thumbnails, posts, stories', icon: '🎨' },
      { name: 'Descript', role: 'Audio/Video', desc: 'Podcast editing, transcription', icon: '🎙️' },
    ],
  },
  automation: {
    title: 'POWER 3 — AUTOMATION & WORKFLOW',
    subtitle: 'Systems that save 20+ hours per week',
    tools: [
      { name: 'Zapier', role: 'Automation', desc: 'Connect all your tools', icon: '⚡' },
      { name: 'Later', role: 'Scheduling', desc: 'Social media scheduling', icon: '📅' },
      { name: 'Slack', role: 'Communication', desc: 'Team coordination', icon: '💬' },
    ],
  },
  monetization: {
    title: 'POWER 4 — MONETIZATION & SALES',
    subtitle: 'Where followers become income',
    tools: [
      { name: 'Gumroad', role: 'Digital Sales', desc: 'Sell courses & ebooks', icon: '💰' },
      { name: 'Stripe', role: 'Payments', desc: 'Accept payments globally', icon: '💳' },
      { name: 'ConvertKit', role: 'Email', desc: 'Build & nurture your list', icon: '📧' },
    ],
  },
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

  // Get owned products
  const ownedProducts = Object.entries(PRODUCTS).filter(([key]) => hasAccessToProduct(key));

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
                  Get the Starter Kit
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
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
              {ownedProducts.map(([key, product]) => {
                const IconComponent = product.icon;
                const colorClasses = {
                  amber: 'bg-amber-50 text-amber-600 border-amber-200',
                  blue: 'bg-blue-50 text-blue-600 border-blue-200',
                  green: 'bg-green-50 text-green-600 border-green-200',
                  purple: 'bg-purple-50 text-purple-600 border-purple-200',
                  pink: 'bg-pink-50 text-pink-600 border-pink-200',
                  slate: 'bg-slate-50 text-slate-600 border-slate-200',
                }[product.color];

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link
                      to={product.accessLink}
                      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClasses}`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                          <span className="inline-flex items-center mt-3 text-amber-600 text-sm font-medium">
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Wrench size={24} className="text-gray-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">NoChill Tool Stack</h2>
                  <p className="text-gray-400 text-sm">Your Affiliate Money Machine</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(TOOL_STACK).map(([key, section]) => (
                  <div key={key} className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <h3 className="text-amber-400 font-semibold text-sm mb-1">{section.title}</h3>
                    <p className="text-gray-400 text-xs mb-4">{section.subtitle}</p>

                    <div className="space-y-3">
                      {section.tools.map((tool) => (
                        <div key={tool.name} className="flex items-center gap-3">
                          <span className="text-2xl">{tool.icon}</span>
                          <div>
                            <p className="font-medium text-white text-sm">{tool.name}</p>
                            <p className="text-gray-400 text-xs">{tool.desc}</p>
                          </div>
                        </div>
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

        {/* Upgrade Section - Only show if doesn't have everything */}
        {!hasAccessToProduct('contentpreneur-pro') && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expand Your Library</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(PRODUCTS)
                .filter(([key]) => !hasAccessToProduct(key))
                .slice(0, 4)
                .map(([key, product]) => {
                  const IconComponent = product.icon;

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                        <Link
                          to={`/products/${key}`}
                          className="inline-flex items-center mt-2 text-amber-600 text-sm font-medium hover:text-amber-700"
                        >
                          Learn More
                          <ExternalLink size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
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
