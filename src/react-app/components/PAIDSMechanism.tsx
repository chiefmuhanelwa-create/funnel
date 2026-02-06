import { motion } from 'framer-motion';
import { Package, Megaphone, BookOpen, Handshake, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAIDS_ITEMS = [
  {
    letter: 'P',
    title: 'Products',
    description: 'Digital or physical things you sell',
    icon: Package,
    color: 'from-amber-500 to-amber-600',
  },
  {
    letter: 'A',
    title: 'Ads & Affiliates',
    description: 'Monetizing your attention',
    icon: Megaphone,
    color: 'from-orange-500 to-orange-600',
  },
  {
    letter: 'I',
    title: 'Information',
    description: 'Courses, guides, knowledge products',
    icon: BookOpen,
    color: 'from-amber-600 to-orange-500',
  },
  {
    letter: 'D',
    title: 'Deals',
    description: 'Brand partnerships & collaborations',
    icon: Handshake,
    color: 'from-orange-500 to-amber-500',
  },
  {
    letter: 'S',
    title: 'Services',
    description: 'Skills you offer for income',
    icon: Wrench,
    color: 'from-amber-500 to-orange-600',
  },
];

export default function PAIDSMechanism() {
  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full mb-4 border border-amber-500/30">
            THE MONETIZATION SYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            The PAIDS Framework
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Most creators rely on one income stream. That's why income is unstable.
            <span className="block mt-2 text-white font-semibold">Contentpreneurs build five.</span>
          </p>
        </motion.div>

        {/* PAIDS Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {PAIDS_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl font-black text-white">{item.letter}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20"
        >
          <p className="text-xl md:text-2xl font-bold text-white mb-2">
            Social media builds attention.
          </p>
          <p className="text-xl md:text-2xl font-bold text-amber-400 mb-6">
            PAIDS turns attention into income.
          </p>
          <Link
            to="/contentpreneur-starter-kit"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Learn The PAIDS System
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
