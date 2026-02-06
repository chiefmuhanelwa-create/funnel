import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6">
            Stop Posting.
            <span className="block text-amber-400">Start Monetizing.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            You didn't start creating content to stay broke. You started because you have something valuable to share.
            <span className="block mt-2 text-white font-semibold">
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
            className="group inline-flex items-center justify-center gap-3 px-10 py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-xl md:text-2xl rounded-2xl shadow-2xl hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-300"
          >
            <Sparkles size={24} />
            Start Building Your 5 Income Streams
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Price & Guarantee */}
          <div className="mt-6 space-y-2">
            <p className="text-2xl font-bold text-white">
              Just <span className="text-amber-400">$67</span> — One-Time Payment
            </p>
            <p className="text-gray-400">
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
