import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Loader2,
  Zap,
  Shield,
  Users,
  Star,
  Calculator,
  FileText,
  Lightbulb,
  Palette,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { analytics } from '../utils/analytics';

// Lead magnet configurations
const LEAD_MAGNETS = {
  'ratecard': {
    key: 'ratecard-pro',
    title: 'Free Influencer Rate Calculator',
    headline: 'Stop Undercharging for Brand Deals',
    subheadline: 'Calculate exactly what brands should pay you based on your metrics. Used by 3,500+ creators to increase rates by 47% on average.',
    icon: Calculator,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 via-white to-orange-50',
    borderColor: 'border-amber-200',
    stats: [
      { value: '47%', label: 'Avg Rate Increase' },
      { value: '3,500+', label: 'Creators Using It' },
      { value: 'R50K+', label: 'Deals Calculated' },
    ],
    features: [
      'Calculate rates for posts, reels, stories & TikToks',
      'Factor in engagement rate, niche & exclusivity',
      'Get benchmark rates for your follower count',
      'Export professional rate cards for brands',
    ],
    testimonial: {
      quote: "I was charging R2,000 per post. After using RateCard Pro, I realized I should be charging R8,500. My next brand deal paid 4x more!",
      name: 'Naledi M.',
      title: 'Lifestyle Creator, 45K followers',
    },
    externalUrl: 'https://collab-value.lovable.app/',
    upsell: {
      name: "The Influencer's Code",
      description: 'Learn how to pitch brands and close deals',
      price: 19,
      originalPrice: 47,
      link: '/checkout/influencers-code',
    },
  },
  'tax': {
    key: 'tax-calculator',
    title: 'Free Creator Tax Tools',
    headline: 'Stay SARS Compliant Without the Headache',
    subheadline: 'Free tax calculator + invoice generator built specifically for South African content creators. Protect yourself before SARS comes knocking.',
    icon: FileText,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 via-white to-teal-50',
    borderColor: 'border-emerald-200',
    stats: [
      { value: 'R12K+', label: 'Avg Tax Saved' },
      { value: '2,000+', label: 'Creators Protected' },
      { value: '100%', label: 'SARS Compliant' },
    ],
    features: [
      'Calculate your provisional tax instantly',
      'Check VAT registration threshold',
      'Generate professional invoices for brands',
      'Preview the 115-page tax guide',
    ],
    testimonial: {
      quote: "I had no idea about my tax obligations as a content creator. These tools helped me get compliant and I even got a refund from SARS!",
      name: 'Thabo K.',
      title: 'Tech Creator, 120K subscribers',
    },
    externalUrl: 'https://contentprenuership.com',
    upsell: {
      name: 'Tax Guide for Contentpreneurs',
      description: 'Complete 115-page SARS compliance guide',
      price: 47,
      originalPrice: 97,
      link: '/checkout/tax-guide',
    },
  },
  'content-ideas': {
    key: 'content-ideas',
    title: 'Free Content Ideas Cheat Sheet',
    headline: 'Never Run Out of Content Ideas Again',
    subheadline: 'Get 50+ proven content templates and the 3Es viral content formula that helped me grow from 0 to 3M+ followers.',
    icon: Lightbulb,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 via-white to-pink-50',
    borderColor: 'border-purple-200',
    stats: [
      { value: '50+', label: 'Content Templates' },
      { value: '3Es', label: 'Viral Formula' },
      { value: '1,500+', label: 'Downloads' },
    ],
    features: [
      'The 3Es viral content formula explained',
      '50+ plug-and-play content templates',
      'Content calendar planning framework',
      'Niche-specific content ideas',
    ],
    testimonial: {
      quote: "This cheat sheet completely changed how I approach content. I went from posting randomly to having a strategic plan that actually grows my audience.",
      name: 'Lindiwe S.',
      title: 'Beauty Creator, 28K followers',
    },
    downloadUrl: '/books/content-ideas-cheatsheet.pdf',
    upsell: {
      name: 'Contentpreneur Starter Kit',
      description: '9-module system to monetize your content',
      price: 67,
      originalPrice: 197,
      link: '/checkout/starter-kit',
    },
  },
  'media-kit': {
    key: 'media-kit',
    title: 'Free Media Kit Templates',
    headline: 'Look Professional. Land More Deals.',
    subheadline: 'Get 5 premium Canva media kit templates that make brands take you seriously. Same templates used by creators landing R10K+ deals.',
    icon: Palette,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 via-white to-indigo-50',
    borderColor: 'border-blue-200',
    stats: [
      { value: '5', label: 'Premium Templates' },
      { value: 'Canva', label: 'Easy to Edit' },
      { value: '800+', label: 'Downloads' },
    ],
    features: [
      '5 professionally designed Canva templates',
      'Easy drag-and-drop customization',
      'Stats showcase layouts that convert',
      'Brand collaboration rate cards included',
    ],
    testimonial: {
      quote: "Brands used to ghost me. After sending my new media kit, I got 3 responses in one week and closed a R15,000 deal!",
      name: 'Mpho N.',
      title: 'Fashion Creator, 52K followers',
    },
    downloadUrl: '/books/media-kit-templates.pdf',
    upsell: {
      name: 'Content Arsenal Pack',
      description: 'Complete template bundle for creators',
      price: 37,
      originalPrice: 97,
      link: '/checkout/content-arsenal',
    },
  },
};

type LeadMagnetKey = keyof typeof LEAD_MAGNETS;

export default function LeadMagnetLanding() {
  const { leadKey } = useParams<{ leadKey: string }>();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  // Get lead magnet config or default to ratecard
  const config = LEAD_MAGNETS[leadKey as LeadMagnetKey] || LEAD_MAGNETS['ratecard'];
  const Icon = config.icon;

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
          whatsapp,
          leadMagnet: config.key,
          source: `lp-${leadKey}`,
          externalToolUrl: config.externalUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      analytics.generateLead({ source: config.key });
      analytics.signUp('email');
      setIsUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isUnlocked) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} pt-20`}>
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="text-green-500" size={40} />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              You're In, {firstName}!
            </h2>

            <p className="mt-4 text-gray-500 max-w-md mx-auto">
              Check your email at <strong>{email}</strong> — we've sent your access link.
              {whatsapp && " We'll also send you tips via WhatsApp!"}
            </p>

            {/* Access Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              {config.externalUrl ? (
                <a
                  href={config.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${config.gradient} text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all`}
                >
                  Open {config.title.replace('Free ', '')}
                  <ExternalLink size={20} />
                </a>
              ) : (
                <a
                  href={config.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${config.gradient} text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all`}
                >
                  Download Now
                  <ArrowRight size={20} />
                </a>
              )}
            </motion.div>

            {/* Upsell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-12 p-6 bg-gradient-to-r ${config.bgGradient} rounded-2xl border-2 ${config.borderColor}`}
            >
              <span className={`inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r ${config.gradient} rounded-full mb-4`}>
                RECOMMENDED NEXT STEP
              </span>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {config.upsell.name}
              </h3>

              <p className="text-gray-600 mb-4">
                {config.upsell.description}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className={`text-3xl font-bold text-${config.color}-600`}>${config.upsell.price}</span>
                <span className="text-lg text-gray-400 line-through">${config.upsell.originalPrice}</span>
              </div>

              <button
                onClick={() => navigate(config.upsell.link)}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all`}
              >
                Get {config.upsell.name}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Landing page state
  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} pt-20`}>
      <section className="py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Sales Copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold text-sm mb-6`}>
                100% FREE — No Credit Card Required
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                {config.headline}
              </h1>

              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                {config.subheadline}
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {config.stats.map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white shadow-sm">
                    <div className={`text-2xl font-bold text-${config.color}-600`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3">
                {config.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className={`text-${config.color}-500 shrink-0`} size={20} />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 italic">"{config.testimonial.quote}"</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white font-bold`}>
                    {config.testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{config.testimonial.name}</p>
                    <p className="text-xs text-gray-500">{config.testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Capture Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 ${config.borderColor}`}>
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${config.gradient} flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get Instant Access
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Enter your details below
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-green-500" />
                        WhatsApp Number
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="+27 82 123 4567"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Get bonus tips & reminders via WhatsApp
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Zap className="mr-2" size={20} />
                        Get Free Access Now
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Instant access. No credit card. No spam.
                  </p>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield size={14} className="text-green-500" />
                      Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-green-500" />
                      {config.stats[1].value} Users
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500" />
                      4.9/5 Rating
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
