import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  Star,
  Shield,
  Video,
  Users,
  Target,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  Award,
} from 'lucide-react';
import BackButton from '../components/BackButton';

export default function CoachingProduct() {
  const sessionIncludes = [
    { icon: Video, title: '60-Minute Video Call', desc: 'One-on-one strategy session via Zoom' },
    { icon: Target, title: '90-Day Action Plan', desc: 'Custom roadmap tailored to your goals' },
    { icon: FileText, title: 'Session Recording', desc: 'Review our conversation anytime' },
    { icon: MessageSquare, title: '7-Day Follow-up', desc: 'Email support after our call' },
  ];

  const perfectFor = [
    'Content creators ready to monetize their audience',
    'Entrepreneurs building their personal brand',
    'Professionals pivoting to content creation',
    'Creators stuck at a growth plateau',
    'Anyone needing clarity on their content strategy',
  ];

  return (
    <div className="bg-dark-500 pt-20">
      {/* Back Navigation - Context aware */}
      <div className="container-content pt-6">
        <BackButton />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="glow-orb w-96 h-96 -top-48 -right-48 opacity-30" />
        <div className="glow-orb-accent w-80 h-80 bottom-0 -left-40 opacity-20" />

        <div className="container-content relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-gold mb-4">
                <Calendar size={12} className="mr-1" />
                Limited Availability
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                1-on-1 Strategy Call with{' '}
                <span className="text-gradient-gold">Mr. NoChill</span>
              </h1>

              <p className="mt-6 text-body-lg text-white/70 max-w-2xl mx-auto">
                Get personalized guidance to fast-track your content business.
                60 minutes that could change the trajectory of your entire creator career.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-white/70">
                  <Clock className="mr-2 text-gold-500" size={18} />
                  <span>60 Minutes</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Video className="mr-2 text-gold-500" size={18} />
                  <span>Via Zoom</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Award className="mr-2 text-gold-500" size={18} />
                  <span>Expert Guidance</span>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$1,500</span>
                <span className="text-xl text-white/40 line-through">$2,500</span>
                <span className="badge badge-success">40% OFF</span>
              </div>

              <Link
                to="/consultation"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Book Your Strategy Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <p className="mt-4 text-sm text-white/40">
                Only 4 spots available per month
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Included</span>
            <h2 className="text-section md:text-section-lg text-white">
              More Than Just a <span className="text-gradient-gold">Call</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              You get a complete strategy experience, not just advice
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold-500" size={28} />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We'll Cover */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-success mb-4">
                <Target size={12} className="mr-1" />
                Session Focus
              </span>
              <h2 className="text-section md:text-section-lg text-white">
                We'll Cover <span className="text-gradient-gold">Everything</span>
              </h2>
              <p className="mt-4 text-white/60">
                Your session is completely customized to your needs. Common topics include:
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Content strategy and niche positioning',
                  'Monetization models and pricing strategies',
                  'Audience growth tactics that actually work',
                  'Building systems and workflows',
                  'Brand partnerships and sponsorship outreach',
                  'Platform-specific strategies (YouTube, TikTok, IG, X)',
                  'Overcoming your specific challenges',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-success-400 shrink-0 mt-0.5" size={18} />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  This is Perfect For You If:
                </h3>
                <ul className="space-y-4">
                  {perfectFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="text-gold-500" size={14} />
                      </div>
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Client Results</span>
            <h2 className="text-section md:text-section-lg text-white">
              Transformation <span className="text-gradient-gold">Stories</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "One call with MN gave me more clarity than months of trying to figure it out alone. Within 30 days, I had my first R50K month.",
                name: "Thabo M.",
                role: "Finance Creator",
                result: "R50K/month",
              },
              {
                quote: "The 90-day roadmap was exactly what I needed. MN didn't just give advice - he gave me a clear action plan I could follow.",
                name: "Lerato K.",
                role: "Lifestyle Influencer",
                result: "First brand deal",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                  <span className="badge badge-success">{testimonial.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-dark-500">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section text-white">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How do I prepare for the call?",
                a: "After booking, you'll receive a pre-call questionnaire to help me understand your business, goals, and challenges. Come ready with your top 3 questions."
              },
              {
                q: "What if I need to reschedule?",
                a: "You can reschedule up to 24 hours before your call at no additional charge. We're flexible and want to make sure you get maximum value."
              },
              {
                q: "Is this suitable for beginners?",
                a: "Absolutely! Whether you're just starting or scaling an existing brand, I'll meet you where you are and help you move forward."
              },
              {
                q: "Do you offer refunds?",
                a: "If you feel the call didn't provide value, let me know within 7 days and I'll either offer another session or a full refund."
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-white/60">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-40" />

        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 text-center glow-gold-lg"
          >
            <h2 className="text-section md:text-section-lg text-white mb-4">
              Ready to <span className="text-gradient-gold">Level Up?</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Stop guessing and start growing with personalized expert guidance
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$1,500</span>
              <span className="text-xl text-white/30 line-through">$2,500</span>
            </div>

            <Link
              to="/consultation"
              className="btn-primary btn-lg inline-flex group"
            >
              Book Your Strategy Call
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gold-500" />
                <span>Limited Availability</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
