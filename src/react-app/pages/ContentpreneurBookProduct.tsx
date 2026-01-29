import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Star,
  Shield,
  Zap,
  Users,
  Target,
  TrendingUp,
  Package,
  Truck,
} from 'lucide-react';
import { IMAGES } from '../config/assets';

export default function ContentpreneurBookProduct() {
  const chapters = [
    'The Contentpreneur Mindset',
    'Discovering Your Niche',
    'Building Your Brand Identity',
    'Content Strategy That Converts',
    'Mastering Social Media Algorithms',
    'Monetization Models Decoded',
    'The PAIDS Framework',
    'Scaling Your Content Business',
    'Building Systems & Teams',
    'Your 90-Day Launch Plan',
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
                <BookOpen size={12} className="mr-1" />
                eBook + Physical Book
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                The Contentpreneur{' '}
                <span className="text-gradient-gold">Guide</span>
              </h1>

              <p className="mt-6 text-body-lg text-white/70 max-w-xl">
                The definitive guide to building a profitable content business.
                Get both the digital eBook for instant access and a beautiful
                printed copy delivered to your door.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-white/70">
                  <BookOpen className="mr-2 text-gold-500" size={18} />
                  <span>10 Chapters</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Package className="mr-2 text-gold-500" size={18} />
                  <span>eBook + Print</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Truck className="mr-2 text-gold-500" size={18} />
                  <span>Free Shipping (SA)</span>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-gradient-gold">$27</span>
                  <span className="text-2xl text-white/40 line-through">$47</span>
                  <span className="badge badge-success">43% OFF</span>
                </div>
                <p className="text-sm text-white/50">
                  Includes instant eBook download + physical book delivery
                </p>
              </div>

              <Link
                to="/checkout/contentpreneur-book"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get Both Versions
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <div className="mt-6 flex items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-success-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold-500" />
                  <span>Instant eBook Access</span>
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
                    src={IMAGES.influencersCodeMockup}
                    alt="The Contentpreneur Guide - Book Cover"
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-success">
                      <Package size={12} className="mr-1" />
                      Bundle Deal
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Inside</span>
            <h2 className="text-section md:text-section-lg text-white">
              10 Chapters of <span className="text-gradient-gold">Pure Value</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              Everything you need to go from zero to profitable contentpreneur
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {chapters.map((chapter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center text-dark-500 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-white">{chapter}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Benefits */}
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
              <Package size={12} className="mr-1" />
              Bundle Benefits
            </span>
            <h2 className="text-section md:text-section-lg text-white">
              Why Get <span className="text-gradient-gold">Both Versions?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                  <Zap className="text-accent-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Digital eBook</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Instant download access',
                  'Read on any device',
                  'Search and highlight',
                  'Clickable resource links',
                  'Free lifetime updates',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-accent-400 shrink-0" size={16} />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                  <BookOpen className="text-gold-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Physical Book</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Premium quality print',
                  'No screen fatigue',
                  'Write notes in margins',
                  'Display on your shelf',
                  'Gift to a friend',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-gold-500 shrink-0" size={16} />
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
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
            <span className="badge badge-gold mb-4">Reader Reviews</span>
            <h2 className="text-section md:text-section-lg text-white">
              What Readers Are <span className="text-gradient-gold">Saying</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "The physical book is beautiful. I keep it on my desk as a constant reminder of my goals.",
                name: "Amanda T.",
                role: "Content Creator",
              },
              {
                quote: "Having both versions is perfect. I use the eBook for reference and the physical copy for deep reading.",
                name: "Michael R.",
                role: "Digital Entrepreneur",
              },
              {
                quote: "The PAIDS framework chapter alone is worth 10x the price. This book changed my business.",
                name: "Precious N.",
                role: "Lifestyle Blogger",
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
                <p className="text-white/70 mb-6 text-sm">"{testimonial.quote}"</p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-20 md:py-28 bg-dark-500">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Truck className="text-gold-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Shipping Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">South Africa</h4>
                <p className="text-sm text-white/60">
                  Free shipping on all orders. Delivery within 5-7 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">International</h4>
                <p className="text-sm text-white/60">
                  Flat rate shipping available. Delivery within 10-14 business days.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/40">
              You'll receive your eBook immediately after purchase. Physical book shipping details will be sent via email.
            </p>
          </motion.div>
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
              Get the Complete <span className="text-gradient-gold">Package</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              eBook for convenience, print for impact. Why choose when you can have both?
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$27</span>
              <span className="text-2xl text-white/30 line-through">$47</span>
            </div>

            <Link
              to="/checkout/contentpreneur-book"
              className="btn-primary btn-lg inline-flex group"
            >
              Get Both Versions Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-gold-500" />
                <span>Free SA Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
