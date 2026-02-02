import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Loader2,
  Send,
  MessageSquare,
  Target,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

// Calendly URL - update this with your actual Calendly link
const CALENDLY_URL = 'https://calendly.com/mrnochill/strategy-session';

export default function Consultation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    currentStatus: '',
    goals: '',
    challenges: '',
    budget: '',
    preferredDate: '',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/consultation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-tight py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 md:p-14 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-success-400" size={40} />
            </div>
            <h1 className="text-section text-gray-900 mb-4">
              Application <span className="text-gradient-gold">Received!</span>
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
              Thank you for your interest in booking a strategy call. We'll review your application
              and get back to you within 24-48 hours to confirm availability and next steps.
            </p>
            <div className="glass-card p-4 mb-8 inline-block">
              <p className="text-sm text-gray-500">
                Check your inbox for a confirmation email at <strong className="text-gray-900">{formData.email}</strong>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <Link to="/members" className="btn-secondary">
                Browse Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-20">
      {/* Back Navigation */}
      <div className="container-content pt-6">
        <Link
          to="/products/coaching"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Coaching
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="badge badge-gold mb-4">
                <Calendar size={12} className="mr-1" />
                Book Your Session
              </span>
              <h1 className="text-section md:text-section-lg text-gray-900">
                1:1 Strategy <span className="text-gradient-gold">Session</span>
              </h1>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                Get personalized guidance from Mr. NoChill. Choose to book directly
                or fill out an application if you have specific questions.
              </p>

              {/* Direct Calendly Booking */}
              <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Book?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Schedule your 60-minute strategy session directly via Calendly
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Calendar size={18} />
                  Book on Calendly
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
                <span className="text-gray-400 text-sm">or fill out application below</span>
                <div className="h-px bg-gray-200 flex-1 max-w-[100px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 md:pb-28">
        <div className="container-content">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Information</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+27 ..."
                    />
                  </div>
                  <div>
                    <label className="label">Instagram Handle</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="input"
                      placeholder="@yourhandle"
                    />
                  </div>
                </div>

                <div className="divider my-8" />

                <h2 className="text-xl font-semibold text-gray-900 mb-6">About Your Business</h2>

                <div className="mb-6">
                  <label className="label">Current Status *</label>
                  <select
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select your current stage...</option>
                    <option value="thinking">Thinking about starting</option>
                    <option value="just-started">Just getting started (0-6 months)</option>
                    <option value="growing">Growing (6-12 months)</option>
                    <option value="established">Established (1-2 years)</option>
                    <option value="scaling">Scaling (2+ years)</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="label">What are your main goals? *</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    className="input min-h-[100px]"
                    placeholder="E.g., I want to grow to 10K followers and land my first brand deal..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="label">What are your biggest challenges right now? *</label>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleChange}
                    className="input min-h-[100px]"
                    placeholder="E.g., I'm struggling with content consistency and don't know how to monetize..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">Investment Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select range...</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1500">$500 - $1,500</option>
                      <option value="1500-5000">$1,500 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Preferred Date/Time</label>
                    <input
                      type="text"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="input"
                      placeholder="E.g., Weekday afternoons"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="label">Anything else you'd like us to know?</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="input min-h-[80px]"
                    placeholder="Optional..."
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-error-500/10 border border-error-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-error-400 shrink-0" size={20} />
                    <p className="text-error-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary btn-lg w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Application
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-400">
                  We'll respond within 24-48 hours with next steps.
                </p>
              </form>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* What to Expect */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-gold-500" />
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: Clock, text: '60-minute video call' },
                    { icon: Video, text: 'Via Zoom (link provided)' },
                    { icon: FileText, text: '90-day action plan' },
                    { icon: MessageSquare, text: '7-day email follow-up' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <item.icon size={16} className="text-gold-500" />
                      </div>
                      <span className="text-sm text-gray-600">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Investment */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-gold-500" />
                  Investment
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gradient-gold">$1,500</span>
                  <span className="text-gray-400 line-through">$2,500</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  60-minute personalized strategy session with Mr. NoChill.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Book Now
                </a>
              </div>

              {/* Questions */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Have Questions?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Email us at{' '}
                  <a
                    href="mailto:hello@contentpreneurhub.online"
                    className="text-gold-500 hover:text-gold-400"
                  >
                    hello@contentpreneurhub.online
                  </a>
                </p>
                <p className="text-sm text-gray-400">
                  Response time: 24-48 hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
