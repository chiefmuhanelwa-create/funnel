import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Target, ArrowRight, Star, Shield, Zap, Compass, Lightbulb, TrendingUp, Download, Users } from 'lucide-react';
import { IMAGES } from '../config/assets';
import BackButton from '../components/BackButton';

export default function NicheFinderProduct() {
  const steps = [
    { icon: Compass, title: 'Discover Your Passion', desc: 'Uncover what truly drives you' },
    { icon: Users, title: 'Identify Your Audience', desc: 'Find people who need your expertise' },
    { icon: Lightbulb, title: 'Validate Your Idea', desc: 'Ensure demand exists for your niche' },
    { icon: TrendingUp, title: 'Position for Profit', desc: 'Stand out and monetize effectively' },
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
                <Target size={12} className="mr-1" />
                Find Your Profitable Niche
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                Niche Finder{' '}
                <span className="text-gradient-gold">Workbook</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                Stop guessing and start building. This step-by-step workbook helps you discover the perfect niche
                where your passion meets profitability - so you can create content that actually makes money.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <Target className="mr-2 text-gold-500" size={18} />
                  <span>6 Guided Exercises</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Lightbulb className="mr-2 text-gold-500" size={18} />
                  <span>Clarity Framework</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>Instant PDF Download</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">R197</span>
                <span className="text-2xl text-gray-400 line-through">R397</span>
                <span className="badge badge-success">50% OFF</span>
              </div>

              <Link
                to="/checkout/niche-finder"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get the Niche Finder Workbook
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
                    src={IMAGES.nicheWorkbookMockup}
                    alt="Niche Finder Workbook"
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
            <Target size={48} className="text-warning-400 mx-auto mb-6" />
            <h2 className="text-section text-gray-900 mb-4">
              Struggling to Find Your <span className="text-gradient-gold">Content Niche?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Most creators waste months (or years) creating content for the wrong audience.
              They hop from topic to topic, never building real traction or income.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              {[
                "You have too many interests and can't pick one",
                "You're creating content but not attracting followers",
                "You don't know if your niche can actually make money",
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

      {/* What's Inside */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Inside</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              The 4-Step <span className="text-gradient-gold">Niche Clarity System</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {steps.map((step, index) => (
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
                    <step.icon size={24} className="text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Step {index + 1}: {step.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
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
              <h3 className="font-semibold text-gray-900 mb-4">You'll Walk Away With:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'A clear, focused content niche',
                  'Understanding of your ideal audience',
                  'Validation that your niche is profitable',
                  'Competitive positioning strategy',
                  'Content pillar ideas for your niche',
                  'Confidence to start creating consistently',
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

      {/* Who This Is For */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Perfect For</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Is This <span className="text-gradient-gold">Right For You?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Aspiring Creators",
                desc: "You want to start creating content but don't know where to focus your energy for maximum impact.",
              },
              {
                title: "Multi-Passionate People",
                desc: "You have many interests and skills but struggle to pick one thing to build your brand around.",
              },
              {
                title: "Struggling Creators",
                desc: "You've been creating content but aren't getting traction because your niche isn't clear.",
              },
              {
                title: "Career Changers",
                desc: "You want to transition into content creation and need to find your unique angle.",
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
            <h2 className="text-section md:text-section-lg text-gray-900">
              Creators Who Found <span className="text-gradient-gold">Their Niche</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I was creating content about everything - fitness, finance, motivation. This workbook helped me realize my sweet spot was helping young professionals build healthy habits. My engagement tripled!",
                name: "Thando M.",
                role: "Lifestyle Creator",
                result: "3x Engagement",
              },
              {
                quote: "As a teacher, I thought my content had to be about education. The Niche Finder helped me discover my real passion is helping teachers build side businesses. Now I'm monetizing!",
                name: "Sipho N.",
                role: "EduPreneur",
                result: "First R10K month",
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
              Find Your Niche <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Stop spinning your wheels. Get the clarity you need to build a profitable content business.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">R197</span>
              <span className="text-2xl text-gray-400 line-through">R397</span>
            </div>

            <Link
              to="/checkout/niche-finder"
              className="btn-primary btn-lg inline-flex group"
            >
              Get the Niche Finder Workbook
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
