import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Play, ArrowRight, Star, Clock, Users, Award, Shield, Zap, Gift, Lock, CreditCard, MessageCircle } from 'lucide-react';
import { IMAGES } from '../config/assets';
import CountdownTimer from '../components/conversion/CountdownTimer';
import ExitIntentPopup from '../components/conversion/ExitIntentPopup';
import MobileCTA from '../components/conversion/MobileCTA';
import SocialProof, { RecentPurchasePopup } from '../components/conversion/SocialProof';
import BackButton from '../components/BackButton';

export default function StarterKitProduct() {
  const navigate = useNavigate();

  // Create countdown target date (midnight tonight + 2 days for urgency)
  const countdownTarget = useMemo(() => {
    const target = new Date();
    target.setDate(target.getDate() + 2);
    target.setHours(23, 59, 59, 999);
    return target;
  }, []);

  const handleExitDiscount = (code: string) => {
    // Navigate to checkout with discount pre-applied
    navigate(`/checkout/starter-kit?discount=${code}`);
  };
  const modules = [
    { title: 'Introduction', desc: 'Welcome & how to get the most from this course' },
    { title: 'Module 1: What is a Personal Brand', desc: 'Understand the foundation of building your brand identity' },
    { title: 'Module 2: Blueprint to Build a Personal Brand', desc: 'Step-by-step framework to create your unique brand' },
    { title: 'Module 3: The 3Cs Framework - Mindset', desc: 'Master the mindset principles for creator success' },
    { title: 'Module 4: SWOT Analysis', desc: 'Identify your strengths, weaknesses, opportunities & threats' },
    { title: 'Module 5: 3Es Content Idea Formula', desc: 'Never run out of content ideas with this proven formula' },
    { title: 'Module 6: Understand Social Media Platforms', desc: 'Leverage each platform for maximum reach' },
    { title: 'Module 7: Community Building', desc: 'Build an engaged audience that buys from you' },
    { title: 'Module 8: PAIDS Framework', desc: 'Master all 5 income pillars: Products, Ads, Influence, Digital, Services' },
    { title: 'Module 9: Formula to Create Online Asset', desc: 'Create digital products that generate passive income' },
  ];

  return (
    <div className="bg-white pt-20">
      {/* Conversion Components */}
      <ExitIntentPopup
        discountCode="SAVE10"
        discountPercent={10}
        onApplyDiscount={handleExitDiscount}
      />
      <MobileCTA
        productName="Starter Kit"
        price="$67"
        originalPrice="$197"
        checkoutUrl="/checkout/starter-kit"
      />
      <RecentPurchasePopup
        productName="Contentpreneur Starter Kit"
        delaySeconds={20}
        durationSeconds={5}
      />

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
                <Clock size={12} className="mr-1" />
                Limited Time: 66% Off
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                Contentpreneur{' '}
                <span className="text-gradient-gold">Starter Kit</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-xl">
                The complete 9-module course to launch and grow your content creator business.
                Learn the exact PAIDS Framework that has generated over $2M in creator revenue.
              </p>

              <div className="mt-6">
                <SocialProof variant="viewers" minViewers={5} maxViewers={18} />
              </div>

              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 text-gold-500" size={18} />
                  <span>9 Modules</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 text-gold-500" size={18} />
                  <span>10K+ Students</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Gift className="mr-2 text-gold-500" size={18} />
                  <span>Bonus Workbooks</span>
                </div>
              </div>

              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$67</span>
                <span className="text-2xl text-gray-400 line-through">$197</span>
                <span className="badge badge-success">66% OFF</span>
              </div>

              {/* Urgency Countdown */}
              <div className="mt-6">
                <CountdownTimer
                  targetDate={countdownTarget}
                  title="Sale Ends In:"
                  compact
                />
              </div>

              <Link
                to="/checkout/starter-kit"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Enroll Now - Get Instant Access
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-success-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-accent-400" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <span>SSL Encrypted</span>
                </div>
              </div>

              {/* WhatsApp Support */}
              <a
                href="https://wa.me/27600000000?text=Hi!%20I%20have%20a%20question%20about%20the%20Starter%20Kit"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-colors"
              >
                <MessageCircle size={16} className="text-green-400" />
                Questions? WhatsApp us
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-2 glow-gold">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={IMAGES.starterKitCourseMockup}
                    alt="Contentpreneur Starter Kit - 9 Module Course"
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                      <span className="text-gray-900 font-semibold">9-Module Video Course</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Course Curriculum</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              What's Inside the <span className="text-gradient-gold">Starter Kit</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Everything you need to build a profitable content business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {modules.map((module, index) => (
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
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{module.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
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
              <Gift size={12} className="mr-1" />
              Included Free
            </span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Bonus Resources <span className="text-gradient-gold">(Worth $97)</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Niche Finder Workbook (PDF)', value: '$27', desc: 'Step-by-step exercises to find your profitable niche in 90 minutes' },
              { title: 'PAIDS Framework Workbook (PDF)', value: '$27', desc: 'Implement all 5 income pillars with guided worksheets' },
              { title: 'NoChill Tool Stack Access', value: '$47', desc: 'Complete list of tools used to build a 3M+ audience with affiliate links' },
              { title: 'Lifetime Updates', value: 'Priceless', desc: 'Get all future course updates and additions at no extra cost' },
            ].map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-success-400" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{bonus.title}</h3>
                      <span className="text-xs text-gray-400">({bonus.value} value)</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{bonus.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - What Others Charge */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Value Comparison</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              What Others <span className="text-gradient-gold">Charge</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              See how the Starter Kit compares to similar courses and coaching programs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">What You Get</th>
                  <th className="text-center py-4 px-4 text-gray-500 font-medium">Others</th>
                  <th className="text-center py-4 px-4 text-amber-600 font-bold">Starter Kit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Video Course (9+ Modules)', others: '$197 - $497', us: true },
                  { feature: 'Niche Finder Workbook', others: '$27 - $47', us: true },
                  { feature: 'Monetization Framework', others: '$97 - $197', us: true },
                  { feature: 'Tool Stack with Affiliate Links', others: 'Not included', us: true },
                  { feature: 'Lifetime Access + Updates', others: '1 year only', us: true },
                  { feature: 'Community Support', others: '$19/mo', us: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-500">{row.others}</td>
                    <td className="py-4 px-4 text-center">
                      {row.us ? (
                        <CheckCircle className="inline text-green-500" size={20} />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Total Value</td>
                  <td className="py-4 px-4 text-center font-semibold text-gray-600">$500+</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-2xl font-bold text-gradient-gold">$67</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/checkout/starter-kit"
              className="btn-primary btn-lg inline-flex group"
            >
              Get Started for Just $67
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              That's less than a nice dinner out — for a complete business education
            </p>
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
            <span className="badge badge-gold mb-4">Success Stories</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Real Results from <span className="text-gradient-gold">Real Creators</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">FAQ</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Common <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How long do I have access to the course?",
                a: "Forever! You get lifetime access to all course materials and any future updates."
              },
              {
                q: "Is this course suitable for beginners?",
                a: "Yes! The Starter Kit is designed for both beginners and creators who want to systematize their approach."
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a 30-day money-back guarantee. If you're not happy, just email us for a full refund."
              },
              {
                q: "When do I get access?",
                a: "Immediately! As soon as your payment is confirmed, you'll receive an email with your login details."
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
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
            {/* Social Proof */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-success-500/20 border border-success-500/30 rounded-full px-4 py-2">
                <Users size={16} className="text-success-400" />
                <span className="text-success-400 text-sm font-medium">
                  Join 10,247+ creators who enrolled
                </span>
              </div>
            </div>

            <h2 className="text-section md:text-section-lg text-gray-900 mb-4">
              Start Your Content Business{' '}
              <span className="text-gradient-gold">Today</span>
            </h2>
            <p className="text-gray-500 mb-6 max-w-xl mx-auto">
              Get instant access to all 9 modules + bonus resources
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <CountdownTimer
                targetDate={countdownTarget}
                title="This price expires in:"
              />
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$67</span>
              <span className="text-2xl text-gray-400 line-through">$197</span>
            </div>

            <Link
              to="/checkout/starter-kit"
              className="btn-primary btn-lg inline-flex group"
            >
              Enroll Now - Get Instant Access
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-gold-500" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-accent-400" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
