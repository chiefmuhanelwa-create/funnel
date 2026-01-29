import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight, Star, Shield, Zap, Target, Lightbulb, TrendingUp, Download } from 'lucide-react';
import { IMAGES } from '../config/assets';
import BackButton from '../components/BackButton';

export default function NicheFinderProduct() {
  const exercises = [
    { title: 'Passion Inventory', desc: 'Discover what topics genuinely excite you' },
    { title: 'Skills Assessment', desc: 'Identify your unique abilities and expertise' },
    { title: 'Market Research Framework', desc: 'Analyze demand and competition in potential niches' },
    { title: 'Audience Profiling', desc: 'Define your ideal follower in detail' },
    { title: 'Niche Validation Checklist', desc: 'Test your niche before committing' },
    { title: 'Positioning Statement Builder', desc: 'Craft your unique angle in the market' },
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
                <FileText size={12} className="mr-1" />
                Interactive Workbook
              </span>

              <h1 className="text-hero md:text-hero-lg text-white leading-tight">
                Niche Finder{' '}
                <span className="text-gradient-gold">Workbook</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                Stop second-guessing yourself. This step-by-step workbook helps you discover
                the perfect niche that combines your passion, skills, and market demand.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <FileText className="mr-2 text-gold-500" size={18} />
                  <span>6 Exercises</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="mr-2 text-gold-500" size={18} />
                  <span>Proven Framework</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>PDF Download</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$17</span>
                <span className="text-2xl text-gray-400 line-through">$27</span>
                <span className="badge badge-success">37% OFF</span>
              </div>

              <Link
                to="/checkout/niche-finder"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get Your Workbook
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
            <Lightbulb size={48} className="text-gold-500 mx-auto mb-6" />
            <h2 className="text-section text-white mb-4">
              Are You Stuck Trying to Find <span className="text-gradient-gold">Your Niche?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Most creators spend months (or years) jumping between topics, never building momentum.
              They know they need to niche down, but they're paralyzed by the fear of choosing wrong.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
              {[
                "You have too many interests and can't pick one",
                "You're afraid of limiting your potential audience",
                "You've tried niching before but it didn't feel right",
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
            <span className="badge badge-gold mb-4">Workbook Contents</span>
            <h2 className="text-section md:text-section-lg text-white">
              6 Guided Exercises to Find <span className="text-gradient-gold">Your Perfect Niche</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center text-gray-900 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{exercise.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{exercise.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-success mb-4">
              <TrendingUp size={12} className="mr-1" />
              What You'll Achieve
            </span>
            <h2 className="text-section md:text-section-lg text-white">
              By the End of This <span className="text-gradient-gold">Workbook</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Target, title: 'Crystal Clear Niche', desc: 'Know exactly what topics you\'ll cover and who you\'ll serve.' },
              { icon: Lightbulb, title: 'Confident Direction', desc: 'Stop second-guessing and start creating with purpose.' },
              { icon: TrendingUp, title: 'Market Validation', desc: 'Ensure there\'s demand for your chosen niche before you commit.' },
            ].map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <result.icon className="text-gold-500" size={28} />
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
              Creators Who Found <span className="text-gradient-gold">Their Niche</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I'd been creating random content for 2 years with no growth. After completing this workbook, I niched into 'productivity for freelance designers' and gained 5K followers in 3 months.",
                name: "Sipho T.",
                role: "Design Creator",
                result: "5K new followers",
              },
              {
                quote: "The market research framework was eye-opening. I was about to pick a niche with zero demand. This workbook saved me months of wasted effort.",
                name: "Ayanda N.",
                role: "Finance Creator",
                result: "Validated niche",
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
              Find Your Niche <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Stop guessing, start growing. Get instant access to the complete workbook.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$17</span>
              <span className="text-2xl text-gray-400 line-through">$27</span>
            </div>

            <Link
              to="/checkout/niche-finder"
              className="btn-primary btn-lg inline-flex group"
            >
              Get Your Workbook
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
