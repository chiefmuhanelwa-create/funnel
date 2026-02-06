import { motion } from 'framer-motion';
import { Heart, Globe, Zap } from 'lucide-react';

export default function WhyPriceSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8">
            Why Only <span className="text-amber-400">$67</span>?
          </h2>

          {/* Reasons */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <Globe className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Built For Africa</h3>
              <p className="text-gray-400 text-sm">
                I know what it's like to start with nothing. This price makes real education accessible to creators across Africa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <Heart className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Mission Driven</h3>
              <p className="text-gray-400 text-sm">
                My mission is to help 1 million African creators build sustainable income. That matters more than maximizing profit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <Zap className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Remove Excuses</h3>
              <p className="text-gray-400 text-sm">
                At this price, the only thing stopping you is YOU. No more "I can't afford it" — just take action.
              </p>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-gray-300 italic mb-4">
              "The information in this system changed my life. I want it to change yours too — regardless of where you're starting from."
            </p>
            <p className="text-amber-400 font-bold">— MN (Mr NoChill)</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
