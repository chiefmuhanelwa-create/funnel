import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowRight, Star, Clock, Users, Award } from 'lucide-react';

export default function StarterKitProduct() {
  const modules = [
    { title: 'Module 1: Finding Your Niche', desc: 'Discover your unique positioning in the content market' },
    { title: 'Module 2: Understanding Your Audience', desc: 'Deep dive into audience research and personas' },
    { title: 'Module 3: Content Strategy Foundations', desc: 'Build a content plan that actually works' },
    { title: 'Module 4: The PAIDS Framework Deep Dive', desc: 'Master all five pillars of the system' },
    { title: 'Module 5: Monetization Strategies', desc: 'Multiple income streams explained' },
    { title: 'Module 6: Brand Partnerships 101', desc: 'Land your first (or next) brand deal' },
    { title: 'Module 7: Building Your Distribution', desc: 'Get your content seen by the right people' },
    { title: 'Module 8: Systems & Automation', desc: 'Scale without burning out' },
    { title: 'Module 9: Launch Your Business', desc: 'Action plan to implement everything' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 text-sm font-medium text-primary-400 bg-primary-900/50 rounded-full mb-4">
                Limited Time Offer
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Contentpreneur Starter Kit
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                The complete 9-module course to launch and grow your content creator business.
                Learn the exact PAIDS Framework that has generated over $2M in creator revenue.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center text-white">
                  <Clock className="mr-2 text-primary-400" size={20} />
                  <span>9 Modules</span>
                </div>
                <div className="flex items-center text-white">
                  <Users className="mr-2 text-primary-400" size={20} />
                  <span>10K+ Students</span>
                </div>
                <div className="flex items-center text-white">
                  <Award className="mr-2 text-primary-400" size={20} />
                  <span>Bonus Workbooks</span>
                </div>
              </div>

              <div className="mt-8 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-white">$67</span>
                <span className="text-2xl text-gray-400 line-through">$197</span>
                <span className="px-2 py-1 text-sm font-medium text-green-400 bg-green-900/50 rounded">
                  66% OFF
                </span>
              </div>

              <Link
                to="/checkout/starter-kit"
                className="mt-8 inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition text-lg"
              >
                Enroll Now - Get Instant Access
                <ArrowRight className="ml-2" size={20} />
              </Link>

              <p className="mt-4 text-sm text-gray-400">
                30-day money-back guarantee. No questions asked.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800 aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors group">
                    <Play className="text-white ml-1 group-hover:scale-110 transition-transform" size={32} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm">
                  Watch the intro video
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What's Inside the Starter Kit
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to build a profitable content business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card card-hover"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{module.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-full mb-4">
              Included Free
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Bonus Resources (Worth $97)
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Niche Finder Workbook', value: '$27', desc: 'Step-by-step exercises to find your profitable niche' },
              { title: 'PAIDS Framework Workbook', value: '$27', desc: 'Implement each pillar with guided worksheets' },
              { title: 'Brand Pitch Templates', value: '$27', desc: 'Proven email templates for brand outreach' },
              { title: 'Content Calendar Template', value: '$16', desc: 'Plan 30 days of content in 30 minutes' },
            ].map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card flex items-start"
              >
                <CheckCircle className="text-green-500 shrink-0 mt-1" size={24} />
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{bonus.title}</h3>
                    <span className="text-sm text-gray-400">({bonus.value} value)</span>
                  </div>
                  <p className="mt-1 text-gray-600">{bonus.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Success Stories
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "I was skeptical at first, but the PAIDS Framework is the real deal. Within 3 months of implementing it, I signed a $5,000 brand deal.",
                name: "Thabo M.",
                role: "Tech Creator",
                result: "$5,000 brand deal",
              },
              {
                quote: "The course helped me understand what I was doing wrong. Now I have a clear strategy and my engagement has tripled.",
                name: "Lerato K.",
                role: "Lifestyle Blogger",
                result: "3x engagement",
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
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic text-lg">"{testimonial.quote}"</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                    {testimonial.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Start Your Content Business Today
            </h2>
            <p className="mt-6 text-lg text-white/90">
              Get instant access to all 9 modules + bonus resources
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-5xl font-bold text-white">$67</span>
              <span className="text-2xl text-white/50 line-through">$197</span>
            </div>
            <Link
              to="/checkout/starter-kit"
              className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Enroll Now - Get Instant Access
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <p className="mt-4 text-sm text-white/70">
              30-day money-back guarantee. Lifetime access.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
