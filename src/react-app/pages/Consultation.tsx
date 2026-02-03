import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  MessageSquare,
  Target,
  FileText,
  Shield,
  Award,
  Users,
  TrendingUp,
} from 'lucide-react';

// Calendly URL - update this with your actual Calendly link
const CALENDLY_URL = 'https://calendly.com/chiefmuhanelwa/contentpreneurship';

export default function Consultation() {
  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-white pt-20">
      {/* Back Navigation */}
      <div className="container-content pt-6">
        <Link
          to="/products/coaching"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Coaching
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="badge badge-gold mb-4">
                <Calendar size={12} className="mr-1" />
                Book Your Session
              </span>
              <h1 className="text-section md:text-section-lg text-gray-900">
                1:1 Strategy <span className="text-gradient-gold">Session</span>
              </h1>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                60 minutes of personalized guidance from someone who built 3M+ followers
                and generates R300K+/month. Select your preferred time below.
              </p>

              {/* Price Display */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <span className="text-4xl font-bold text-gradient-gold">$497</span>
                <span className="text-lg text-gray-400 line-through">$997</span>
                <span className="badge badge-success">50% OFF</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendly Embed Section */}
      <section className="pb-12 md:pb-20">
        <div className="container-content">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Calendly Widget - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-4 md:p-6 overflow-hidden">
                <div
                  className="calendly-inline-widget"
                  data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=1f2937&primary_color=f59e0b`}
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* What You Get */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-gold-500" />
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Clock, text: '60-minute video call' },
                    { icon: Video, text: 'Via Zoom (link provided)' },
                    { icon: FileText, text: '90-day action plan' },
                    { icon: MessageSquare, text: '7-day email follow-up' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                        <item.icon size={16} className="text-gold-500" />
                      </div>
                      <span className="text-sm text-gray-600">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Credibility */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={18} className="text-gold-500" />
                  Your Coach
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, stat: '3M+', label: 'Followers Built' },
                    { icon: TrendingUp, stat: '50+', label: 'Brand Deals' },
                    { icon: Award, stat: '8', label: 'Industry Awards' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <item.icon size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">{item.stat}</span>
                        <span className="text-sm text-gray-500 ml-1">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantee */}
              <div className="glass-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-green-600" />
                  Satisfaction Guaranteed
                </h3>
                <p className="text-sm text-gray-600">
                  If you implement the strategies and don't find value, I'll offer another
                  session or a full refund within 7 days. Your success is my success.
                </p>
              </div>

              {/* Questions */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Have Questions?</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Email us at{' '}
                  <a
                    href="mailto:hello@contentpreneurhub.online"
                    className="text-gold-500 hover:text-gold-400 font-medium"
                  >
                    hello@contentpreneurhub.online
                  </a>
                </p>
                <p className="text-xs text-gray-400">
                  Response time: 24-48 hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We'll Cover */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What We'll <span className="text-gradient-gold">Cover</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Your session is completely customized to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Content Strategy',
                desc: 'Using the 4E Evolution framework to create content that converts',
              },
              {
                title: 'Monetization',
                desc: 'Implementing the 5-pillar PAIDS system for multiple income streams',
              },
              {
                title: 'Audience Growth',
                desc: 'Applying the MS×TS×SS equation to break through plateaus',
              },
              {
                title: 'Brand Deals',
                desc: 'Pricing, negotiation, and outreach tactics that actually work',
              },
              {
                title: 'Platform Strategy',
                desc: 'YouTube, TikTok, Instagram, X - which to prioritize and how',
              },
              {
                title: 'Your Challenges',
                desc: 'Specific roadblocks and obstacles you're facing right now',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-success-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
