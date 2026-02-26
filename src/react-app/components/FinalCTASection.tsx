import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Neon glow background effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6">
            <span style={{ color: '#ffffff' }} className="drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">Stop Posting.</span>
            <span className="block text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]">Start Monetizing.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            You didn't start creating content to stay broke. You started because you have something valuable to share.
            <span className="block mt-2 text-amber-400 font-bold drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              It's time to get paid for it.
            </span>
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="text-gray-300">3M+ Followers Built</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-gray-300">5 Income Streams</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-gray-300">Featured at META</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/contentpreneur-starter-kit"
            className="group inline-flex items-center justify-center gap-3 px-10 py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-xl md:text-2xl rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.5),0_0_60px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.7),0_0_100px_rgba(251,191,36,0.4)] hover:scale-[1.02] transition-all duration-300 neon-pulse"
          >
            <Sparkles size={24} />
            Start Building Your 5 Income Streams
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Price & Guarantee */}
          <div className="mt-6 space-y-2">
            <p style={{ color: '#ffffff' }} className="text-2xl md:text-3xl font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Just <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]">$67</span> — One-Time Payment
            </p>
            <p className="text-gray-200">
              Instant Access • Lifetime Updates • 30-Day Money-Back Guarantee
            </p>
          </div>

          {/* Final Line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-lg text-gray-400 italic"
          >
            Your future starts with the next decision you make.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
