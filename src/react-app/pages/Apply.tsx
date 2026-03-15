import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Lock, Instagram, Target, Zap, DollarSign, User, Mail, Phone } from 'lucide-react';

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

type Screen = 'form' | 'disqualify' | 'disqualify-confirm' | 'booking';

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
    setFormData(prev => ({ ...prev, readyToInvest: false }));
    setScreen('disqualify');
  };

  const handleSubmit = () => {
    if (validateStep(7)) {
      console.log('Application submitted:', formData);
      // TODO: POST data to webhook or CRM
      setScreen('booking');
    }
  };

  const handleDisqualifySubmit = () => {
    if (!disqualifyEmail.includes('@')) return;
    console.log('Starter kit requested for:', disqualifyEmail);
    // TODO: POST email to webhook or email service
    setScreen('disqualify-confirm');
  };

  const stepVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
  };

  // Disqualify Screen
  if (screen === 'disqualify') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20">
        <div className="max-w-md mx-auto px-5 py-16 text-center">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }}>
            <div className="text-6xl mb-6">🙏</div>
            <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
              No stress — we've got you.
            </h2>
            <p className="text-[#888880] mb-8">
              A 1-on-1 coaching call may not be the right move right now — and that's completely okay.
              Drop your email below and we'll send you our free Contentpreneur Starter Kit so you can build at your own pace.
            </p>

            <div className="max-w-xs mx-auto">
              <input
                type="email"
                value={disqualifyEmail}
                onChange={(e) => setDisqualifyEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-[#181818] border border-[#2A2A2A] rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors mb-4"
              />
              <button
                onClick={handleDisqualifySubmit}
                className="w-full py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne']"
              >
                Send Me the Free Starter Kit →
              </button>
              <p className="text-[#888880] text-sm mt-6">
                When you're ready to invest in your growth, come back. The door is always open.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Disqualify Confirmation
  if (screen === 'disqualify-confirm') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20">
        <div className="max-w-md mx-auto px-5 py-16 text-center">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }}>
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
              Check your inbox!
            </h2>
            <p className="text-[#888880]">
              We've sent the Contentpreneur Starter Kit to your email. Start building at your own pace, and come back when you're ready to level up.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Booking Screen
  if (screen === 'booking') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20">
        <div className="max-w-lg mx-auto px-5 py-8">
          <motion.div {...stepVariants} transition={{ duration: 0.35 }} className="text-center">
            <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
              You're approved ✓
            </p>
            <h1 className="text-5xl font-bold text-[#F0EEE8] mb-4 font-['Bebas_Neue'] tracking-wider">
              YOU ARE <span className="text-[#C9A84C]">BOOKED</span>
            </h1>
            <p className="text-[#888880] text-sm mb-8 max-w-sm mx-auto">
              Pick a time below. Watch the short video we send you before the call — sessions where this isn't done get rescheduled.
            </p>

            {/* Calendly Embed */}
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl overflow-hidden mb-8">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/chiefmuhanelwa/contentpreneurship"
                style={{ minWidth: '320px', height: '550px' }}
              />
              <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async />
            </div>

            {/* Required Section */}
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 text-left">
              <h3 className="text-[#F0EEE8] font-bold mb-5 font-['Syne']">Required before your call:</h3>
              <div className="space-y-4">
                {[
                  "Watch the 5-min pre-call video we send to your email. Calls with unprepped applicants get cancelled.",
                  "Save our WhatsApp number so you receive your reminder 1 hour before the session.",
                  "Come with clarity on your goals — the more specific, the more valuable your session.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-[#C9A84C] text-[#0A0A0A] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-[#888880] text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form Screen
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#181818] border-b border-[#2A2A2A] z-50">
        <div className="max-w-md mx-auto px-5 py-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#888880] font-medium">Step {currentStep} of 7</span>
            <div className="flex items-center gap-2 text-[#C9A84C] text-xs font-semibold">
              <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
              3 seats left
            </div>
          </div>
          <div className="h-1 bg-[#2A2A2A] rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-5 pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {/* Step 0: Intro */}
          {currentStep === 0 && (
            <motion.div key="step0" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Strategy Session Application
              </p>
              <h1 className="text-2xl font-bold text-[#F0EEE8] mb-4 leading-tight font-['Syne']">
                Before we book your call — let's make sure you qualify.
              </h1>
              <p className="text-[#888880] mb-6">
                This takes 90 seconds. We only work with serious creators who are ready to build. These answers determine whether we're a fit.
              </p>

              <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-5 mb-6">
                <p className="text-[#F0EEE8] text-sm">
                  A 1-on-1 Contentpreneur Strategy Session — we map your content business using the PAIDS Framework and show you exactly where you're leaving money on the table.
                </p>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all font-['Syne']"
              >
                I'm ready to apply →
              </button>

              <p className="text-[#888880] text-xs text-center mt-4">
                We only take a handful of creators per month. If this intake is full, you'll roll to the next available slot.
              </p>
            </motion.div>
          )}

          {/* Step 1: IG Handle */}
          {currentStep === 1 && (
            <motion.div key="step1" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 1 of 7 — Your Profile
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                What's your Instagram handle?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                We'll review your profile before the call to make our session as useful as possible.
              </p>

              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888880]" size={18} />
                <input
                  type="text"
                  value={formData.igHandle}
                  onChange={(e) => setFormData(prev => ({ ...prev, igHandle: e.target.value }))}
                  placeholder="yourhandle"
                  className={`w-full pl-12 pr-4 py-4 bg-[#181818] border rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors ${errors.igHandle ? 'border-red-500' : 'border-[#2A2A2A]'}`}
                />
              </div>
              {errors.igHandle && <p className="text-red-500 text-xs mt-2">{errors.igHandle}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#888880] rounded-lg hover:border-[#888880] hover:text-[#F0EEE8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(1)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Creator Stage */}
          {currentStep === 2 && (
            <motion.div key="step2" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 2 of 7 — Creator Stage
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                Are you currently creating content?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                Be honest — this helps us understand where to meet you.
              </p>

              <div className="space-y-3">
                {CREATOR_STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setFormData(prev => ({ ...prev, creatorStage: stage }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      formData.creatorStage === stage
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                        : 'border-[#2A2A2A] bg-[#181818] hover:border-[#888880]'
                    }`}
                  >
                    <span className={`font-medium ${formData.creatorStage === stage ? 'text-[#F0EEE8]' : 'text-[#F0EEE8]'}`}>
                      {stage}
                    </span>
                  </button>
                ))}
              </div>
              {errors.creatorStage && <p className="text-red-500 text-xs mt-2">{errors.creatorStage}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#888880] rounded-lg hover:border-[#888880] hover:text-[#F0EEE8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(2)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Niche */}
          {currentStep === 3 && (
            <motion.div key="step3" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 3 of 7 — Your Niche
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                What space are you building in?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                Tell us your niche or the niche you want to be known for. Be specific.
              </p>

              <div className="relative">
                <Target className="absolute left-4 top-4 text-[#888880]" size={18} />
                <textarea
                  value={formData.niche}
                  onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                  placeholder="e.g. fitness coaching for African women, personal finance for young professionals, real estate investing..."
                  rows={4}
                  className={`w-full pl-12 pr-4 py-4 bg-[#181818] border rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none ${errors.niche ? 'border-red-500' : 'border-[#2A2A2A]'}`}
                />
              </div>
              {errors.niche && <p className="text-red-500 text-xs mt-2">{errors.niche}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#888880] rounded-lg hover:border-[#888880] hover:text-[#F0EEE8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Challenge */}
          {currentStep === 4 && (
            <motion.div key="step4" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 4 of 7 — Your Challenge
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                What's your biggest obstacle right now?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                These responses determine whether we're a fit. Be honest.
              </p>

              <div className="space-y-3">
                {CHALLENGES.map((challenge) => (
                  <button
                    key={challenge.value}
                    onClick={() => setFormData(prev => ({ ...prev, challenge: challenge.value }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      formData.challenge === challenge.value
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                        : 'border-[#2A2A2A] bg-[#181818] hover:border-[#888880]'
                    }`}
                  >
                    <span className="font-medium text-[#F0EEE8] block">{challenge.title}</span>
                    <span className="text-[#888880] text-sm">{challenge.subtitle}</span>
                  </button>
                ))}
              </div>
              {errors.challenge && <p className="text-red-500 text-xs mt-2">{errors.challenge}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#888880] rounded-lg hover:border-[#888880] hover:text-[#F0EEE8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(4)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Revenue */}
          {currentStep === 5 && (
            <motion.div key="step5" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 5 of 7 — Your Revenue
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                How much do you currently earn from your content or business?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                Monthly average. We use this to understand where you are.
              </p>

              <div className="space-y-3">
                {REVENUE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, revenue: option }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      formData.revenue === option
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                        : 'border-[#2A2A2A] bg-[#181818] hover:border-[#888880]'
                    }`}
                  >
                    <span className="font-medium text-[#F0EEE8]">{option}</span>
                  </button>
                ))}
              </div>
              {errors.revenue && <p className="text-red-500 text-xs mt-2">{errors.revenue}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevStep}
                  className="px-4 py-3 border border-[#2A2A2A] text-[#888880] rounded-lg hover:border-[#888880] hover:text-[#F0EEE8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => handleNext(5)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Investment Qualifier */}
          {currentStep === 6 && (
            <motion.div key="step6" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 6 of 7 — Final Qualifier
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                Are you in a position to invest in your growth right now?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                Our strategy session is free. If we're a fit, we'll discuss working together. Our coaching starts from R9,500. This question helps us respect everyone's time.
              </p>

              <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-5 mb-6">
                <p className="text-[#F0EEE8] text-sm">
                  We only book calls with people who are serious about building a content business. If now isn't the right time financially, we have self-study resources that may serve you better.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleQualify}
                  className="w-full py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne'] flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Yes — I'm ready to invest in my growth
                </button>
                <button
                  onClick={handleDisqualify}
                  className="w-full py-4 bg-[#1a0a09] border border-red-600 text-red-500 font-bold rounded-lg hover:bg-red-900/30 transition-all font-['Syne']"
                >
                  Not right now — I'm not in a position to invest
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 7: Contact Info */}
          {currentStep === 7 && (
            <motion.div key="step7" {...stepVariants} transition={{ duration: 0.35 }}>
              <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">
                Step 7 of 7 — Almost Done
              </p>
              <h2 className="text-2xl font-bold text-[#F0EEE8] mb-4 font-['Syne']">
                Last step. Where can we reach you?
              </h2>
              <p className="text-[#888880] text-sm mb-5">
                We'll send your booking confirmation and a short video to watch before your call.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888880]" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Full name"
                    className={`w-full pl-12 pr-4 py-4 bg-[#181818] border rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors ${errors.fullName ? 'border-red-500' : 'border-[#2A2A2A]'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888880]" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    className={`w-full pl-12 pr-4 py-4 bg-[#181818] border rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-[#2A2A2A]'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888880]" size={18} />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="e.g. 0812345678"
                    className={`w-full pl-12 pr-4 py-4 bg-[#181818] border rounded-lg text-[#F0EEE8] placeholder-[#888880] focus:border-[#C9A84C] focus:outline-none transition-colors ${errors.whatsapp ? 'border-red-500' : 'border-[#2A2A2A]'}`}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 mt-6 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0A0A] font-bold rounded-lg hover:opacity-90 transition-all font-['Syne']"
              >
                Book My Strategy Session →
              </button>

              <p className="text-[#888880] text-xs text-center mt-4 flex items-center justify-center gap-2">
                <Lock size={12} /> Your details are private and secure. No spam, ever.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
