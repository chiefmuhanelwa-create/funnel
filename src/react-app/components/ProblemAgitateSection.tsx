import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Clock, DollarSign, CheckCircle } from 'lucide-react';

export default function ProblemAgitateSection() {
  const painPoints = [
    {
      icon: AlertCircle,
      title: 'The Frustration',
      desc: "You post daily, reply to every DM, chase trends... but still can't quit your 9-5. The hustle is real, but the income isn't.",
    },
    {
      icon: TrendingDown,
      title: 'The Confusion',
      desc: "Everyone's selling you a different 'secret.' You've spent thousands learning, but still don't know what actually works.",
    },
    {
      icon: Clock,
      title: 'The Time Waste',
      desc: "Hours editing videos, writing captions, engaging... for what? A few likes? Your time is worth money.",
    },
    {
      icon: DollarSign,
      title: 'The Broken Promises',
      desc: "'100K followers = financial freedom.' That's the lie. Now you're here with the audience but no monetization plan.",
    },
  ];

  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section 1: Main Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight px-4">
            <span className="text-gray-900 block md:inline">You're Creating Content.</span>
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              But Not Making Money.
            </span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Sound familiar? You've got followers and engagement... but your bank account tells a different story.
          </p>
        </motion.div>

        {/* Section 2: Pain Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white border border-gray-200 hover:border-red-300 p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md"
            >
              {/* Icon Container */}
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-red-100 to-red-50 border border-red-200 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                <point.icon className="w-4 h-4 md:w-6 md:h-6 text-red-500" />
              </div>

              <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2 leading-tight">
                {point.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section 3: Solution Reveal Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-2xl md:rounded-3xl blur-2xl" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white border-2 border-amber-200 p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-lg"
          >
            {/* Center Icon Container */}
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>

            {/* Headline */}
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 text-center tracking-tight mb-4 md:mb-6 px-4">
              Here's The Truth Nobody Tells You
            </h3>

            {/* Main Message */}
            <div className="text-center mb-4 md:mb-6 px-4">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Content creation doesn't make you money.
              </p>
              <p className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mt-2">
                Content monetization systems do.
              </p>
            </div>

            {/* Follow-up Copy */}
            <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto leading-relaxed px-4">
              You don't need more followers or another 'viral' course. You need a proven system that turns your existing audience into paying customers—and I'm about to show you exactly how I did it.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
