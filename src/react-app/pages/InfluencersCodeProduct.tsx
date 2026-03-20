import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, ArrowRight, Star, Shield, Zap, Users, Target, TrendingUp } from 'lucide-react';
import { IMAGES } from '../config/assets';
import BackButton from '../components/BackButton';

export default function InfluencersCodeProduct() {
  const chapters = [
    { title: 'Chapter 1: The Influencer Mindset', desc: 'Develop the psychology of successful influencers' },
    { title: 'Chapter 2: Finding Your Unique Voice', desc: 'Stand out in a crowded market' },
    { title: 'Chapter 3: Building Your Personal Brand', desc: 'Create a memorable identity' },
    { title: 'Chapter 4: The 3Es Content Formula', desc: 'Educate, Entertain, Engage your audience' },
    { title: 'Chapter 5: Content That Converts', desc: 'Turn followers into customers' },
    { title: 'Chapter 6: The Engagement Formula', desc: 'Build a loyal community' },
    { title: 'Chapter 7: Algorithm Mastery', desc: 'Understand how platforms work' },
    { title: 'Chapter 8: The PAIDS Method', desc: 'Products, Ads, Influence, Digital, Services' },
    { title: 'Chapter 9: Monetization Strategies', desc: 'Multiple income streams explained' },
    { title: 'Chapter 10: Brand Partnership Secrets', desc: 'Land lucrative deals' },
    { title: 'Chapter 11: The DARES Scale System', desc: 'Scale your influence systematically' },
    { title: 'Chapter 12: Building Your Team', desc: 'From solo creator to CEO' },
    { title: 'Chapter 13: Long-term Growth', desc: 'Sustainable influencer business' },
    { title: 'Chapter 14: Your Action Plan', desc: 'Implementation roadmap for success' },
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
                <BookOpen size={12} className="mr-1" />
                Digital eBook
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                The Influencer's{' '}
                <span className="text-gradient-gold">Code</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                Unlock the secrets that top influencers use to build massive audiences,
                land brand deals, and turn their personal brand into a profitable business.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="mr-2 text-gold-500" size={18} />
                  <span>14 Chapters</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 text-gold-500" size={18} />
                  <span>5K+ Readers</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="mr-2 text-gold-500" size={18} />
                  <span>Actionable Strategies</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">R249</span>
                <span className="text-2xl text-gray-400 line-through">R499</span>
                <span className="badge badge-success">60% OFF</span>
              </div>

              <Link
                to="/checkout/influencers-code"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get Your Copy Now
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
                    src={IMAGES.influencersCodeMockup}
                    alt="The Influencer's Code - Book Cover"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Inside</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              14 Chapters to <span className="text-gradient-gold">Transform</span> Your Influence
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              A complete roadmap from building your brand to monetizing your influence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {chapters.map((chapter, index) => (
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
                    <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{chapter.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-success mb-4">
              <TrendingUp size={12} className="mr-1" />
              Results You'll Get
            </span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Why Creators Love <span className="text-gradient-gold">This Book</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Target, title: 'Clear Strategy', desc: 'No more guessing. Get a proven roadmap for influencer success.' },
              { icon: Users, title: 'Grow Your Audience', desc: 'Learn the exact tactics to attract and retain followers.' },
              { icon: TrendingUp, title: 'Increase Revenue', desc: 'Multiple monetization strategies to boost your income.' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-gold-500" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </motion.div>
            ))}
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
            <h2 className="text-section md:text-section-lg text-gray-900">
              What Readers Are <span className="text-gradient-gold">Saying</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "This book changed how I approach content creation. The brand partnership chapter alone was worth 10x the price.",
                name: "Nomsa P.",
                role: "Beauty Creator",
                result: "Landed first brand deal",
              },
              {
                quote: "Finally, a book that doesn't just tell you to 'be authentic.' It gives you actual strategies you can implement today.",
                name: "David M.",
                role: "Tech Reviewer",
                result: "Doubled engagement",
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
              Start Your Influencer Journey{' '}
              <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Get instant access to all 14 chapters and start building your influence
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">R249</span>
              <span className="text-2xl text-gray-400 line-through">R499</span>
            </div>

            <Link
              to="/checkout/influencers-code"
              className="btn-primary btn-lg inline-flex group"
            >
              Get Your Copy Now
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
