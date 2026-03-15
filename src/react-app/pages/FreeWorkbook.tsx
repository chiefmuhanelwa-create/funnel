import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Loader2, ArrowRight } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface FreeWorkbookProps {
  leadMagnet: string;
}

export default function FreeWorkbook({ leadMagnet }: FreeWorkbookProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const workbookConfig: Record<string, { title: string; description: string; benefits: string[]; upsell: { name: string; description: string; price: number; originalPrice: number; link: string } }> = {
    'paids-workbook': {
      title: 'PAIDS Framework Workbook',
      description: 'Master the 5 pillars of content success with this actionable workbook.',
      benefits: [
        'Step-by-step exercises for each PAIDS pillar',
        'Real examples from successful creators',
        'Templates you can use immediately',
        'Worksheet to plan your content strategy',
      ],
      upsell: {
        name: 'Contentpreneur Starter Kit',
        description: '9-module system to monetize your content',
        price: 67,
        originalPrice: 197,
        link: '/checkout/starter-kit',
      },
    },
    'niche-finder': {
      title: 'Niche Finder Workbook',
      description: 'Discover your perfect content niche and stand out from the crowd.',
      benefits: [
        'Identify profitable niche opportunities',
        'Analyze your competition effectively',
        'Find gaps in the market',
        'Position yourself as an authority',
      ],
      upsell: {
        name: 'Contentpreneur Starter Kit',
        description: '9-module system to monetize your content',
        price: 67,
        originalPrice: 197,
        link: '/checkout/starter-kit',
      },
    },
  };

  const config = workbookConfig[leadMagnet] || workbookConfig['paids-workbook'];

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
          leadMagnet,
          source: 'website',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Track lead
      analytics.generateLead({ source: leadMagnet });
      analytics.signUp('email');

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16">
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
            </p>

            {/* Download Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <a
                href={`/books/${leadMagnet}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download size={20} />
                Download {config.title}
              </a>
            </motion.div>

            {/* Upsell Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200"
            >
              <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                RECOMMENDED NEXT STEP
              </span>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {config.upsell.name}
              </h3>

              <p className="text-gray-600 mb-4">
                {config.upsell.description}
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-purple-600">${config.upsell.price}</span>
                <span className="text-lg text-gray-400 line-through">${config.upsell.originalPrice}</span>
              </div>

              <Link
                to={config.upsell.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Get {config.upsell.name}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-full mb-4">
              Free Download
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {config.title}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {config.description}
            </p>

            <ul className="mt-8 space-y-4">
              {config.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <CheckCircle className="text-green-500 mr-3 shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
              <Download size={20} />
              <span>Instant PDF download • No credit card required</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get Your Free Copy
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    placeholder="John"
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
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Download className="mr-2" size={20} />
                      Get Free Workbook
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By signing up, you agree to receive emails from Contentpreneur Hub.
                  You can unsubscribe anytime.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
