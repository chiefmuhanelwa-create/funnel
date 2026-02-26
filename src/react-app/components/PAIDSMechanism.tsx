import { motion } from 'framer-motion';
import { Package, Megaphone, BookOpen, Users, Wrench, ArrowRight } from 'lucide-react';
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
    icon: Users,
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
    <section className="py-16 md:py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Neon glow background effects */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            THE MONETIZATION SYSTEM
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            The <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">PAIDS</span> Framework
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Most creators rely on one income stream. That's why income is unstable.
            <span className="block mt-2 text-amber-400 font-bold drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">Contentpreneurs build five.</span>
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
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.3)]`}>
                <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{item.letter}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-2xl p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.1)]"
        >
          <p className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Social media builds attention.
          </p>
          <p className="text-xl md:text-2xl font-bold text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            PAIDS turns attention into income.
          </p>
          <Link
            to="/contentpreneur-starter-kit"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-lg rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-[1.02] transition-all duration-300"
          >
            Learn The PAIDS System
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
