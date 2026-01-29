import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight, Star, Shield, Zap, Calculator, Receipt, PiggyBank, AlertTriangle, Download } from 'lucide-react';
import { IMAGES } from '../config/assets';

export default function TaxGuideProduct() {
  const topics = [
    { icon: Calculator, title: 'Income Tax Basics', desc: 'Understand how creator income is taxed' },
    { icon: Receipt, title: 'Deductible Expenses', desc: 'Maximize your legitimate deductions' },
    { icon: AlertTriangle, title: 'VDP Process', desc: 'Voluntary Disclosure Programme explained' },
    { icon: PiggyBank, title: 'The 35% Rule', desc: 'Strategic tax planning for creators' },
  ];

  return (
    <div className="bg-dark-500 pt-20">
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
                SA Creator Tax Guide
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                Tax Guide for{' '}
                <span className="text-gradient-gold">Contentpreneurs</span>
              </h1>

              <p className="mt-6 text-body-lg text-white/70 max-w-xl">
                The complete SARS compliance guide for South African content creators.
                Understand your tax obligations, maximize deductions, and stay on the right side of the law.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-white/70">
                  <FileText className="mr-2 text-gold-500" size={18} />
                  <span>6 Tax Types Covered</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Calculator className="mr-2 text-gold-500" size={18} />
                  <span>Deduction Checklist</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>PDF Download</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$47</span>
                <span className="text-2xl text-white/40 line-through">$97</span>
                <span className="badge badge-success">52% OFF</span>
              </div>

              <Link
                to="/checkout/tax-guide"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get the Tax Guide
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
                    src={IMAGES.taxGuideMockup}
                    alt="Tax Guide for Contentpreneurs"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why You Need This */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 text-center"
          >
            <AlertTriangle size={48} className="text-warning-400 mx-auto mb-6" />
            <h2 className="text-section text-white mb-4">
              Are You Tax Compliant as a <span className="text-gradient-gold">Content Creator?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              SARS is cracking down on undeclared online income. Many creators don't realize they're breaking the law
              by not declaring sponsorship deals, affiliate income, and digital product sales.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              {[
                "You've earned money from brand deals or sponsorships",
                "You sell digital products or receive affiliate commissions",
                "You're unsure what expenses you can deduct",
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-3 text-white/70">
                  <CheckCircle className="text-error-400 shrink-0 mt-1" size={16} />
                  <span className="text-sm">{problem}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Covered */}
      <section className="py-20 md:py-28 bg-dark-500 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Inside</span>
            <h2 className="text-section md:text-section-lg text-white">
              Everything You Need for <span className="text-gradient-gold">Tax Compliance</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                    <topic.icon size={24} className="text-dark-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{topic.title}</h3>
                    <p className="mt-1 text-sm text-white/50">{topic.desc}</p>
                  </div>
                </div>
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
              <h3 className="font-semibold text-white mb-4">Also Includes:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Complete VDP (Voluntary Disclosure) walkthrough',
                  '6 types of taxes explained simply',
                  'Deductible expenses checklist',
                  'When to register as provisional taxpayer',
                  'Record-keeping requirements',
                  'Common mistakes to avoid',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle size={16} className="text-success-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
            <span className="badge badge-gold mb-4">Success Stories</span>
            <h2 className="text-section md:text-section-lg text-white">
              Creators Who Got <span className="text-gradient-gold">Tax Compliant</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I was terrified about my undeclared income from 3 years of content creation. This guide walked me through the VDP process and I'm now fully compliant. Wish I had this earlier!",
                name: "Themba M.",
                role: "YouTube Creator",
                result: "Fully compliant",
              },
              {
                quote: "The deduction checklist alone saved me R12,000 in taxes. I had no idea I could claim my home office, equipment, and internet as business expenses.",
                name: "Palesa K.",
                role: "Instagram Influencer",
                result: "R12K saved",
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
              Get Tax Compliant <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Don't wait for SARS to come knocking. Get the complete guide and protect your content business.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$47</span>
              <span className="text-2xl text-white/30 line-through">$97</span>
            </div>

            <Link
              to="/checkout/tax-guide"
              className="btn-primary btn-lg inline-flex group"
            >
              Get the Tax Guide
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
