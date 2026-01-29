import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Video,
  Zap,
  DollarSign,
  ChevronDown,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

interface ToolStackSectionProps {
  hasStarterKit: boolean;
}

interface Tool {
  name: string;
  role: string;
  why: string;
  link: string;
}

const POWER_SECTIONS = [
  {
    id: 'thinking',
    title: 'POWER 1 — THINKING & STRATEGY',
    description: '(Where ideas, clarity and decisions come from)',
    icon: Brain,
    ctaText: 'View AI Brain Stack',
    tools: [
      { name: 'ChatGPT', role: 'Brain', why: 'Ideas, scripts, captions, strategy', link: 'https://chat.openai.com' },
      { name: 'Claude', role: 'Writing Partner', why: 'Long-form content, deep thinking', link: 'https://claude.ai' },
      { name: 'Perplexity', role: 'Research', why: 'Fast accurate data gathering', link: 'https://perplexity.ai' },
      { name: 'Notion', role: 'Command Center', why: 'Everything organized in one place', link: 'https://notion.so' },
    ],
  },
  {
    id: 'creation',
    title: 'POWER 2 — CONTENT CREATION',
    description: '(How I produce content at scale)',
    icon: Video,
    ctaText: 'View Creator Toolkit',
    tools: [
      { name: 'CapCut', role: 'Video Editor', why: 'Fast professional edits on mobile', link: 'https://capcut.com' },
      { name: 'Canva', role: 'Design Studio', why: 'Graphics, thumbnails, templates', link: 'https://canva.com' },
      { name: 'Descript', role: 'Audio/Video Magic', why: 'Edit videos by editing text', link: 'https://descript.com' },
      { name: 'Adobe Premiere', role: 'Pro Editor', why: 'When quality matters most', link: 'https://adobe.com/premiere' },
    ],
  },
  {
    id: 'automation',
    title: 'POWER 3 — AUTOMATION & WORKFLOW',
    description: '(Systems that save me 20+ hours/week)',
    icon: Zap,
    ctaText: 'View Automation Stack',
    tools: [
      { name: 'Make.com', role: 'Automation Hub', why: 'Connect apps, automate tasks', link: 'https://make.com' },
      { name: 'Zapier', role: 'Workflow Builder', why: 'No-code automation magic', link: 'https://zapier.com' },
      { name: 'Buffer', role: 'Scheduling', why: 'Post everywhere from one dashboard', link: 'https://buffer.com' },
      { name: 'Manychat', role: 'DM Automation', why: 'Convert followers to customers', link: 'https://manychat.com' },
    ],
  },
  {
    id: 'monetization',
    title: 'POWER 4 — MONETIZATION & SALES',
    description: '(How I turn content into cash)',
    icon: DollarSign,
    ctaText: 'View Money Stack',
    tools: [
      { name: 'Gumroad', role: 'Digital Products', why: 'Sell ebooks, courses instantly', link: 'https://gumroad.com' },
      { name: 'Stripe', role: 'Payment Gateway', why: 'Professional checkout experience', link: 'https://stripe.com' },
      { name: 'ConvertKit', role: 'Email Marketing', why: 'Build and monetize your list', link: 'https://convertkit.com' },
      { name: 'Calendly', role: 'Booking', why: 'Automate consultation scheduling', link: 'https://calendly.com' },
    ],
  },
];

export default function ToolStackSection({ hasStarterKit }: ToolStackSectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <section id="tool-stack" className="py-16 md:py-24">
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
            The NoChill <span className="text-gradient-gold">Tool Stack</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Your Affiliate Money Machine – A system that makes sense
          </p>
        </motion.div>

        {/* Power Sections */}
        <div className="space-y-6">
          {POWER_SECTIONS.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const IconComponent = section.icon;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 backdrop-blur-sm border border-gray-200 hover:border-gray-300 rounded-3xl overflow-hidden transition-colors"
              >
                {/* Section Header */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white">
                          {section.title}
                        </h3>
                        <p className="text-sm md:text-base text-blue-200 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm md:text-base hover:scale-105 transition-transform"
                    >
                      <span className="hidden sm:inline">{section.ctaText}</span>
                      <span className="sm:hidden">View</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                  </div>
                </div>

                {/* Expandable Tools Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 border-t border-gray-200">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-6">
                          {section.tools.map((tool) => (
                            <a
                              key={tool.name}
                              href={tool.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block p-4 md:p-5 rounded-2xl bg-gray-50 backdrop-blur border border-gray-200 hover:border-yellow-500/50 hover:bg-gray-100 transition-all duration-300"
                            >
                              <motion.div
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="h-full"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-lg md:text-xl font-bold text-gradient-gold group-hover:scale-105 transition-transform">
                                    {tool.name}
                                  </h4>
                                  <ExternalLink
                                    size={16}
                                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                                  />
                                </div>
                                <p className="text-sm font-medium text-blue-200 mb-1">
                                  {tool.role}
                                </p>
                                <p className="text-xs text-blue-300/80 leading-relaxed">
                                  {tool.why}
                                </p>
                              </motion.div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA (Only if user doesn't have Starter Kit) */}
        {!hasStarterKit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 text-center"
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              Want My Complete Setup?
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Get the full breakdown, affiliate links, and exact workflows in the Contentpreneur Starter Kit
            </p>
            <Link
              to="/contentpreneur-starter-kit"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Get the Starter Kit — $67
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
