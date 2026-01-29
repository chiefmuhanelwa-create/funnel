import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-black via-purple-950/5 to-black relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section 1: Story Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            <span className="text-white block">From Bathroom Floors</span>
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
              To Boardrooms
            </span>
          </h2>
        </motion.div>

        {/* Section 2: Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-[448px] mx-auto mb-8 md:mb-12"
        >
          <div className="relative aspect-square">
            {/* 1. Glow (behind) */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl md:blur-3xl" />

            {/* 2. Photo Container */}
            <div className="relative h-full rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* 3. Image */}
              <img
                src="/images/about-mrnochill.jpg"
                alt="MN - Mr NoChill - Contentpreneur"
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* 4. Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Story Cards */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mb-12 md:mb-16">
          {/* Card 1 - Rock Bottom (Red) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl md:rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-b from-red-500/10 to-transparent border-2 border-red-500/20 p-6 md:p-12 rounded-2xl md:rounded-3xl">
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                Let me tell you where I started. I dropped out of university twice. I slept on bathroom floors because I couldn't afford rent. I built a following of over 3 million people... and still couldn't pay my bills.
              </p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mt-4">
                Followers don't pay rent. Engagement doesn't buy groceries. I learned this the hard way.
              </p>
            </div>
          </motion.div>

          {/* Card 2 - Wake-Up Call (Orange) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl md:rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-b from-orange-500/10 to-transparent border-2 border-orange-500/20 p-6 md:p-12 rounded-2xl md:rounded-3xl">
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                Then came the wake-up call. Tax issues I didn't understand. Lost followers because I didn't know how to retain them. Burnout from creating content with no strategy.
              </p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mt-4">
                That's when I realized: Content creation isn't a business. It's a vehicle. And I needed a system to drive it.
              </p>
            </div>
          </motion.div>

          {/* Card 3 - Transformation (Green) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl md:rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-b from-green-500/10 to-transparent border-2 border-green-500/20 p-6 md:p-12 rounded-2xl md:rounded-3xl">
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                Today, everything is different. I built a real business with:
              </p>
              <div className="space-y-3">
                {[
                  'Digital and physical products selling daily',
                  'Digital courses with thousands of students',
                  'An email list of 100K+ subscribers',
                  'Brand partnerships with major companies',
                  '5 separate income streams',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-white/80 text-base md:text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 4: PAIDS Framework Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12 md:mb-16"
        >
          <div className="bg-gradient-to-b from-yellow-500/10 to-transparent border-2 border-yellow-500/30 p-6 md:p-12 rounded-2xl md:rounded-3xl text-center">
            <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-4">
              The PAIDS Framework
            </h3>
            <p className="text-xl md:text-2xl text-yellow-400 font-medium">
              <span className="font-black">P</span>roducts • <span className="font-black">A</span>ds/Affiliates • <span className="font-black">I</span>nformation • <span className="font-black">D</span>eals • <span className="font-black">S</span>ervices
            </p>
          </div>
        </motion.div>

        {/* Section 5: Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-black text-white">
            Building For Children's Children
          </h3>
        </motion.div>

        {/* Section 6: Final CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Stronger glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-2 border-yellow-500/30 p-8 md:p-12 rounded-3xl text-center">
              {/* Question Pattern */}
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8">
                "The Question Isn't 'Can I Do This?'
                <br />
                It's 'How Much Longer Am I Going to Wait?'"
              </h3>

              {/* CTA Button */}
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl md:text-2xl rounded-2xl shadow-[0_8px_50px_rgba(234,179,8,0.6)] hover:shadow-[0_8px_60px_rgba(234,179,8,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[64px]"
              >
                Start Your Journey Now
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
