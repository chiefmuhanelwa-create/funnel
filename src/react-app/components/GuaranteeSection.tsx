import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuaranteeSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 border-2 border-amber-200 shadow-xl text-center"
        >
          {/* Shield Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Shield size={40} className="text-amber-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
            The 30-Day Contentpreneur Guarantee
          </h2>

          {/* Guarantee Text */}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Try the system for 30 days.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              If you don't gain clarity on how to monetize your content,
              just email us and we'll refund you. <span className="font-bold">No questions asked.</span>
            </p>
            <p className="text-gray-600">
              No stress. No complicated forms. No risk.
            </p>
          </div>

          {/* Why We Offer This */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8 border border-amber-200">
            <p className="text-gray-700 italic">
              "The goal isn't just selling a course. It's helping you build a business.
              If I can't do that for you, you deserve your money back."
            </p>
            <p className="mt-2 font-bold text-amber-700">— MN (Mr NoChill)</p>
          </div>

          {/* CTA */}
          <Link
            to="/contentpreneur-starter-kit"
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Start Risk-Free Today
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            You're protected by our 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
