import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Video,
  FileText,
  Gift,
  Clock,
  Shield,
  Quote,
} from 'lucide-react';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div className="bg-dark-500">
      <Hero />

      {/* Pain Point Section */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="glow-orb w-96 h-96 -top-48 -right-48 opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="badge badge-accent mb-4">Sound Familiar?</span>
            <h2 className="text-section md:text-section-lg text-white">
              You're Creating Content, But{' '}
              <span className="text-gradient-gold">Nobody's Buying</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Posting consistently but getting crickets",
                desc: "You show up every day, but your engagement stays flat and your audience doesn't grow.",
              },
              {
                title: "No idea what products to create",
                desc: "You have skills to share but don't know what your audience actually wants to buy.",
              },
              {
                title: "Watching others succeed while you struggle",
                desc: "Creators with less experience are making sales while you can't figure out what's missing.",
              },
              {
                title: "Overwhelmed by all the 'strategies'",
                desc: "Every guru has different advice, and you're paralyzed by conflicting information.",
              },
              {
                title: "Trading time for money with no end",
                desc: "You're working harder than ever but not building anything sustainable.",
              },
              {
                title: "Feeling like a fraud",
                desc: "Imposter syndrome keeps you from putting yourself out there and charging what you're worth.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-error-500/10 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              These aren't character flaws. <span className="text-gold-500 font-medium">You're just missing a system.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Intro */}
      <section className="py-20 md:py-28 section-gradient relative overflow-hidden">
        <div className="glow-orb-accent w-80 h-80 -bottom-40 -left-40 opacity-20" />

        <div className="container-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-gold mb-4">The Solution</span>
              <h2 className="text-section md:text-section-lg text-white mb-6">
                Introducing the{' '}
                <span className="text-gradient-gold">PAIDS Framework</span>
              </h2>
              <p className="text-white/70 text-lg mb-8">
                A proven 5-pillar system that transforms content creators into profitable
                business owners. No guesswork. No overwhelm. Just clear steps to monetize
                your expertise.
              </p>

              <div className="space-y-4">
                {[
                  'Build a magnetic personal brand that attracts buyers',
                  'Create products your audience actually wants',
                  'Set up systems that sell while you sleep',
                  'Scale without burning out',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/contentpreneur-starter-kit" className="btn-primary mt-10 inline-flex">
                Learn the Framework
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Creator image/illustration placeholder */}
              <div className="glass-card p-8">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold-500/20 to-accent-500/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-gold flex items-center justify-center text-dark-500 text-3xl font-bold mb-4">
                      MN
                    </div>
                    <p className="text-white font-medium">Your Guide</p>
                    <p className="text-white/50 text-sm">Founder & Creator</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PAIDS Framework Breakdown */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">The System</span>
            <h2 className="text-section md:text-section-lg text-white">
              5 Pillars to <span className="text-gradient-gold">Content Profits</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              Master each pillar and watch your content business transform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                letter: 'P',
                title: 'Positioning',
                desc: 'Define your unique space',
                icon: Target,
                color: 'gold',
              },
              {
                letter: 'A',
                title: 'Audience',
                desc: 'Know who you serve',
                icon: Users,
                color: 'accent',
              },
              {
                letter: 'I',
                title: 'Income',
                desc: 'Multiple revenue streams',
                icon: DollarSign,
                color: 'success',
              },
              {
                letter: 'D',
                title: 'Distribution',
                desc: 'Get seen by the right people',
                icon: TrendingUp,
                color: 'gold',
              },
              {
                letter: 'S',
                title: 'Systems',
                desc: 'Automate and scale',
                icon: Zap,
                color: 'accent',
              },
            ].map((item, index) => (
              <motion.div
                key={item.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover text-center group"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-${item.color} flex items-center justify-center text-dark-500 text-2xl font-bold mb-4 group-hover:glow-gold transition-all`}>
                  {item.letter}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 section-gradient relative overflow-hidden">
        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What You Get</span>
            <h2 className="text-section md:text-section-lg text-white">
              Everything You Need to <span className="text-gradient-gold">Succeed</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Resource */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card card-hover"
            >
              <div className="text-center">
                <span className="badge badge-success mb-4">Free</span>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-gold-500" />
                </div>
                <h3 className="text-xl font-bold text-white">PAIDS Workbook</h3>
                <p className="mt-2 text-white/50 text-sm">Start your journey with our free workbook</p>
                <div className="mt-6 text-4xl font-bold text-gradient-gold">$0</div>
                <Link to="/free/paids-workbook" className="btn-secondary w-full mt-6">
                  Download Free
                </Link>
              </div>
            </motion.div>

            {/* Starter Kit - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-featured relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge bg-gradient-gold text-dark-500">Most Popular</span>
              </div>
              <div className="text-center pt-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                  <Video size={28} className="text-dark-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Starter Kit</h3>
                <p className="mt-2 text-white/50 text-sm">Complete 9-module course + bonus workbooks</p>

                <ul className="mt-6 space-y-2 text-left">
                  {[
                    '9 Video Modules',
                    'PAIDS Implementation Workbook',
                    'Content Calendar Template',
                    'Private Community Access',
                    'Lifetime Updates',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle size={16} className="text-gold-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <div className="text-4xl font-bold text-gradient-gold">$67</div>
                  <p className="text-white/40 text-sm line-through">$197</p>
                </div>

                <Link to="/checkout/starter-kit" className="btn-primary w-full mt-6">
                  Enroll Now
                </Link>
              </div>
            </motion.div>

            {/* Pro Bundle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card card-hover"
            >
              <div className="text-center">
                <span className="badge badge-accent mb-4">Best Value</span>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-500/20 flex items-center justify-center mb-4">
                  <Gift size={28} className="text-accent-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Pro Bundle</h3>
                <p className="mt-2 text-white/50 text-sm">Everything + advanced resources & ebooks</p>
                <div className="mt-6 text-4xl font-bold text-gradient-accent">$147</div>
                <Link to="/checkout/contentpreneur-pro" className="btn-secondary w-full mt-6">
                  Get Pro Bundle
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="glow-orb w-80 h-80 top-1/2 -translate-y-1/2 -right-40 opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Success Stories</span>
            <h2 className="text-section md:text-section-lg text-white">
              Creators Who <span className="text-gradient-gold">Made It Happen</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The PAIDS Framework completely changed how I approach content creation. I went from 2K to 50K followers in 6 months!",
                name: "Sarah M.",
                role: "Lifestyle Creator",
                result: "+48K followers",
              },
              {
                quote: "Finally a system that makes sense. I landed my first brand deal within weeks of implementing what I learned.",
                name: "James K.",
                role: "Tech Reviewer",
                result: "First $5K deal",
              },
              {
                quote: "Worth every penny. The course paid for itself 10x over with my first sponsored post.",
                name: "Amara N.",
                role: "Fashion Influencer",
                result: "10x ROI",
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
                <Quote size={24} className="text-gold-500/30 mb-4" />
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
                  <div className="badge badge-success">{testimonial.result}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 text-center glow-gold"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-gold flex items-center justify-center mb-6">
              <Shield size={36} className="text-dark-500" />
            </div>
            <h2 className="text-section text-white mb-4">
              30-Day <span className="text-gradient-gold">Money-Back Guarantee</span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Try the Starter Kit risk-free. If you don't feel confident about monetizing
              your content after going through the course, just email us within 30 days
              for a full refund. No questions asked.
            </p>
            <Link to="/contentpreneur-starter-kit" className="btn-primary inline-flex">
              Start Risk-Free Today
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-30" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-section md:text-section-lg lg:text-hero text-white mb-6">
              Ready to Turn Your Content Into{' '}
              <span className="text-gradient-gold">Real Income</span>?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of creators who have already discovered the PAIDS Framework.
              Your journey to content success starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contentpreneur-starter-kit" className="btn-primary btn-lg">
                Get Started Today
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/free/paids-workbook" className="btn-secondary btn-lg">
                Try Free Workbook First
              </Link>
            </div>

            {/* Urgency */}
            <div className="mt-10 inline-flex items-center gap-2 text-white/50 text-sm">
              <Clock size={16} />
              <span>Limited time: Get 66% off the Starter Kit</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
