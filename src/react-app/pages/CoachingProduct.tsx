import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  Star,
  Shield,
  Video,
  Users,
  Target,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  Award,
  Zap,
  Heart,
} from 'lucide-react';
import BackButton from '../components/BackButton';

export default function CoachingProduct() {
  const sessionIncludes = [
    { icon: Video, title: '60-Minute Video Call', desc: 'One-on-one strategy session via Zoom' },
    { icon: Target, title: '90-Day Action Plan', desc: 'Custom roadmap tailored to your goals' },
    { icon: FileText, title: 'Session Recording', desc: 'Review our conversation anytime' },
    { icon: MessageSquare, title: '7-Day Follow-up', desc: 'Email support after our call' },
  ];

  const transformations = [
    {
      before: 'Posting content with no strategy',
      after: 'Clear 90-day content monetization roadmap',
    },
    {
      before: 'Confused about how to make money',
      after: 'Implementing the 5-pillar PAIDS framework',
    },
    {
      before: 'Undercharging for brand deals',
      after: 'Confident pricing using the RateCard system',
    },
    {
      before: 'Stuck at a growth plateau',
      after: 'Breaking through with proven tactics',
    },
  ];

  return (
    <div className="bg-white pt-20">
      {/* Back Navigation */}
      <div className="container-content pt-6">
        <BackButton />
      </div>

      {/* Hero Section - Story-driven */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="glow-orb w-96 h-96 -top-48 -right-48 opacity-30" />
        <div className="glow-orb-accent w-80 h-80 bottom-0 -left-40 opacity-20" />

        <div className="container-content relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-gold mb-4">
                <Calendar size={12} className="mr-1" />
                Limited Availability
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                From Bathroom Floors to Boardrooms:{' '}
                <span className="text-gradient-gold">Your Turn</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-2xl mx-auto">
                Get 60 minutes of personalized guidance from someone who slept on university bathroom floors
                and built a content empire generating R300K+/month with 3M+ followers.
                The same strategies. Applied to your situation.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-gray-600">
                  <Award className="mr-2 text-gold-500" size={18} />
                  <span>8x Award Winner</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 text-gold-500" size={18} />
                  <span>3M+ Followers Built</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="mr-2 text-gold-500" size={18} />
                  <span>50+ Brand Deals</span>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$497</span>
                <span className="text-xl text-gray-400 line-through">$997</span>
                <span className="badge badge-success">50% OFF</span>
              </div>

              <Link
                to="/consultation"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Book Your Strategy Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <p className="mt-4 text-sm text-gray-400">
                Only 4 spots available per month
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Story Section - Origin */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="badge badge-gold mb-4">The Journey</span>
              <h2 className="text-section md:text-section-lg text-gray-900">
                I've Been <span className="text-gradient-gold">Where You Are</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-10"
            >
              <p className="text-gray-600 leading-relaxed mb-6">
                In 2012, I was sleeping on university bathroom floors. Not metaphorically. Literally curling up
                on cold concrete tiles, washing my clothes in bathroom sinks, and walking to class pretending
                everything was fine.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                My REAP bursary was cancelled because I failed ONE module. My mother had just passed away.
                Her last words were "go to school my boy, and study." And there I was - unable to afford accommodation,
                too proud to go home to Venda, making a daily choice: stay on the floor or get up and fight.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every morning, I looked in that cracked bathroom mirror and chose to get up.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                That choice - repeated thousands of times - led to 3M+ followers, 50+ brand deals (Netflix, Samsung,
                Coca-Cola, Red Bull), 8 industry awards, R300K+ monthly revenue, and 5,000+ book copies sold.
              </p>
              <p className="text-gray-900 font-semibold leading-relaxed">
                The frameworks I developed didn't come from textbooks. They came from bathroom floors.
                From R6,000 phone purchases that everyone called "irresponsible" - that generated R600K+ in revenue.
                From losing 780K Instagram followers and still having a business because I'd built proper systems.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-success mb-4">
              <Zap size={12} className="mr-1" />
              Your Transformation
            </span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              60 Minutes That <span className="text-gradient-gold">Change Everything</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              This isn't generic advice from someone who read about content creation.
              This is battle-tested strategy from someone who lived it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {transformations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
                      <span className="text-red-500 text-sm font-bold">X</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200 mx-auto" />
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-2">
                      <CheckCircle className="text-green-500" size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 line-through text-sm mb-3">{item.before}</p>
                    <p className="text-gray-900 font-medium">{item.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <span className="badge badge-gold mb-4">What's Included</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              More Than Just a <span className="text-gradient-gold">Call</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              You get a complete strategy experience, not just advice
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold-500" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We'll Cover */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-success mb-4">
                <Target size={12} className="mr-1" />
                Session Focus
              </span>
              <h2 className="text-section md:text-section-lg text-gray-900">
                We'll Cover <span className="text-gradient-gold">Your Situation</span>
              </h2>
              <p className="mt-4 text-gray-500">
                No cookie-cutter advice. Your session is completely customized. Common topics include:
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Content strategy using the 4E Evolution framework',
                  'Monetization using the PAIDS 5-pillar system',
                  'Audience growth with the MS×TS×SS equation',
                  'Brand deal pricing and negotiation tactics',
                  'Building owned audiences (so you never lose like I lost 780K)',
                  'Platform-specific strategies that actually work',
                  'Your specific challenges and roadblocks',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-success-400 shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="text-gold-500" size={20} />
                  This is For You If:
                </h3>
                <ul className="space-y-4">
                  {[
                    'You're creating content but not making money from it',
                    'You're undercharging for brand deals (or not getting any)',
                    'You're stuck at a growth plateau and nothing's working',
                    'You want a clear action plan, not more generic advice',
                    'You're ready to treat content creation as a business',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="text-gold-500" size={14} />
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Track Record</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Results <span className="text-gradient-gold">That Speak</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { stat: '3M+', label: 'Followers Built' },
              { stat: '50+', label: 'Brand Partnerships' },
              { stat: '8', label: 'Industry Awards' },
              { stat: '5,000+', label: 'Books Sold' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-black text-gradient-gold mb-2">{item.stat}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {['Netflix', 'Samsung', 'Coca-Cola', 'Red Bull', 'Savanna', 'DSTV', 'Showmax', 'Takealot'].map((brand, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 border border-gray-200"
              >
                {brand}
              </span>
            ))}
          </motion.div>
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
            <span className="badge badge-gold mb-4">Client Results</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Transformation <span className="text-gradient-gold">Stories</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "One call with MN gave me more clarity than months of trying to figure it out alone. Within 30 days, I had my first R50K month. The PAIDS framework changed everything.",
                name: "Thabo M.",
                role: "Finance Creator",
                result: "R50K/month",
              },
              {
                quote: "The 90-day roadmap was exactly what I needed. MN didn't just give advice - he showed me his actual process. I landed my first R25K brand deal within 2 weeks.",
                name: "Lerato K.",
                role: "Lifestyle Influencer",
                result: "R25K first deal",
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
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section text-gray-900">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How do I prepare for the call?",
                a: "After booking, you'll receive a pre-call questionnaire. Come ready with your top 3 challenges and goals. The more specific you are, the more value you'll get."
              },
              {
                q: "What if I'm just starting out?",
                a: "Perfect. I started from literal bathroom floors with a R6,000 phone. I'll meet you where you are and show you the shortest path forward. Beginners often get the most value."
              },
              {
                q: "What makes this different from other coaching?",
                a: "I'm not teaching theory from a textbook. I'm sharing exact frameworks I used to build 3M+ followers, land 50+ brand deals, and generate R300K+/month. Plus, I've lost it all and rebuilt - twice. That perspective is invaluable."
              },
              {
                q: "Do you offer refunds?",
                a: "If you implement what we discuss and genuinely feel it didn't provide value, let me know within 7 days. I'll either offer another session or a full refund. I only win when you win."
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
                <p className="text-sm text-gray-500">{faq.a}</p>
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
              Your <span className="text-gradient-gold">Transformation</span> Awaits
            </h2>
            <p className="text-gray-500 mb-4 max-w-xl mx-auto">
              I got up from bathroom floors every single day because quitting meant betraying my mother's last words.
            </p>
            <p className="text-gray-900 font-semibold mb-8 max-w-xl mx-auto">
              What will you do with 60 minutes of guidance from someone who turned that pain into a system?
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$497</span>
              <span className="text-xl text-gray-400 line-through">$997</span>
            </div>

            <Link
              to="/consultation"
              className="btn-primary btn-lg inline-flex group"
            >
              Book Your Strategy Call
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gold-500" />
                <span>Only 4 Spots/Month</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
