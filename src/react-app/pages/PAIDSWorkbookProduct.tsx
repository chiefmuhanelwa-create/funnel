import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, ArrowRight, Star, Shield, Zap, Package, Megaphone, BookOpen, Briefcase, Handshake, Download } from 'lucide-react';
import { IMAGES } from '../config/assets';
import BackButton from '../components/BackButton';

export default function PAIDSWorkbookProduct() {
  const streams = [
    { icon: Package, title: 'Products', desc: 'Digital products, merchandise, courses', letter: 'P' },
    { icon: Megaphone, title: 'Ads & Affiliates', desc: 'Brand deals and commission income', letter: 'A' },
    { icon: BookOpen, title: 'Information', desc: 'eBooks, guides, templates', letter: 'I' },
    { icon: Handshake, title: 'Deals', desc: 'Sponsorships and partnerships', letter: 'D' },
    { icon: Briefcase, title: 'Services', desc: 'Coaching, consulting, freelance', letter: 'S' },
  ];

  return (
    <div className="bg-white pt-20">
      {/* Back Navigation */}
      <div className="container-content pt-6">
        <BackButton />
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
                <DollarSign size={12} className="mr-1" />
                5 Income Streams Framework
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                PAIDS Framework{' '}
                <span className="text-gradient-gold">Workbook</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                The exact system used to build multiple income streams from content.
                Stop relying on one income source - implement the 5-stream monetization framework that generated R500K+ in 12 months.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="mr-2 text-gold-500" size={18} />
                  <span>5 Revenue Streams</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="mr-2 text-gold-500" size={18} />
                  <span>Action Worksheets</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>Instant PDF Download</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">R297</span>
                <span className="text-2xl text-gray-400 line-through">R597</span>
                <span className="badge badge-success">50% OFF</span>
              </div>

              <Link
                to="/checkout/paids-workbook"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get the PAIDS Workbook
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
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

      {/* The Problem */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 text-center"
          >
            <DollarSign size={48} className="text-warning-400 mx-auto mb-6" />
            <h2 className="text-section text-gray-900 mb-4">
              Tired of Creating Content for <span className="text-gradient-gold">Free?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              You're posting consistently, building an audience, but your bank account doesn't reflect your effort.
              It's time to turn your content into multiple income streams.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              {[
                "You're only making money from brand deals (if any)",
                "You don't know how to monetize your audience",
                "You're leaving money on the table every single day",
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="text-error-400 shrink-0 mt-1" size={16} />
                  <span className="text-sm">{problem}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The PAIDS Framework */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">The Framework</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              5 Income Streams, <span className="text-gradient-gold">One System</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              PAIDS stands for the 5 ways successful contentpreneurs monetize their influence.
              This workbook helps you implement each one.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {streams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card card-hover text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-900">{stream.letter}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{stream.title}</h3>
                <p className="mt-2 text-xs text-gray-500">{stream.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Inside the Workbook:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Revenue stream assessment',
                  'Product creation roadmap',
                  'Affiliate program selection guide',
                  'Information product templates',
                  'Brand deal rate calculator',
                  'Service offering framework',
                  'Implementation timelines',
                  'Income tracking dashboard',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-500 text-sm">
                    <CheckCircle size={16} className="text-success-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Real Results</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              What Creators Are <span className="text-gradient-gold">Achieving</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { metric: 'R500K+', label: 'Generated in 12 months using PAIDS' },
              { metric: '5', label: 'Active income streams' },
              { metric: '3M+', label: 'Audience built with this system' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl font-bold text-gradient-gold mb-2">{stat.metric}</div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "Before PAIDS, I only made money from occasional brand deals. Now I have an eBook, affiliate partnerships, and coaching clients. My income is way more consistent!",
                name: "Lerato K.",
                role: "Finance Creator",
                result: "4 income streams",
              },
              {
                quote: "The workbook helped me realize I was sitting on a goldmine. I turned my knowledge into a mini-course and made R15K in the first month!",
                name: "Kagiso D.",
                role: "Tech Reviewer",
                result: "R15K first month",
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
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                  <span className="badge badge-success">{testimonial.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Perfect For</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Who Should Get <span className="text-gradient-gold">This Workbook?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Creators Ready to Monetize",
                desc: "You have an audience (even small) and want to start making real money from your content.",
              },
              {
                title: "One-Income-Stream Creators",
                desc: "You're making some money but want to diversify and build more stable income.",
              },
              {
                title: "Aspiring Contentpreneurs",
                desc: "You want to build a content business from day one with monetization in mind.",
              },
              {
                title: "Burnt-Out Freelancers",
                desc: "You want to leverage content to create passive and semi-passive income streams.",
              },
            ].map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-success-400 shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{persona.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{persona.desc}</p>
                  </div>
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
            <h2 className="text-section md:text-section-lg text-gray-900 mb-4">
              Start Building Multiple Income Streams <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Stop leaving money on the table. Get the framework that helps creators build sustainable income from their content.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">R297</span>
              <span className="text-2xl text-gray-400 line-through">R597</span>
            </div>

            <Link
              to="/checkout/paids-workbook"
              className="btn-primary btn-lg inline-flex group"
            >
              Get the PAIDS Workbook
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
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
