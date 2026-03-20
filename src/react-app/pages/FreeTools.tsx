import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Loader2,
  FileSpreadsheet,
  Palette,
  Calculator,
  ArrowRight,
  Users,
  Lightbulb
} from 'lucide-react';
import { analytics } from '../utils/analytics';

// FREE Lead Magnets Only (no duplicates with paid products)
const LEAD_MAGNETS: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof FileSpreadsheet;
  benefits: string[];
  upsell: {
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    url: string;
    badge: string;
  };
  color: string;
  stats: { label: string; value: string }[];
  externalUrl?: string;
}> = {
  'ratecard-pro': {
    title: 'RateCard Pro Calculator',
    subtitle: 'Calculate Your Worth',
    description: 'Professional rate calculator that helps you price your services correctly and negotiate better brand deals.',
    icon: FileSpreadsheet,
    benefits: [
      'Pre-built pricing formulas for all content types',
      'Brand deal negotiation calculator',
      'Industry benchmark rates included',
      'Customizable for your niche',
      'Instant results - no download needed',
    ],
    upsell: {
      title: "The Influencer's Code",
      description: 'Learn the complete system for landing and negotiating brand deals worth R50K+',
      price: 'R199',
      originalPrice: 'R499',
      url: '/checkout/influencers-code',
      badge: '50% OFF Today',
    },
    color: 'amber',
    stats: [
      { label: 'Creators Using It', value: '2,500+' },
      { label: 'Avg. Rate Increase', value: '47%' },
    ],
    externalUrl: '/tools/ratecard',
  },
  'tax-calculator': {
    title: 'Tax Calculator + Invoice Generator',
    subtitle: 'Stay Compliant',
    description: 'Calculate your tax obligations and generate professional invoices. Built specifically for South African content creators.',
    icon: Calculator,
    benefits: [
      'SARS-compliant tax calculator',
      'Professional invoice templates',
      'Expense tracking tools',
      'VAT calculation helper',
      'Tax deduction checklist',
    ],
    upsell: {
      title: 'Tax Guide for Contentpreneurs',
      description: 'Complete 115-page SARS compliance guide with VDP process and deduction strategies',
      price: 'R449',
      originalPrice: 'R899',
      url: '/checkout/tax-guide',
      badge: '50% OFF Today',
    },
    color: 'emerald',
    stats: [
      { label: 'Tax Saved (Avg)', value: 'R12,000+' },
      { label: 'Creators Protected', value: '500+' },
    ],
    externalUrl: '/tools/tax',
  },
  'content-ideas': {
    title: 'Content Ideas Cheat Sheet',
    subtitle: 'Never Run Out of Ideas',
    description: 'The exact formula for creating viral content that builds your audience and grows your income.',
    icon: Lightbulb,
    benefits: [
      'The 3Es viral content formula',
      '50+ proven content templates',
      'Engagement-boosting hooks',
      'Platform-specific strategies',
      'Instant PDF download',
    ],
    upsell: {
      title: 'Contentpreneur Starter Kit',
      description: 'Full 9-module video course to build your personal brand and income streams',
      price: 'R699',
      originalPrice: 'R1,999',
      url: '/checkout/starter-kit',
      badge: '65% OFF Today',
    },
    color: 'purple',
    stats: [
      { label: 'Ideas Included', value: '50+' },
      { label: 'Success Rate', value: '89%' },
    ],
  },
  'media-kit': {
    title: 'Media Kit Generator Templates',
    subtitle: 'Look Professional',
    description: 'Create a stunning media kit in minutes that gets you noticed by brands and secures better partnerships.',
    icon: Palette,
    benefits: [
      '5 premium Canva templates included',
      'Brand-ready professional designs',
      'Stats showcase layouts',
      'Portfolio presentation sections',
      'One-click customization guide',
    ],
    upsell: {
      title: 'Content Arsenal Pack',
      description: 'Get 100+ templates, swipe files, and tools to 10x your content production',
      price: 'R399',
      originalPrice: 'R899',
      url: '/checkout/content-arsenal',
      badge: '56% OFF Today',
    },
    color: 'rose',
    stats: [
      { label: 'Templates Included', value: '5' },
      { label: 'Brands Impressed', value: '1,000+' },
    ],
  },
};

export default function FreeTools() {
  const { toolKey } = useParams<{ toolKey: string }>();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const tool = toolKey ? LEAD_MAGNETS[toolKey] : null;

  // If no tool specified, show tool selection page
  if (!tool) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-content py-16">
          <div className="text-center mb-12">
            <span className="badge badge-gold mb-4">FREE RESOURCES</span>
            <h1 className="text-section md:text-section-lg text-gray-900">
              Free Tools for <span className="text-gradient-gold">Creators</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Download these free resources to accelerate your content business. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(LEAD_MAGNETS).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center mb-4`}>
                    <Icon size={28} className={`text-${item.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    {item.stats.map((stat, i) => (
                      <span key={i}>{stat.value} {stat.label}</span>
                    ))}
                  </div>
                  <Link
                    to={item.externalUrl || `/free/${key}`}
                    className="btn-primary w-full text-center group-hover:shadow-lg transition-shadow"
                  >
                    Get Free Access
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const Icon = tool.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          leadMagnet: toolKey,
          source: 'free-tools',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      analytics.generateLead({ source: toolKey || 'unknown' });
      analytics.signUp('email');
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state with upsell
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 pt-20">
        <div className="container-tight py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="text-success-400" size={40} />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              You're In, {firstName}!
            </h2>

            <p className="mt-4 text-gray-500 max-w-md mx-auto">
              Check your email at <strong>{email}</strong> — we've sent your access link.
            </p>

            {/* Access Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {tool.externalUrl ? (
                <Link
                  to={tool.externalUrl}
                  className="btn-primary btn-lg inline-flex items-center gap-2"
                >
                  Open {tool.title.replace('Calculator', '').replace('Generator', '').replace('Templates', '').trim()}
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <a
                  href={`/books/${toolKey}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg inline-flex items-center gap-2"
                >
                  <Download size={18} />
                  Download Now
                </a>
              )}
            </motion.div>

            {/* Upsell Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                RECOMMENDED NEXT STEP
              </span>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tool.upsell.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {tool.upsell.description}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gradient-gold">{tool.upsell.price}</span>
                <span className="text-lg text-gray-400 line-through">{tool.upsell.originalPrice}</span>
              </div>

              <Link
                to={tool.upsell.url}
                className="btn-primary btn-lg inline-flex items-center gap-2"
              >
                Get {tool.upsell.title}
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                30-day money-back guarantee • Instant access
              </p>
            </motion.div>

            <Link to="/" className="mt-8 inline-block text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Opt-in form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 pt-20">
      <div className="container-content py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/free" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 text-sm">
              ← All Free Tools
            </Link>

            <span className="badge badge-gold mb-4">
              <Download size={12} className="mr-1" />
              FREE DOWNLOAD
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {tool.title}
            </h1>

            <p className="text-xl text-gray-500 mb-8">
              {tool.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-8">
              {tool.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Users size={18} className="text-gold-500" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{stat.value}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What's Included:</h3>
              {tool.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="text-success-400 shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-600">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
              <Download size={18} />
              <span>Instant download • No credit card required</span>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-8">
              <div className={`w-16 h-16 rounded-2xl bg-gold-500/20 flex items-center justify-center mb-6 mx-auto`}>
                <Icon size={32} className="text-gold-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Get Your Free Copy
              </h2>
              <p className="text-gray-500 text-center mb-6">
                Enter your details below and we'll send it right over.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    placeholder="Your first name"
                    required
                  />
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-error-500/10 text-error-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Download className="mr-2" size={20} />
                      Send Me the Free {tool.subtitle}
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By signing up, you agree to receive emails from Contentpreneur Hub.
                  You can unsubscribe anytime.
                </p>
              </form>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-success-400" />
                  Instant Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-success-400" />
                  No Spam
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-success-400" />
                  Unsubscribe Anytime
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
