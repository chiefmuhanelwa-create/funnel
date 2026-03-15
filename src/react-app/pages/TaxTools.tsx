import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Calculator,
  FileText,
  BookOpen,
  Loader2,
  ArrowRight,
  Shield,
  Users,
  Star,
  Zap,
  ExternalLink,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { analytics } from '../utils/analytics';
import SocialProof from '../components/conversion/SocialProof';

const EXTERNAL_TOOL_URL = 'https://contentprenuership.com';

export default function TaxTools() {
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
          leadMagnet: 'tax-calculator',
          source: 'tax-tools-landing',
          externalToolUrl: EXTERNAL_TOOL_URL,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      analytics.generateLead({ source: 'tax-calculator' });
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20">
        <div className="container-content py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto"
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

            {/* Tools Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 grid md:grid-cols-3 gap-6"
            >
              {/* Tax Calculator */}
              <div className="p-6 bg-white rounded-2xl border-2 border-emerald-200 shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Calculator size={28} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tax Calculator</h3>
                <p className="text-sm text-gray-500 mb-4">Calculate your creator tax obligations</p>
                <a
                  href={EXTERNAL_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Open Tool
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Invoice Generator */}
              <div className="p-6 bg-white rounded-2xl border-2 border-blue-200 shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Invoice Generator</h3>
                <p className="text-sm text-gray-500 mb-4">Create professional invoices</p>
                <a
                  href={EXTERNAL_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Open Tool
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Tax Guide Preview */}
              <div className="p-6 bg-white rounded-2xl border-2 border-amber-200 shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tax Guide (Preview)</h3>
                <p className="text-sm text-gray-500 mb-4">115-page comprehensive guide</p>
                <Link
                  to="/checkout/tax-guide"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Get Full Guide
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Embedded Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Use the Tools Below</h3>
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">contentprenuership.com</span>
                  <a
                    href={EXTERNAL_TOOL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    Open in new tab <ExternalLink size={12} />
                  </a>
                </div>
                <iframe
                  src={EXTERNAL_TOOL_URL}
                  className="w-full h-[700px] bg-white"
                  title="Tax Calculator & Invoice Generator"
                />
              </div>
            </motion.div>

            {/* Upsell: Full Tax Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">
                  Did you know? SARS penalties for non-compliance can be up to 200% of unpaid taxes.
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get the Complete 115-Page Tax Guide
              </h3>

              <p className="text-gray-600 mb-4">
                The free tools help with calculations, but the full <strong>Tax Guide for Contentpreneurs</strong> includes:
              </p>

              <div className="grid md:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-6">
                {[
                  'VDP (Voluntary Disclosure Programme) walkthrough',
                  'All 6 tax types explained simply',
                  'The 35% rule strategy to save thousands',
                  'Complete deduction checklist',
                  'SARS audit preparation guide',
                  'Template letters and forms',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-emerald-600">$47</span>
                <span className="text-lg text-gray-400 line-through">$97</span>
                <span className="px-2 py-1 text-xs font-bold text-white bg-emerald-500 rounded">52% OFF</span>
              </div>

              <Link
                to="/checkout/tax-guide"
                className="btn-primary inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
              >
                <Download size={18} />
                Get the Full Tax Guide
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                Instant PDF download • 30-day money-back guarantee
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

  // Locked state - show landing page with email capture
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20">
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
                <span className="badge bg-emerald-500/20 text-emerald-700 border-emerald-300">FREE TOOLS</span>
                <SocialProof variant="viewers" minViewers={3} maxViewers={12} className="text-xs" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Creator Tax Tools{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-600">
                Free tax calculator + invoice generator built specifically for South African content creators. Stay SARS compliant without the headache.
              </p>

              {/* Warning Badge */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-amber-800">Are you tax compliant?</p>
                    <p className="text-sm text-amber-700 mt-1">
                      SARS is actively targeting content creators. Don't get caught unprepared.
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-gray-900">What You Get (Free):</h3>
                {[
                  { icon: Calculator, text: 'Tax Calculator - Calculate your tax obligations instantly' },
                  { icon: FileText, text: 'Invoice Generator - Create professional invoices for brand deals' },
                  { icon: BookOpen, text: 'Tax Guide Preview - Sample pages from the 115-page guide' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">R12K+</div>
                  <div className="text-xs text-gray-500 mt-1">Avg Tax Saved</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">2,000+</div>
                  <div className="text-xs text-gray-500 mt-1">Creators Protected</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-xs text-gray-500 mt-1">SARS Compliant</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Email Capture Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8 md:p-10 border-2 border-emerald-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Unlock Free Tax Tools
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Get instant access to all tools
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
                    className="w-full btn-primary btn-lg disabled:opacity-50 bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Unlocking...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Zap className="mr-2" size={20} />
                        Get Free Access
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
                      <Shield size={14} className="text-emerald-500" />
                      SARS Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-emerald-500" />
                      2,000+ Users
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500" />
                      4.8/5 Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 italic">
                  "I had no idea about my tax obligations as a content creator. These tools helped me get compliant and I even got a refund from SARS!"
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Thabo K.</p>
                    <p className="text-xs text-gray-500">Tech Creator, 120K subscribers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What's Included</h2>
            <p className="text-gray-500 mt-2">Everything you need to stay tax compliant</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: 'Tax Calculator',
                description: 'Calculate your provisional tax, VAT obligations, and annual tax liability based on your creator income.',
                features: ['Income tax calculation', 'VAT threshold checker', 'Provisional tax estimates'],
                color: 'emerald',
              },
              {
                icon: FileText,
                title: 'Invoice Generator',
                description: 'Create professional invoices for brand deals and sponsored content in seconds.',
                features: ['SARS-compliant format', 'Auto VAT calculation', 'Brand-ready templates'],
                color: 'blue',
              },
              {
                icon: BookOpen,
                title: 'Tax Guide (Preview)',
                description: 'Get a preview of the comprehensive 115-page tax guide for contentpreneurs.',
                features: ['6 tax types explained', 'VDP process overview', 'Deduction checklist'],
                color: 'amber',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-2xl"
              >
                <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-4`}>
                  <item.icon size={28} className={`text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className={`text-${item.color}-500`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-tight">
          <div className="glass-card p-8 md:p-12 text-center border-2 border-emerald-200">
            <Shield size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              Don't Wait for a SARS Letter
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Get ahead of potential issues. These free tools take less than 5 minutes to use and could save you thousands in penalties.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary btn-lg mt-8 bg-emerald-500 hover:bg-emerald-600"
            >
              Get Free Access Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
