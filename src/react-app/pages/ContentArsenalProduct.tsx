import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Layers,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  Target,
  FileText,
  Palette,
  Calendar,
  BarChart,
  MessageSquare,
  Download,
} from 'lucide-react';
import BackButton from '../components/BackButton';

export default function ContentArsenalProduct() {
  const templates = [
    { icon: FileText, name: 'Content Calendar Templates', count: '12 templates' },
    { icon: Palette, name: 'Brand Kit Templates', count: '8 templates' },
    { icon: MessageSquare, name: 'Caption Templates', count: '50+ captions' },
    { icon: BarChart, name: 'Analytics Dashboards', count: '5 dashboards' },
    { icon: Calendar, name: 'Launch Checklists', count: '6 checklists' },
    { icon: Target, name: 'Goal Setting Worksheets', count: '4 worksheets' },
  ];

  const whatYouGet = [
    'Notion templates for content planning',
    'Canva templates for social graphics',
    'Email swipe files and sequences',
    'Caption templates that convert',
    'Hashtag research templates',
    'Analytics tracking spreadsheets',
    'Launch planning checklists',
    'Brand voice guidelines template',
    'Quarterly review templates',
    'Collaboration pitch templates',
  ];

  return (
    <div className="bg-white pt-20">
      {/* Back Navigation - Context aware */}
      <div className="container-content pt-6">
        <BackButton />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="glow-orb w-96 h-96 -top-48 -right-48 opacity-30" />
        <div className="glow-orb-accent w-80 h-80 bottom-0 -left-40 opacity-20" />

        <div className="container-content relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-gold mb-4">
                <Layers size={12} className="mr-1" />
                Template Pack
              </span>

              <h1 className="text-hero md:text-hero-lg text-gray-900 leading-tight">
                Content Arsenal{' '}
                <span className="text-gradient-gold">Expansion Pack</span>
              </h1>

              <p className="mt-6 text-body-lg text-gray-600 max-w-2xl mx-auto">
                Stop reinventing the wheel. Get 100+ proven templates, swipe files,
                and tools to streamline your content creation and save 10+ hours every week.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-gray-600">
                  <FileText className="mr-2 text-gold-500" size={18} />
                  <span>100+ Templates</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="mr-2 text-gold-500" size={18} />
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Zap className="mr-2 text-gold-500" size={18} />
                  <span>Lifetime Updates</span>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-4">
                <span className="text-5xl font-bold text-gradient-gold">$37</span>
                <span className="text-2xl text-gray-400 line-through">$97</span>
                <span className="badge badge-success">62% OFF</span>
              </div>

              <Link
                to="/checkout/content-arsenal"
                className="mt-8 btn-primary btn-lg inline-flex group animate-glow-pulse"
              >
                Get the Arsenal
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-success-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold-500" />
                  <span>Instant Access</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">What's Inside</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              6 Categories of <span className="text-gradient-gold">Power Tools</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Everything organized and ready to use - just customize and go
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mb-4">
                  <template.icon className="text-gold-500" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gold-400">{template.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full List */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="container-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-success mb-4">
                <CheckCircle size={12} className="mr-1" />
                Complete List
              </span>
              <h2 className="text-section md:text-section-lg text-gray-900">
                Everything You <span className="text-gradient-gold">Get</span>
              </h2>
              <p className="mt-4 text-gray-500">
                Professionally designed, tested, and optimized for results:
              </p>

              <ul className="mt-8 space-y-3">
                {whatYouGet.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-success-400 shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8 glow-gold">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  Save 10+ Hours Every Week
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gradient-gold mb-2">100+</div>
                    <div className="text-sm text-gray-500">Templates & Tools</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 mb-1">10h</div>
                      <div className="text-xs text-gray-500">Weekly Savings</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 mb-1">$0</div>
                      <div className="text-xs text-gray-500">Per Template</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    One-time purchase. Lifetime access.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">Perfect For</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Who Is This <span className="text-gradient-gold">For?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Content Creators',
                desc: 'Streamline your workflow and post consistently without burning out.',
              },
              {
                icon: Target,
                title: 'Small Business Owners',
                desc: 'Create professional content without hiring a marketing team.',
              },
              {
                icon: BarChart,
                title: 'Marketing Teams',
                desc: 'Standardize your content process across team members.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold-500" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4">User Feedback</span>
            <h2 className="text-section md:text-section-lg text-gray-900">
              Creators Love <span className="text-gradient-gold">These Tools</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "The content calendar template alone saved me hours of planning. Now I batch-create a month of content in one afternoon.",
                name: "Sarah K.",
                role: "Lifestyle Creator",
              },
              {
                quote: "The caption templates are gold. I used to stare at blank screens. Now I just fill in the blanks and post.",
                name: "James P.",
                role: "Fitness Coach",
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
                    <Star key={star} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-40" />

        <div className="container-narrow relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 text-center glow-gold-lg"
          >
            <h2 className="text-section md:text-section-lg text-gray-900 mb-4">
              Arm Your Content <span className="text-gradient-gold">Arsenal</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              100+ templates waiting to save you hours of work every week
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-gold">$37</span>
              <span className="text-2xl text-gray-400 line-through">$97</span>
            </div>

            <Link
              to="/checkout/content-arsenal"
              className="btn-primary btn-lg inline-flex group"
            >
              Get Instant Access
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-success-400" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-gold-500" />
                <span>Lifetime Updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
