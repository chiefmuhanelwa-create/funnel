import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUE_ITEMS = [
  {
    name: '9-Module Contentpreneur Course',
    value: 297,
    description: 'Complete personal branding & monetization system',
  },
  {
    name: 'PAIDS Monetization Workbook',
    value: 47,
    description: 'Build your 5 income streams step-by-step',
  },
  {
    name: 'Niche Clarity Workbook',
    value: 37,
    description: 'Find your profitable niche in 30 minutes',
  },
  {
    name: 'Creator Tool Stack',
    value: 27,
    description: 'The exact tools I use daily',
  },
  {
    name: 'Lifetime Access & Updates',
    value: 0,
    description: 'Never pay again, get all future updates',
    isFree: true,
  },
];

const TOTAL_VALUE = VALUE_ITEMS.reduce((sum, item) => sum + item.value, 0);

export default function ValueStackSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle neon background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-sm font-bold rounded-full mb-4 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            WHAT'S INSIDE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Everything You Need To
            <span className="block text-amber-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">Start Monetizing</span>
          </h2>
        </motion.div>

        {/* Value Stack Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl p-6 md:p-10 border-2 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.15)]"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Inside the Contentpreneur System:
          </h3>

          {/* Value Items */}
          <div className="space-y-4 mb-8">
            {VALUE_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {item.isFree ? (
                    <span className="text-amber-600 font-bold">FREE</span>
                  ) : (
                    <span className="text-gray-400 line-through">${item.value}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Value */}
          <div className="border-t-2 border-dashed border-amber-300 pt-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Total Value:</span>
              <span className="text-2xl font-bold text-gray-400 line-through">${TOTAL_VALUE}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Your Price Today:</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl font-black text-amber-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">$67</span>
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  SAVE {Math.round((1 - 67/TOTAL_VALUE) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/contentpreneur-starter-kit"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-xl rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-[1.02] transition-all duration-300 w-full md:w-auto"
            >
              <Sparkles size={24} />
              Get Instant Access Now
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              One-time payment • Instant access • 30-day guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
