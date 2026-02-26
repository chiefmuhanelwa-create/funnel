import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { IMAGES } from '../config/assets';
import SocialProof from './conversion/SocialProof';

const HERO_BULLETS = [
  'Build income beyond brand deals',
  'Create digital products that sell daily',
  'Turn followers into customers',
  'Own your audience and community',
  'Monetize using the PAIDS Framework',
];

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/70" />
      </div>

      {/* DESKTOP: Background Effects */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.04),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
        {/* MOBILE/TABLET: Stacked layout with text on top of image */}
        <div className="lg:hidden flex flex-col justify-center min-h-[85vh]">
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
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 mb-5"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-amber-300">
                The Monetization System That Works
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight">
              <span style={{ color: '#ffffff' }} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Turn Followers Into Income</span>
              <br />
              <span className="text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                Without Chasing Algorithms
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              I built 5 income streams and grew from 0 to 3M+ followers with just my phone.
              Now I'll show you the exact monetization system I use.
            </p>

            {/* Differentiation */}
            <p className="mt-3 text-xs sm:text-sm text-amber-300 font-semibold">
              Not motivation. Not theory. A system.
            </p>

            {/* Bullet Points - Mobile */}
            <div className="mt-5 space-y-2 text-left max-w-sm mx-auto">
              {HERO_BULLETS.slice(0, 4).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={16} className="text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-white/90">{bullet}</span>
                </div>
              ))}
            </div>

            {/* PRIMARY CTA */}
            <div className="mt-6 flex flex-col gap-3 justify-center">
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-base sm:text-lg rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.4),0_0_40px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6),0_0_60px_rgba(251,191,36,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto sm:mx-auto neon-pulse"
              >
                Start Building Your 5 Income Streams
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-amber-400 font-bold text-lg drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">Just $67</span>
            </div>

            {/* Trust Indicators */}
            <p className="mt-3 text-xs text-white/70 text-center">
              Instant Access • Lifetime Updates • 30-Day Guarantee
            </p>

            {/* Social Proof */}
            <div className="mt-3 flex justify-center">
              <SocialProof variant="purchases" minViewers={3} maxViewers={12} />
            </div>

            {/* Trust Stats Row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="text-center px-3 py-2 bg-black/50 rounded-xl backdrop-blur-sm border border-amber-500/40">
                <div className="text-xl sm:text-2xl font-black text-amber-400">3M+</div>
                <div className="text-[10px] sm:text-xs text-amber-200 font-medium">Followers</div>
              </div>
              <div className="text-center px-3 py-2 bg-black/50 rounded-xl backdrop-blur-sm border border-amber-500/40">
                <div className="text-xl sm:text-2xl font-black text-amber-400">5</div>
                <div className="text-[10px] sm:text-xs text-amber-200 font-medium">Income Streams</div>
              </div>
              <div className="text-center px-3 py-2 bg-black/50 rounded-xl backdrop-blur-sm border border-amber-500/40">
                <div className="text-xl sm:text-2xl font-black text-amber-400">50+</div>
                <div className="text-[10px] sm:text-xs text-amber-200 font-medium">Brand Deals</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DESKTOP: Side-by-side grid layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">
                The Monetization System That Works
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              <span className="text-gray-900">Turn Followers Into Income</span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Without Chasing Algorithms
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg xl:text-xl text-gray-600 leading-relaxed max-w-xl">
              I built 5 income streams and grew from 0 to 3M+ followers starting with just my phone.
              Now I'll show you the exact monetization system I use to turn content into a real business.
            </p>

            {/* Differentiation */}
            <p className="mt-4 text-base font-bold text-gray-800">
              Not motivation. Not theory. <span className="text-amber-600">A system.</span>
            </p>

            {/* Bullet Points - Desktop */}
            <div className="mt-6 space-y-3">
              {HERO_BULLETS.map((bullet, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-amber-600" />
                  </div>
                  <span className="text-gray-700">{bullet}</span>
                </motion.div>
              ))}
            </div>

            {/* PRIMARY CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/contentpreneur-starter-kit"
                className="group inline-flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3),0_0_40px_rgba(251,191,36,0.15)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5),0_0_60px_rgba(251,191,36,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Start Building Your 5 Income Streams
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900">$67</span>
                <span className="text-sm text-gray-500">One-time payment</span>
              </div>
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
            <div className="mt-10 flex flex-wrap items-center justify-start gap-6">
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
            <div className="relative max-w-[400px] mx-auto aspect-[3/4]">
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center text-gray-400"
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
