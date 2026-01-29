import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowRight, Star, Shield, Zap, Target, Heart, Compass, Users } from 'lucide-react';
import { IMAGES } from '../config/assets';
import BackButton from '../components/BackButton';

export default function ContentFoundationsProduct() {
  const modules = [
    { icon: Heart, title: 'Module 1: Self Reflection', desc: 'Discover your authentic voice and unique strengths' },
    { icon: Target, title: 'Module 2: SWOT Analysis', desc: 'Identify opportunities and overcome weaknesses' },
    { icon: Compass, title: 'Module 3: Value Alignment', desc: 'Build content that reflects your true values' },
    { icon: Users, title: 'Module 4: Audience Connection', desc: 'Understand who you want to serve and why' },
  ];

  return (
    <div className="bg-white pt-20">
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-gold mb-4">
                <Play size={12} className="mr-1" />
                4-Module Course
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                Content{' '}
                <span className="text-gradient-gold">Foundations</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                Essential groundwork for building your authentic personal brand.
                Start here if you're new to content creation or want to realign your direction.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <Play className="mr-2 text-gold-500" size={18} />
                  <span>4 Video Modules</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="mr-2 text-gold-500" size={18} />
                  <span>Worksheets Included</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="mr-2 text-gold-500" size={18} />
                  <span>Lifetime Access</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$37</span>
                <span className="text-2xl text-gray-400 line-through">$67</span>
                <span className="badge badge-success">45% OFF</span>
              </div>

              <Link
                to="/checkout/content-foundations"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Start Building Your Foundation
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-success-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold-500" />
                  <span>Instant Access</span>
                </div>
              </div>

              {/* Upgrade note */}
              <div className="mt-8 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gold-500">Want the complete system?</span>{' '}
                  Upgrade to the full{' '}
                  <Link to="/contentpreneur-starter-kit" className="text-gold-500 underline hover:text-gold-400">
                    Contentpreneur Starter Kit
                  </Link>{' '}
                  (9 modules) for just $30 more at checkout.
                </p>
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
                    src={IMAGES.contentFoundationsMockup}
                    alt="Content Foundations Course"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 text-center"
          >
            <Target size={48} className="text-gold-500 mx-auto mb-6" />
            <h2 className="text-section text-white mb-4">
              This Course is <span className="text-gradient-gold">Perfect For You</span> If...
            </h2>
            <div className="mt-8 grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {[
                "You're just starting your content creation journey",
                "You feel disconnected from the content you're creating",
                "You want to build an authentic personal brand",
                "You need clarity on your direction before scaling",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="text-success-400 shrink-0 mt-1" size={16} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Course Curriculum</span>
            <h2 className="text-section md:text-section-lg text-white">
              4 Modules to Build Your <span className="text-gradient-gold">Foundation</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                    <module.icon size={28} className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{module.title}</h3>
                    <p className="mt-2 text-gray-500">{module.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Achieve */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-success mb-4">
              <CheckCircle size={12} className="mr-1" />
              By the End of This Course
            </span>
            <h2 className="text-section md:text-section-lg text-white">
              You'll Have <span className="text-gradient-gold">Complete Clarity</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Know Your Why', desc: 'Understand the deeper purpose driving your content creation journey.' },
              { title: 'Clear Direction', desc: "Have a concrete vision of who you want to become and how you'll get there." },
              { title: 'Authentic Voice', desc: 'Discover the unique perspective only you can bring to your niche.' },
            ].map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-success-400" size={28} />
                </div>
                <h3 className="font-semibold text-white mb-2">{result.title}</h3>
                <p className="text-sm text-gray-500">{result.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Success Stories</span>
            <h2 className="text-section md:text-section-lg text-white">
              Creators Who Started With <span className="text-gradient-gold">Foundations</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I was posting randomly for months with no growth. This course helped me understand my 'why' and now my content feels authentic. My engagement has tripled since!",
                name: "Naledi P.",
                role: "Lifestyle Creator",
                result: "3x engagement",
              },
              {
                quote: "The SWOT analysis module was eye-opening. I discovered strengths I didn't know I had and weaknesses holding me back. Essential for any new creator.",
                name: "Thabo N.",
                role: "Finance Creator",
                result: "Found my niche",
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
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                  <span className="badge badge-success">{testimonial.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Choose Your Path</span>
            <h2 className="text-section md:text-section-lg text-white">
              Foundations vs <span className="text-gradient-gold">Full Starter Kit</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Foundations */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-2">Content Foundations</h3>
              <p className="text-gray-500 mb-4">Perfect for beginners</p>
              <div className="text-3xl font-bold text-gradient-gold mb-6">$37</div>
              <ul className="space-y-3 mb-8">
                {['4 Video Modules', 'Self Reflection Workshop', 'SWOT Analysis Template', 'Value Alignment Exercise', 'Lifetime Access'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle size={16} className="text-success-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/checkout/content-foundations" className="btn-secondary w-full text-center">
                Start With Foundations
              </Link>
            </div>

            {/* Full Starter Kit */}
            <div className="glass-card p-8 border-2 border-gold-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-gold">BEST VALUE</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Contentpreneur Starter Kit</h3>
              <p className="text-gray-500 mb-4">Complete system</p>
              <div className="text-3xl font-bold text-gradient-gold mb-6">$67</div>
              <ul className="space-y-3 mb-8">
                {['9 Video Modules', 'Everything in Foundations', 'PAIDS Framework Workbook', 'Niche Finder Workbook', 'Brand Pitch Templates', 'Content Calendar', 'Lifetime Access + Updates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle size={16} className="text-gold-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/checkout/starter-kit" className="btn-primary w-full text-center">
                Get the Full System
              </Link>
            </div>
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
              Build Your Foundation <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Start your content creation journey with clarity and confidence.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$37</span>
              <span className="text-2xl text-gray-400 line-through">$67</span>
            </div>

            <Link
              to="/checkout/content-foundations"
              className="btn-primary btn-lg inline-flex group"
            >
              Start Building Your Foundation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-gold-500" />
                <span>Instant Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
