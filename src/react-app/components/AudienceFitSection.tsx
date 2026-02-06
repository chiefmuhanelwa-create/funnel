import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const IS_FOR = [
  'Content creators who want to turn followers into income',
  'People ready to build a real business, not just post content',
  'Creators tired of relying only on brand deals',
  'Anyone willing to put in the work to build systems',
  'People who want to own their audience, not rent them',
  'Creators in Africa (or anywhere) who want proven strategies',
];

const NOT_FOR = [
  'People looking for overnight success or get-rich-quick schemes',
  'Those who want to watch videos but never take action',
  'Creators who only want more followers without monetization',
  'People not willing to invest time in building systems',
];

export default function AudienceFitSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Is This For You?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Let's be honest about who this works for.
          </p>
        </motion.div>

        {/* Two Columns */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* This IS For You */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 border-2 border-green-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">This IS For You If...</h3>
            </div>
            <ul className="space-y-4">
              {IS_FOR.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* This is NOT For You */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 border-2 border-red-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X size={20} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">This is NOT For You If...</h3>
            </div>
            <ul className="space-y-4">
              {NOT_FOR.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <X size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-lg text-gray-700">
            If you see yourself in the left column,{' '}
            <span className="font-bold text-amber-600">you're in the right place.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
