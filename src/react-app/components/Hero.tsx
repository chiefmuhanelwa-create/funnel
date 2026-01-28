import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showVideo?: boolean;
}

export default function Hero({
  title = "Transform Your Content Into a Profitable Business",
  subtitle = "Learn the PAIDS Framework that has helped thousands of content creators build sustainable income streams.",
  ctaText = "Start Your Journey",
  ctaLink = "/contentpreneur-starter-kit",
  showVideo = false,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to={ctaLink}
                className="btn-primary text-lg px-8 py-4 group"
              >
                {ctaText}
                <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/free/paids-workbook"
                className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              >
                Get Free Workbook
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center space-x-8">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-400">Content Creators</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div>
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-gray-400">Revenue Generated</div>
              </div>
              <div className="h-12 w-px bg-gray-700 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-gray-400">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Visual/Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {showVideo ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="video-container bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                      <Play className="text-white ml-1" size={32} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

                {/* Main image placeholder */}
                <div className="relative bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-8 shadow-2xl">
                  <div className="aspect-square rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-6xl font-bold mb-4">PAIDS</div>
                      <div className="text-xl">Framework</div>
                      <div className="mt-6 space-y-2 text-left text-sm">
                        <div><span className="font-bold">P</span>ositioning</div>
                        <div><span className="font-bold">A</span>udience</div>
                        <div><span className="font-bold">I</span>ncome</div>
                        <div><span className="font-bold">D</span>istribution</div>
                        <div><span className="font-bold">S</span>ystems</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
