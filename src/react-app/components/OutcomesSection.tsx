import { motion } from 'framer-motion';
import { Target, Lightbulb, Mail, Workflow, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OUTCOMES = [
  {
    icon: Target,
    title: 'Your Monetization Roadmap',
    description: 'A clear plan for how YOUR content becomes income',
  },
  {
    icon: Lightbulb,
    title: 'Your First Product Idea',
    description: 'Know exactly what to sell to your audience',
  },
  {
    icon: Mail,
    title: 'Your Email List System',
    description: 'Own your audience, not rent them from algorithms',
  },
  {
    icon: Workflow,
    title: 'Your Monetization Funnel',
    description: 'Turn followers into customers automatically',
  },
  {
    icon: Package,
    title: 'Your First Offer',
    description: 'Something you can sell within 30 days',
  },
];

export default function OutcomesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-sm font-bold rounded-full mb-4">
            WHAT YOU'LL BUILD
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            In The Next 30 Days,
            <span className="block text-amber-600">You'll Have...</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Not just knowledge. Real assets you can use to make money.
          </p>
        </motion.div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {OUTCOMES.map((outcome, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                <outcome.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{outcome.title}</h3>
              <p className="text-gray-600 text-sm">{outcome.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/contentpreneur-starter-kit"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Start Building Today
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-3 text-sm text-gray-500">Get instant access for just R699</p>
        </motion.div>
      </div>
    </section>
  );
}
