import { motion } from 'framer-motion';
import { Heart, Globe, Zap } from 'lucide-react';

export default function WhyPriceSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Neon glow background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Title with neon glow */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 text-white drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            Why Only <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">$67</span>?
          </h2>

          {/* Reasons */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
            >
              <Globe className="w-10 h-10 text-amber-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <h3 className="font-bold text-lg mb-2 text-white">Built For Africa</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                I know what it's like to start with nothing. This price makes real education accessible to creators across Africa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
            >
              <Heart className="w-10 h-10 text-amber-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <h3 className="font-bold text-lg mb-2 text-white">Mission Driven</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                My mission is to help 1 million African creators build sustainable income. That matters more than maximizing profit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
            >
              <Zap className="w-10 h-10 text-amber-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <h3 className="font-bold text-lg mb-2 text-white">Remove Excuses</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                At this price, the only thing stopping you is YOU. No more "I can't afford it" — just take action.
              </p>
            </motion.div>
          </div>

          {/* Quote with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 rounded-2xl p-6 border border-amber-500/20"
          >
            <p className="text-xl md:text-2xl text-white italic mb-4 leading-relaxed">
              "The information in this system changed my life. I want it to change yours too — regardless of where you're starting from."
            </p>
            <p className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">— MN (Mr NoChill)</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
