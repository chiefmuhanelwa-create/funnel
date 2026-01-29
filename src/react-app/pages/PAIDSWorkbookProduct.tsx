import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight, ArrowLeft, Star, Shield, Zap, Package, Megaphone, Info, Users, Wrench, Download } from 'lucide-react';
import { IMAGES } from '../config/assets';

export default function PAIDSWorkbookProduct() {
  const pillars = [
    { icon: Package, title: 'Products', desc: 'Create digital products that sell while you sleep', letter: 'P' },
    { icon: Megaphone, title: 'Ads & Affiliates', desc: 'Monetize your audience with strategic promotions', letter: 'A' },
    { icon: Info, title: 'Information', desc: 'Package your knowledge into paid content', letter: 'I' },
    { icon: Users, title: 'Deals', desc: 'Land lucrative brand partnerships', letter: 'D' },
    { icon: Wrench, title: 'Services', desc: 'Offer high-ticket consulting and services', letter: 'S' },
  ];

  return (
    <div className="bg-dark-500 pt-20">
      {/* Back Navigation */}
      <div className="container-content pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="glow-orb w-96 h-96 -top-48 -right-48 opacity-30" />
        <div className="glow-orb-accent w-80 h-80 bottom-0 -left-40 opacity-20" />

        <div className="container-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-gold mb-4">
                <FileText size={12} className="mr-1" />
                Implementation Workbook
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                PAIDS Framework{' '}
                <span className="text-gradient-gold">Workbook</span>
              </h1>

              <p className="mt-6 text-body-lg text-white/70 max-w-xl">
                The proven 5-pillar system for building multiple income streams as a content creator.
                Stop relying on a single revenue source and build a sustainable creator business.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-white/70">
                  <FileText className="mr-2 text-gold-500" size={18} />
                  <span>5 Modules</span>
                </div>
                <div className="flex items-center text-white/70">
                  <CheckCircle className="mr-2 text-gold-500" size={18} />
                  <span>Worksheets Included</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>PDF Download</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$17</span>
                <span className="text-2xl text-white/40 line-through">$27</span>
                <span className="badge badge-success">37% OFF</span>
              </div>

              <Link
                to="/checkout/paids-workbook"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get the Framework
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <div className="mt-6 flex items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-success-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold-500" />
                  <span>Instant Download</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-4 glow-gold">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={IMAGES.paidsWorkbookMockup}
                    alt="PAIDS Framework Workbook"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is PAIDS */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">The Framework</span>
            <h2 className="text-section md:text-section-lg text-white">
              5 Pillars of Creator <span className="text-gradient-gold">Income</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              The PAIDS Framework gives you 5 proven ways to monetize your content and audience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center text-dark-500 font-bold text-2xl mx-auto mb-4">
                  {pillar.letter}
                </div>
                <h3 className="font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/50">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-success mb-4">
              <CheckCircle size={12} className="mr-1" />
              What's Included
            </span>
            <h2 className="text-section md:text-section-lg text-white">
              Everything You Need to <span className="text-gradient-gold">Implement PAIDS</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'PAIDS Overview Guide', desc: 'Understand each pillar and how they work together' },
              { title: 'Product Brainstorm Worksheet', desc: 'Identify digital products you can create' },
              { title: 'Affiliate Strategy Planner', desc: 'Find and promote products your audience needs' },
              { title: 'Info Product Templates', desc: 'Outlines for courses, ebooks, and guides' },
              { title: 'Brand Deal Calculator', desc: 'Price your sponsorships correctly' },
              { title: 'Services Pricing Guide', desc: 'Set rates for consulting and freelance work' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-success-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 text-center"
          >
            <h2 className="text-section text-white mb-6">
              Creators Using PAIDS Have Generated{' '}
              <span className="text-gradient-gold">Over $2M</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { stat: '$2M+', label: 'Total Creator Revenue' },
                { stat: '10K+', label: 'Framework Users' },
                { stat: '5', label: 'Income Streams' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-gradient-gold">{item.stat}</div>
                  <div className="text-white/60 mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-dark-500">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Success Stories</span>
            <h2 className="text-section md:text-section-lg text-white">
              Real Results from <span className="text-gradient-gold">Real Creators</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "Before PAIDS, I only made money from ads. Now I have 4 income streams and my revenue has tripled. The worksheets made implementation so easy.",
                name: "Thabang K.",
                role: "YouTube Creator",
                result: "3x revenue",
              },
              {
                quote: "The brand deal calculator alone was worth the price. I was undercharging by 50% before I learned how to properly value my audience.",
                name: "Lesedi M.",
                role: "Instagram Influencer",
                result: "2x sponsorship rates",
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
              Build Multiple Income Streams{' '}
              <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Get the complete PAIDS Framework workbook and start diversifying your creator income
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$17</span>
              <span className="text-2xl text-white/30 line-through">$27</span>
            </div>

            <Link
              to="/checkout/paids-workbook"
              className="btn-primary btn-lg inline-flex group"
            >
              Get the Framework
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-gold-500" />
                <span>Instant Download</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
