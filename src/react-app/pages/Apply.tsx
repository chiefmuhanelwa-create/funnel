import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Lock, Instagram, Target, Zap, DollarSign, User, Mail, Phone, Calendar } from 'lucide-react';

type FormData = {
  igHandle: string;
  creatorStage: string;
  niche: string;
  challenge: string;
  revenue: string;
  readyToInvest: boolean;
  fullName: string;
  email: string;
  whatsapp: string;
};

type Screen = 'form' | 'disqualify' | 'disqualify-confirm' | 'booking' | 'booking-confirmed';

const CREATOR_STAGES = [
  'Yes — I post consistently',
  'Yes — but not regularly',
  "No — I'm just getting started",
  "I've never posted before",
];

const CHALLENGES = [
  { value: 'audience', title: "I can't build an audience that sticks", subtitle: 'Posts get views but no followers' },
  { value: 'monetise', title: "I have an audience but I can't monetise", subtitle: "Followers aren't turning into income" },
  { value: 'strategy', title: 'I have no system or strategy', subtitle: 'I post randomly and hope for the best' },
  { value: 'conversion', title: "My content doesn't convert to sales", subtitle: 'Content gets attention but not clients' },
];

const REVENUE_OPTIONS = [
  "R0 — I haven't made money yet",
  'R1 – R5,000 / month',
  'R5,000 – R15,000 / month',
  'R15,000+ / month',
];

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(0);
  const [screen, setScreen] = useState<Screen>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [disqualifyEmail, setDisqualifyEmail] = useState('');

  const [formData, setFormData] = useState<FormData>({
    igHandle: '',
    creatorStage: '',
    niche: '',
    challenge: '',
    revenue: '',
    readyToInvest: false,
    fullName: '',
    email: '',
    whatsapp: '',
  });

  const progress = (currentStep / 7) * 100;

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.igHandle.trim()) {
          newErrors.igHandle = 'Please enter your Instagram handle';
        }
        break;
      case 2:
        if (!formData.creatorStage) {
          newErrors.creatorStage = 'Please select an option';
        }
        break;
      case 3:
        if (formData.niche.trim().length < 5) {
          newErrors.niche = 'Please describe your niche (at least 5 characters)';
        }
        break;
      case 4:
        if (!formData.challenge) {
          newErrors.challenge = 'Please select an option';
        }
        break;
      case 5:
        if (!formData.revenue) {
          newErrors.revenue = 'Please select an option';
        }
        break;
      case 7:
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Please enter your full name';
        }
        if (!formData.email.includes('@')) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.whatsapp.trim()) {
          newErrors.whatsapp = 'Please enter your WhatsApp number';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (step: number) => {
    if (validateStep(step)) {
      nextStep();
    }
  };

  const handleQualify = () => {
    setFormData(prev => ({ ...prev, readyToInvest: true }));
    nextStep();
  };

  const handleDisqualify = () => {
    // Redirect disqualified leads directly to the starter kit lessons page
    window.location.href = 'https://www.contentpreneurhub.online/contentpreneur-starter-kit';
  };

  const handleSubmit = () => {
    if (validateStep(7)) {
      console.log('Application submitted:', formData);
      // TODO: POST data to webhook or CRM
      setScreen('booking');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedEvent, setBookedEvent] = useState<{ date: string; time: string } | null>(null);

  // Load Calendly widget script and listen for booking events
  useEffect(() => {
    if (screen !== 'booking') return;

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        const eventDetails = e.data.payload;
        const eventDate = new Date(eventDetails.event?.start_time || eventDetails.invitee?.scheduled_event?.start_time);

        const formattedDate = eventDate.toLocaleDateString('en-ZA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const formattedTime = eventDate.toLocaleTimeString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit',
        });

        setBookedEvent({ date: formattedDate, time: formattedTime });

        // Submit qualified lead data and send confirmation email
        fetch('/api/qualified-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            whatsapp: formData.whatsapp,
            igHandle: formData.igHandle,
            creatorStage: formData.creatorStage,
            niche: formData.niche,
            challenge: formData.challenge,
            revenue: formData.revenue,
            bookedDate: formattedDate,
            bookedTime: formattedTime,
          }),
        }).catch(console.error);

        setScreen('booking-confirmed');
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [screen, formData]);

  const handleDisqualifySubmit = async () => {
    if (!disqualifyEmail.includes('@')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/unqualified-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: disqualifyEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setScreen('disqualify-confirm');
    } catch (error) {
      console.error('Error submitting:', error);
      // Still show confirmation even if API fails - better UX
      setScreen('disqualify-confirm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
  };

  // Disqualify Screen (fallback - normally redirects to external URL)
  if (screen === 'disqualify') {
    return (
      <div className="relative min-h-screen flex items-center">
        {/* Background - matches homepage */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }} className="text-center max-w-2xl mx-auto">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6">🙏</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              No stress — we've got you.
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-10 max-w-xl mx-auto">
              A 1-on-1 coaching call may not be the right move right now — and that's completely okay.
              Drop your email below and we'll send you the Contentpreneur Starter Kit so you can build at your own pace.
            </p>

            <div className="max-w-md mx-auto">
              <input
                type="email"
                value={disqualifyEmail}
                onChange={(e) => setDisqualifyEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-5 py-4 lg:py-5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors mb-4 text-base lg:text-lg shadow-sm"
              />
              <button
                onClick={handleDisqualifySubmit}
                disabled={isSubmitting}
                className="w-full py-4 lg:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-2xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all text-base lg:text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Me the Starter Kit →'}
              </button>
              <p className="text-gray-500 text-sm sm:text-base mt-6">
                When you're ready to invest in your growth, come back. The door is always open.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Disqualify Confirmation (fallback)
  if (screen === 'disqualify-confirm') {
    return (
      <div className="relative min-h-screen flex items-center">
        {/* Background - matches homepage */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }} className="text-center max-w-2xl mx-auto">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6">✅</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Check your inbox!
            </h2>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto">
              We've sent the Contentpreneur Starter Kit to your email. Start building at your own pace, and come back when you're ready to level up.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Booking Screen - Choose time
  if (screen === 'booking') {
    return (
      <div className="relative min-h-screen">
        {/* Background - matches homepage */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }} className="text-center">
            <p className="text-amber-600 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
              You're approved ✓
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 leading-tight">
              Book Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Call</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
              Select a date and time that works for you below. After booking, you'll receive an email with a 5-minute video to prepare.
            </p>

            {/* Two-column layout on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-5xl mx-auto">
              {/* Calendly Embed */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/chiefmuhanelwa/contentpreneurship?hide_gdpr_banner=1&background_color=ffffff&text_color=1f2937&primary_color=f59e0b"
                  style={{ minWidth: '100%', height: '650px' }}
                />
              </div>

              {/* Required Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 text-left lg:sticky lg:top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Calendar className="text-white" size={20} />
                  </div>
                  <h3 className="text-gray-900 font-black text-lg lg:text-xl">After you book:</h3>
                </div>
                <div className="space-y-5 md:space-y-6">
                  {[
                    "You'll receive a confirmation email with a 5-minute pre-call video. Watch it before your session.",
                    "Save our WhatsApp number so you receive your reminder 1 hour before the session.",
                    "Come with clarity on your goals — the more specific, the more valuable your session.",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-gray-700 text-sm sm:text-base">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Booking Confirmed Screen - After Calendly booking completes
  if (screen === 'booking-confirmed') {
    return (
      <div className="relative min-h-screen flex items-center">
        {/* Background - matches homepage */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }} className="text-center max-w-2xl mx-auto">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6">🎉</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-6 leading-tight">
              You're <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Booked!</span>
            </h1>

            {bookedEvent && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 md:p-8 lg:p-10 mb-10 inline-block shadow-xl">
                <p className="text-white/80 text-sm sm:text-base mb-2">Your Strategy Session</p>
                <p className="text-white text-xl sm:text-2xl lg:text-3xl font-black">
                  {bookedEvent.date}
                </p>
                <p className="text-white text-lg sm:text-xl lg:text-2xl font-semibold">
                  {bookedEvent.time}
                </p>
              </div>
            )}

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 lg:p-10 text-left max-w-xl mx-auto shadow-xl">
              <h3 className="text-amber-600 font-black mb-4 text-lg lg:text-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-amber-600" />
                </div>
                Check Your Email
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-5">
                We've sent a confirmation to <strong className="text-gray-900">{formData.email}</strong> with:
              </p>
              <ul className="space-y-4 text-gray-600 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <span>Your booking details and calendar invite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <span><strong className="text-gray-900">5-minute pre-call video</strong> — watch this before your session (required)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <span>WhatsApp number for your 1-hour reminder</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-500 text-sm sm:text-base mt-10">
              Questions? WhatsApp us at <span className="text-amber-600 font-semibold">+27 XX XXX XXXX</span>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form Screen
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background - matches homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,179,8,0.05),transparent_50%)]" />
      </div>

      {/* Progress Bar - full width like homepage nav */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Step {currentStep} of 7</span>
            <div className="flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              3 spots left
            </div>
          </div>
          <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - centered vertically like homepage hero */}
      <div className="flex-1 flex items-center justify-center pt-20 md:pt-24 pb-12 relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-xl lg:max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Intro */}
          {currentStep === 0 && (
            <motion.div key="step0" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Strategy Session Application
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                Before we book your call — let's make sure you qualify.
              </h1>
              <p className="text-gray-600 md:text-lg mb-6">
                This takes 90 seconds. We only work with serious creators who are ready to build. These answers determine whether we're a fit.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mb-6">
                <p className="text-gray-800 text-sm md:text-base">
                  A 1-on-1 Contentpreneur Strategy Session — we map your content business using the PAIDS Framework and show you exactly where you're leaving money on the table.
                </p>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-2xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:-translate-y-0.5 transition-all md:text-lg"
              >
                I'm ready to apply →
              </button>

              <p className="text-gray-500 text-xs md:text-sm text-center mt-4">
                We only take a handful of creators per month. If this intake is full, you'll roll to the next available slot.
              </p>
            </motion.div>
          )}

          {/* Step 1: IG Handle */}
          {currentStep === 1 && (
            <motion.div key="step1" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 1 of 7 — Your Profile
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                What's your Instagram handle?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                We'll review your profile before the call to make our session as useful as possible.
              </p>

              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.igHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, igHandle: e.target.value }))}
                  placeholder="yourhandle"
                  className={`w-full pl-12 pr-4 py-4 md:py-5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors md:text-lg shadow-sm ${errors.igHandle ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              {errors.igHandle && <p className="text-red-500 text-xs md:text-sm mt-2">{errors.igHandle}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 md:py-4 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 md:text-base"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(1)}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Creator Stage */}
          {currentStep === 2 && (
            <motion.div key="step2" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 2 of 7 — Creator Stage
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Are you currently creating content?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                Be honest — this helps us understand where to meet you.
              </p>

              <div className="space-y-3">
                {CREATOR_STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setFormData(prev => ({ ...prev, creatorStage: stage }))}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all shadow-sm ${
                      formData.creatorStage === stage
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`font-medium md:text-lg ${formData.creatorStage === stage ? 'text-gray-900' : 'text-gray-700'}`}>
                      {stage}
                    </span>
                  </button>
                ))}
              </div>
              {errors.creatorStage && <p className="text-red-500 text-xs md:text-sm mt-2">{errors.creatorStage}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 md:py-4 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 md:text-base"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(2)}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Niche */}
          {currentStep === 3 && (
            <motion.div key="step3" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 3 of 7 — Your Niche
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                What space are you building in?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                Tell us your niche or the niche you want to be known for. Be specific.
              </p>

              <div className="relative">
                <Target className="absolute left-4 top-4 md:top-5 text-gray-400" size={18} />
                <textarea
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                  placeholder="e.g. fitness coaching for African women, personal finance for young professionals, real estate investing..."
                  rows={4}
                  className={`w-full pl-12 pr-4 py-4 md:py-5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors resize-none md:text-lg shadow-sm ${errors.niche ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              {errors.niche && <p className="text-red-500 text-xs md:text-sm mt-2">{errors.niche}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 md:py-4 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 md:text-base"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(3)}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Challenge */}
          {currentStep === 4 && (
            <motion.div key="step4" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 4 of 7 — Your Challenge
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                What's your biggest obstacle right now?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                These responses determine whether we're a fit. Be honest.
              </p>

              <div className="space-y-3">
                {CHALLENGES.map((challenge) => (
                  <button
                    key={challenge.value}
                    onClick={() => setFormData(prev => ({ ...prev, challenge: challenge.value }))}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all shadow-sm ${
                      formData.challenge === challenge.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 block md:text-lg">{challenge.title}</span>
                    <span className="text-gray-500 text-sm md:text-base">{challenge.subtitle}</span>
                  </button>
                ))}
              </div>
              {errors.challenge && <p className="text-red-500 text-xs md:text-sm mt-2">{errors.challenge}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 md:py-4 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 md:text-base"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(4)}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Revenue */}
          {currentStep === 5 && (
            <motion.div key="step5" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 5 of 7 — Your Revenue
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                How much do you currently earn from your content or business?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                Monthly average. We use this to understand where you are.
              </p>

              <div className="space-y-3">
                {REVENUE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, revenue: option }))}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all shadow-sm ${
                      formData.revenue === option
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-gray-700 md:text-lg">{option}</span>
                  </button>
                ))}
              </div>
              {errors.revenue && <p className="text-red-500 text-xs md:text-sm mt-2">{errors.revenue}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 md:py-4 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 md:text-base"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(5)}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-xl hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Investment Qualifier */}
          {currentStep === 6 && (
            <motion.div key="step6" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 6 of 7 — Final Qualifier
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Are you in a position to invest in your growth right now?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                Our strategy session is complimentary for qualified applicants. If we're a fit, we'll discuss working together. Our coaching starts from R9,500. This question helps us respect everyone's time.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mb-6">
                <p className="text-gray-800 text-sm md:text-base">
                  We only book calls with people who are serious about building a content business. If now isn't the right time financially, we have self-study resources that may serve you better.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleQualify}
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-2xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 md:text-lg"
                >
                  <Check size={18} /> Yes — I'm ready to invest in my growth
                </button>
                <button
                  onClick={handleDisqualify}
                  className="w-full py-4 md:py-5 bg-gray-100 border-2 border-gray-300 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all md:text-lg"
                >
                  Not right now — I'm not in a position to invest
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 7: Contact Info */}
          {currentStep === 7 && (
            <motion.div key="step7" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-amber-600 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3">
                Step 7 of 7 — Almost Done
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Last step. Where can we reach you?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-5">
                We'll send your booking confirmation and a short video to watch before your call.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Full name"
                    className={`w-full pl-12 pr-4 py-4 md:py-5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors md:text-lg shadow-sm ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    className={`w-full pl-12 pr-4 py-4 md:py-5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors md:text-lg shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="e.g. 0812345678"
                    className={`w-full pl-12 pr-4 py-4 md:py-5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none transition-colors md:text-lg shadow-sm ${errors.whatsapp ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 md:py-5 mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-black rounded-2xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all md:text-lg"
              >
                Book My Strategy Session →
              </button>

              <p className="text-gray-500 text-xs md:text-sm text-center mt-4 flex items-center justify-center gap-2">
                <Lock size={12} /> Your details are private and secure. No spam, ever.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
