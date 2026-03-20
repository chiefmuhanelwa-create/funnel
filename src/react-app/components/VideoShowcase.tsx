import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Users, Award, Zap } from 'lucide-react';
import { useState, useRef } from 'react';
import { VIDEOS, IMAGES } from '../config/assets';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.05),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-6">
            <Award size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Featured at META 2025</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            From Bathroom Floors to
            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              META's Global Stage
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Watch the 2-minute talk that explains how a kid from Venda with zero resources
            built a 3M+ following and 5 income streams—using just a phone.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Player - Portrait Orientation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-2xl" />

              <div className="relative aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                <video
                  ref={videoRef}
                  src={VIDEOS.testimonials}
                  className="w-full h-full object-cover"
                  poster={IMAGES.heroImage}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  controls={isPlaying}
                />

                {/* Play button overlay */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-900/30 cursor-pointer group"
                    onClick={handlePlayClick}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 rounded-lg text-gray-700 text-sm font-medium shadow">
                  2:00
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              "The Secret Isn't More Followers—
              <span className="text-amber-600"> It's Better Systems"</span>
            </h3>

            <p className="text-gray-600 leading-relaxed mb-8">
              In this talk at META's headquarters, I share the exact moment I realized that
              followers don't pay rent—and the framework I built to turn content into real income.
              This isn't motivation. It's a blueprint.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <Users size={24} className="text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-gray-900">3M+</div>
                <div className="text-xs text-gray-500">Built From Zero</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <Zap size={24} className="text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-gray-900">5</div>
                <div className="text-xs text-gray-500">Income Streams</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <Award size={24} className="text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-gray-900">8</div>
                <div className="text-xs text-gray-500">Major Awards</div>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/contentpreneur-starter-kit"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Get The Same System I Use
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              Start building your 5 income streams today — R699
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
