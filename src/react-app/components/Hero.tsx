import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IMAGES } from '../config/assets';
import SocialProof from './conversion/SocialProof';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* MOBILE/TABLET: Full-screen hero image with overlay */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src={IMAGES.heroImage}
          alt="MN - Mr NoChill - Contentpreneur"
          className="w-full h-full object-cover object-[center_20%]"
          loading="eager"
          fetchPriority="high"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60" />
      </div>

      {/* DESKTOP: Background Effects */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.04),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-24 md:py-32 relative z-10">
        {/* MOBILE/TABLET: Stacked layout with text on top of image */}
        <div className="lg:hidden flex flex-col justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            {/* Authority Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 mb-6"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-amber-300">
                3M+ Followers Built From Zero
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <span className="text-white">Turn Your Content Into</span>
              <br />
              <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Real Income
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Learn the proven system I used to build 5 income streams and grow from 0 to 3M+ followers—without the fluff or fake promises.
            </p>

            {/* PRIMARY CTA */}
            <div className="mt-8 flex flex-col gap-4 justify-center">
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-base sm:text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px] w-full sm:w-auto sm:mx-auto"
              >
                Get The Full System — $67
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <p className="mt-4 text-xs sm:text-sm text-white/80 text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              ✓ Instant Access  ✓ Lifetime Updates  ✓ 30-Day Guarantee
            </p>

            {/* Social Proof */}
            <div className="mt-4 flex justify-center">
              <SocialProof variant="purchases" minViewers={3} maxViewers={12} />
            </div>

            {/* Trust Stats Row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="text-center px-4 py-3 bg-black/40 rounded-xl backdrop-blur-sm border border-amber-500/30">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">3M+</div>
                <div className="text-xs sm:text-sm text-amber-200 font-medium">Followers</div>
              </div>
              <div className="text-center px-4 py-3 bg-black/40 rounded-xl backdrop-blur-sm border border-amber-500/30">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">5</div>
                <div className="text-xs sm:text-sm text-amber-200 font-medium">Income Streams</div>
              </div>
              <div className="text-center px-4 py-3 bg-black/40 rounded-xl backdrop-blur-sm border border-amber-500/30">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">50+</div>
                <div className="text-xs sm:text-sm text-amber-200 font-medium">Brand Deals</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DESKTOP: Side-by-side grid layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN - SALES COPY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-left"
          >
            {/* Authority Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">
                3M+ Followers Built From Zero
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-7xl font-black leading-[1.1] tracking-tight">
              <span className="text-gray-900">Turn Your Content Into</span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Real Income
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl">
              Learn the proven system I used to build 5 income streams and grow from 0 to 3M+ followers—without the fluff or fake promises.
            </p>

            {/* PRIMARY CTA */}
            <div className="mt-10 flex gap-4 justify-start">
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Get The Full System — $67
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <p className="mt-4 text-sm text-gray-500 text-left">
              ✓ Instant Access  ✓ Lifetime Updates  ✓ 30-Day Guarantee
            </p>

            {/* Social Proof */}
            <div className="mt-4 flex justify-start">
              <SocialProof variant="purchases" minViewers={3} maxViewers={12} />
            </div>

            {/* Trust Stats Row */}
            <div className="mt-12 flex flex-wrap items-center justify-start gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">3M+</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">5</div>
                <div className="text-sm text-gray-500">Income Streams</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">50+</div>
                <div className="text-sm text-gray-500">Brand Deals</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative max-w-[448px] mx-auto aspect-[3/4]">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-[32px] blur-3xl" />

              {/* Image Container */}
              <div className="relative h-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-50">
                <img
                  src={IMAGES.heroImage}
                  alt="MN - Mr NoChill - Contentpreneur"
                  className="w-full h-full object-cover object-[center_15%]"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center text-gray-400"
      >
        <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-amber-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
