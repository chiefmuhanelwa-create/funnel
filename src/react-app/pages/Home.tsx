import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, DollarSign, TrendingUp } from 'lucide-react';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div>
      <Hero />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    MN
                  </div>
                  <p className="mt-4 text-gray-600">Founder & Creator</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                From Struggling Creator to Multi-Six Figure Business
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                I know what it's like to create content that doesn't convert, to feel invisible
                in a sea of creators, and to wonder if this whole "content creator" thing is
                even worth it.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                After years of trial and error, I developed the PAIDS Framework - the exact
                system I used to go from struggling creator to building a multi-six figure
                content business.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Now I'm on a mission to help other creators do the same.
              </p>
              <Link
                to="/contentpreneur-starter-kit"
                className="mt-8 inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
              >
                Learn the PAIDS Framework
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PAIDS Framework Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              The PAIDS Framework
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Five pillars that separate struggling creators from thriving content businesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { letter: 'P', title: 'Positioning', desc: 'Define your unique space in the market', icon: Star },
              { letter: 'A', title: 'Audience', desc: 'Know exactly who you serve', icon: Users },
              { letter: 'I', title: 'Income', desc: 'Build multiple revenue streams', icon: DollarSign },
              { letter: 'D', title: 'Distribution', desc: 'Get your content seen by the right people', icon: TrendingUp },
              { letter: 'S', title: 'Systems', desc: 'Automate and scale your business', icon: CheckCircle },
            ].map((item, index) => (
              <motion.div
                key={item.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card card-hover text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {item.letter}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/contentpreneur-starter-kit" className="btn-primary text-lg px-8 py-4">
              Master the PAIDS Framework
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the path that fits your journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Resource */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card card-hover border-2 border-gray-100"
            >
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-full">
                  Free
                </span>
                <h3 className="mt-4 text-2xl font-bold text-gray-900">PAIDS Workbook</h3>
                <p className="mt-2 text-gray-600">Start your journey with our free workbook</p>
                <div className="mt-6 text-4xl font-bold text-gray-900">$0</div>
                <Link to="/free/paids-workbook" className="mt-6 btn-outline w-full">
                  Download Free
                </Link>
              </div>
            </motion.div>

            {/* Starter Kit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card card-hover border-2 border-primary-200 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 text-sm font-medium text-white bg-primary-600 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="mt-4 text-2xl font-bold text-gray-900">Starter Kit</h3>
                <p className="mt-2 text-gray-600">Complete 9-module course + bonus workbooks</p>
                <div className="mt-6 text-4xl font-bold text-gray-900">$67</div>
                <Link to="/checkout/starter-kit" className="mt-6 btn-primary w-full">
                  Enroll Now
                </Link>
              </div>
            </motion.div>

            {/* Pro Bundle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card card-hover border-2 border-gray-100"
            >
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded-full">
                  Best Value
                </span>
                <h3 className="mt-4 text-2xl font-bold text-gray-900">Pro Bundle</h3>
                <p className="mt-2 text-gray-600">Everything + advanced resources & ebooks</p>
                <div className="mt-6 text-4xl font-bold text-gray-900">$147</div>
                <Link to="/checkout/contentpreneur-pro" className="mt-6 btn-secondary w-full">
                  Get Pro Bundle
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Our Students Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The PAIDS Framework completely changed how I approach content creation. I went from 2K to 50K followers in 6 months!",
                name: "Sarah M.",
                role: "Lifestyle Creator",
              },
              {
                quote: "Finally a system that makes sense. I landed my first brand deal within weeks of implementing what I learned.",
                name: "James K.",
                role: "Tech Reviewer",
              },
              {
                quote: "Worth every penny. The course paid for itself 10x over with my first sponsored post.",
                name: "Amara N.",
                role: "Fashion Influencer",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="mt-6">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Content Business?
            </h2>
            <p className="mt-6 text-lg text-white/90">
              Join thousands of creators who have already discovered the PAIDS Framework.
              Your journey to content success starts here.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contentpreneur-starter-kit"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Get Started Today
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/free/paids-workbook"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                Try Free Workbook First
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
