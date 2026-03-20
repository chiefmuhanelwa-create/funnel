import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  DollarSign,
  TrendingUp,
  Calculator,
  Loader2,
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { analytics } from '../utils/analytics';
import SocialProof from '../components/conversion/SocialProof';

const EXTERNAL_TOOL_URL = 'https://collab-value.lovable.app/';

export default function RateCardPro() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

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
          leadMagnet: 'ratecard-pro',
          source: 'ratecard-landing',
          externalToolUrl: EXTERNAL_TOOL_URL,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      analytics.generateLead({ source: 'ratecard-pro' });
      analytics.signUp('email');
      setIsUnlocked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Unlocked state - show tool access
  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
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

            {/* Tool Access Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <a
                href={EXTERNAL_TOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-lg inline-flex items-center gap-2"
              >
                Open RateCard Pro
                <ExternalLink size={18} />
              </a>
            </motion.div>

            {/* Embedded Tool Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">collab-value.lovable.app</span>
                </div>
                <iframe
                  src={EXTERNAL_TOOL_URL}
                  className="w-full h-[600px] bg-white"
                  title="RateCard Pro Calculator"
                />
              </div>
            </motion.div>

            {/* Upsell Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                RECOMMENDED NEXT STEP
              </span>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Want to Land More Brand Deals?
              </h3>

              <p className="text-gray-600 mb-4">
                Now that you know your rates, learn how to pitch brands and close deals with <strong>The Influencer's Code</strong>.
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gradient-gold">R249</span>
                <span className="text-lg text-gray-400 line-through">R499</span>
              </div>

              <Link
                to="/checkout/influencers-code"
                className="btn-primary inline-flex items-center gap-2"
              >
                Get The Influencer's Code
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <Link to="/" className="mt-8 inline-block text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Locked state - show landing page with email capture
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Sales Copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 text-sm">
                ← Back to Home
              </Link>

              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-gold">FREE TOOL</span>
                <SocialProof variant="viewers" minViewers={4} maxViewers={15} className="text-xs" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Calculate Your{' '}
                <span className="text-gradient-gold">Influencer Rates</span>
              </h1>

              <p className="mt-6 text-xl text-gray-600">
                Stop undercharging for your content. Use RateCard Pro to calculate exactly what brands should pay you based on your metrics.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-gradient-gold">47%</div>
                  <div className="text-xs text-gray-500 mt-1">Avg Rate Increase</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-gradient-gold">3,500+</div>
                  <div className="text-xs text-gray-500 mt-1">Creators Using It</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-gradient-gold">R50K+</div>
                  <div className="text-xs text-gray-500 mt-1">Deals Calculated</div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3">
                {[
                  'Calculate rates for posts, reels, stories, and TikToks',
                  'Factor in engagement rate, niche, and exclusivity',
                  'Get benchmark rates for your follower count',
                  'Export professional rate cards for brands',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-success-400 shrink-0" size={20} />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Email Capture Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-gray-900" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get Free Access
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Enter your details to unlock the calculator instantly
                  </p>
                </div>

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
                        Unlocking...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Zap className="mr-2" size={20} />
                        Unlock Free Calculator
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Instant access. No credit card required.
                  </p>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield size={14} className="text-success-400" />
                      Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-success-400" />
                      3,500+ Users
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500" />
                      4.9/5 Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 italic">
                  "I was charging R2,000 per post. After using RateCard Pro, I realized I should be charging R8,500. My next brand deal paid 4x more!"
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-gray-900 font-bold">
                    N
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Naledi M.</p>
                    <p className="text-xs text-gray-500">Lifestyle Creator, 45K followers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Get your rates in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Your Metrics',
                description: 'Add your follower count, engagement rate, and niche',
                icon: Users,
              },
              {
                step: '2',
                title: 'Choose Content Type',
                description: 'Select posts, reels, stories, or custom packages',
                icon: Calculator,
              },
              {
                step: '3',
                title: 'Get Your Rates',
                description: 'See recommended rates with industry benchmarks',
                icon: DollarSign,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 text-gray-900 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 mt-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-tight">
          <div className="glass-card p-8 md:p-12 text-center">
            <TrendingUp size={48} className="text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              Stop Leaving Money on the Table
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Most creators undercharge by 40-60%. Know your worth and charge what you deserve.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary btn-lg mt-8"
            >
              Get Free Access Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
