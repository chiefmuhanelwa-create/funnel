import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const OBJECTIONS = [
  {
    question: "I don't have enough followers yet",
    answer: "You don't need a huge audience to start monetizing. The PAIDS framework shows you how to monetize at ANY level. I started making money with less than 10,000 followers. The key is having a system, not just followers.",
  },
  {
    question: "Will this work in Africa?",
    answer: "Yes! I built this system FROM Africa. The strategies work whether you're in Lagos, Johannesburg, Nairobi, or anywhere else. We have African-specific payment solutions, and the monetization principles work globally.",
  },
  {
    question: "I don't know what to sell",
    answer: "That's exactly what the Niche Finder Workbook solves. You'll discover what your audience actually wants to buy, and the course shows you how to create products they'll pay for. Most creators are sitting on gold — they just don't know how to package it.",
  },
  {
    question: "I don't have money to start a business",
    answer: "The entire system costs less than a night out — $67. And the first module shows you how to start with ZERO budget. Everything I teach can be done with just your phone. No expensive tools required.",
  },
  {
    question: "Courses don't work",
    answer: "You're right — courses without SYSTEMS don't work. This isn't a passive course. It's an action-based system with workbooks, frameworks, and clear next steps. You won't just watch — you'll BUILD.",
  },
  {
    question: "My audience doesn't buy anything",
    answer: "Your audience doesn't buy because they don't know what you're selling or WHY they need it. The PAIDS framework teaches you how to create offers people actually want and how to present them in a way that converts.",
  },
  {
    question: "I don't have time",
    answer: "The course is designed for busy creators. Videos are short and actionable. You can complete the entire system in a few weeks doing 30 minutes a day. Plus, you get lifetime access — go at your own pace.",
  },
  {
    question: "I'm not an expert in anything",
    answer: "You don't need to be an 'expert.' You need to be one step ahead of your audience. If you've achieved anything, overcome anything, or learned anything — you can teach it. The course helps you find YOUR unique angle.",
  },
];

function ObjectionItem({ objection, index }: { objection: typeof OBJECTIONS[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageCircle size={20} className="text-amber-500 flex-shrink-0" />
          <span className="font-semibold text-gray-900">"{objection.question}"</span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-5 pb-5 border-t border-gray-100"
        >
          <p className="text-gray-600 pt-4 leading-relaxed">{objection.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ObjectionSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-sm font-bold rounded-full mb-4">
            HONEST ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            What If You're Thinking...
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Let me address the thoughts in your head right now.
          </p>
        </motion.div>

        {/* Objections List */}
        <div className="space-y-3">
          {OBJECTIONS.map((objection, idx) => (
            <ObjectionItem key={idx} objection={objection} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
