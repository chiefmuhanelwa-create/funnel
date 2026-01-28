import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Shield, Zap } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showVideo?: boolean;
  variant?: 'default' | 'sales' | 'minimal';
}

export default function Hero({
  title = "Stop Creating Content That Nobody Buys",
  subtitle = "The PAIDS Framework has helped 10,000+ content creators transform their passion into predictable, profitable businesses. Your turn.",
  ctaText = "Get Instant Access",
  ctaLink = "/contentpreneur-starter-kit",
  showVideo = false,
  variant = 'default',
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-500">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* Glow orbs */}
        <div className="glow-orb w-96 h-96 top-1/4 -left-48 opacity-30" />
        <div className="glow-orb-accent w-80 h-80 bottom-1/4 -right-40 opacity-20" />
        <div className="glow-orb w-64 h-64 top-1/2 left-1/3 opacity-20" />

        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="container-content py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="badge badge-gold">
                <Zap size={12} className="mr-1" />
                For Content Creators
              </span>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-hero md:text-hero-lg lg:text-hero-xl text-white leading-tight">
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {word === 'Nobody' || word === 'Buys' ? (
                    <span className="text-gradient-gold">{word}</span>
                  ) : (
                    word
                  )}{' '}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-body-lg text-white/70 max-w-xl">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={ctaLink}
                className="btn-primary btn-lg group animate-glow-pulse"
              >
                {ctaText}
                <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/free/paids-workbook"
                className="btn-secondary btn-lg"
              >
                Get Free Workbook
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle size={16} className="text-success-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Zap size={16} className="text-gold-500" />
                <span>10,000+ Students</span>
              </div>
            </div>

            {/* Social proof stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold">10K+</div>
                <div className="text-sm text-white/50 mt-1">Creators</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold">$2M+</div>
                <div className="text-sm text-white/50 mt-1">Revenue Generated</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold">4.9</div>
                <div className="text-sm text-white/50 mt-1">Star Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Visual/Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {showVideo ? (
              <div className="relative glass-card p-2 glow-gold">
                <div className="video-container">
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-400">
                    <button className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center hover:scale-105 transition-transform glow-gold">
                      <Play className="text-dark-500 ml-1" size={32} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Decorative glow elements */}
                <div className="absolute -top-8 -left-8 w-72 h-72 glow-orb opacity-40" />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 glow-orb-accent opacity-30" />

                {/* PAIDS Framework Card */}
                <div className="relative glass-card p-8 glow-gold-lg">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">The PAIDS Framework</h3>
                    <p className="text-white/50 text-sm">Your roadmap to content success</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { letter: 'P', title: 'Positioning', desc: 'Stand out in your niche' },
                      { letter: 'A', title: 'Audience', desc: 'Know who you serve' },
                      { letter: 'I', title: 'Income', desc: 'Multiple revenue streams' },
                      { letter: 'D', title: 'Distribution', desc: 'Get seen by the right people' },
                      { letter: 'S', title: 'Systems', desc: 'Scale without burnout' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.letter}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center text-dark-500 font-bold text-lg group-hover:glow-gold transition-all">
                          {item.letter}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-sm text-white/50">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated decoration */}
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                    <div className="w-full h-full rounded-full border-2 border-gold-500 animate-spin-slow" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-white/30">
          <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-gold-500" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
