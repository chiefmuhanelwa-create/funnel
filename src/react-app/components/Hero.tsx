import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
        {/* Radial gradient bottom-right */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.06),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* LEFT COLUMN - SALES COPY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Element 1: Authority Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs sm:text-sm font-semibold text-blue-200">
                3M+ Followers Built From Zero
              </span>
            </motion.div>

            {/* Element 2: Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              <span className="text-white">Turn Your Content Into</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                Real Income
              </span>
            </h1>

            {/* Element 3: Subheadline */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Learn the proven system I used to build 5 income streams and grow from 0 to 3M+ followers—without the fluff or fake promises.
            </p>

            {/* Element 4: PRIMARY CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-base sm:text-xl rounded-2xl shadow-[0_8px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_8px_40px_rgba(234,179,8,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px] w-full sm:w-auto"
              >
                Get The Full System — $67
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Element 5: Trust Indicators */}
            <p className="mt-4 text-xs sm:text-sm text-blue-200 text-center lg:text-left">
              ✓ Instant Access  ✓ Lifetime Updates  ✓ 30-Day Guarantee
            </p>

            {/* Element 6: SECONDARY CTA */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products/content-foundations"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-semibold text-sm sm:text-lg rounded-2xl transition-all duration-300 min-h-[52px] w-full sm:w-auto"
              >
                Start With Foundations — $37
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Element 7: Upgrade Note */}
            <p className="mt-3 text-xs sm:text-sm text-blue-300 text-center lg:text-left">
              Start with Foundations and upgrade later for just $30 more
            </p>

            {/* Element 8: Trust Stats Row */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">3M+</div>
                <div className="text-xs sm:text-sm text-blue-200">Followers</div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">5</div>
                <div className="text-xs sm:text-sm text-blue-200">Income Streams</div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">2 Ways</div>
                <div className="text-xs sm:text-sm text-blue-200">To Start</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative order-first lg:order-last"
          >
            {/* Container with aspect ratio */}
            <div className="relative max-w-[400px] md:max-w-[448px] mx-auto aspect-[3/4]">
              {/* 1. Glow Effect (behind) */}
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[24px] sm:rounded-[32px] blur-2xl sm:blur-3xl" />

              {/* 2. Image Container */}
              <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
                {/* 3. Image Element */}
                <img
                  src="https://kgivdudngd1zphnr.public.blob.vercel-storage.com/images/unnamed.jpg"
                  alt="MN - Mr NoChill - Contentpreneur"
                  className="w-full h-full object-cover object-[center_15%]"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* 4. Gradient Overlay (on top) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-white/30"
      >
        <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-gold-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
