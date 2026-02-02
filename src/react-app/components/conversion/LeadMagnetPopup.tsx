import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Mail, Loader2, CheckCircle, Sparkles } from 'lucide-react';

interface LeadMagnetPopupProps {
  // Timing configuration
  delaySeconds?: number; // Delay before showing (default: 5 seconds)
  showOnScroll?: boolean; // Show when user scrolls 50% down
  showOnExit?: boolean; // Show on exit intent

  // Content
  title?: string;
  description?: string;
  buttonText?: string;
  leadMagnetName?: string;

  // Lead magnet image
  imageUrl?: string;

  // Callback
  onSubscribe?: (email: string) => void;
}

export default function LeadMagnetPopup({
  delaySeconds = 5,
  showOnScroll = false,
  showOnExit = true,
  title = 'Get the FREE Content Ideas Cheat Sheet',
  description = 'Discover the exact formula for creating viral content that builds your audience.',
  buttonText = 'Send Me the Free Guide',
  leadMagnetName = 'Content Ideas Cheat Sheet',
  imageUrl,
  onSubscribe,
}: LeadMagnetPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if already shown/subscribed
  const storageKey = 'lead_magnet_popup_shown';
  const hasShown = typeof window !== 'undefined' && localStorage.getItem(storageKey);

  useEffect(() => {
    if (hasShown) return;

    // Delay timer
    const timer = setTimeout(() => {
      if (!showOnScroll && !showOnExit) {
        setIsVisible(true);
        localStorage.setItem(storageKey, 'true');
      }
    }, delaySeconds * 1000);

    // Scroll trigger
    const handleScroll = () => {
      if (!showOnScroll) return;

      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50 && !isVisible) {
        setIsVisible(true);
        localStorage.setItem(storageKey, 'true');
      }
    };

    // Exit intent trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (!showOnExit) return;
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
        localStorage.setItem(storageKey, 'true');
      }
    };

    if (showOnScroll) {
      window.addEventListener('scroll', handleScroll);
    }

    if (showOnExit) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delaySeconds, showOnScroll, showOnExit, isVisible, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'lead_magnet',
          tags: ['lead_magnet'],
        }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setIsSuccess(true);
      onSubscribe?.(email);

      // Close after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasShown && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Gift size={32} className="text-white" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-200" />
                <span className="text-amber-100 text-sm font-medium uppercase tracking-wide">
                  Free Download
                </span>
                <Sparkles size={16} className="text-amber-200" />
              </div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
                  <p className="text-gray-600">
                    Your {leadMagnetName} is on its way. Check your inbox (and spam folder).
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-center mb-6">{description}</p>

                  {imageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-gray-200">
                      <img src={imageUrl} alt={leadMagnetName} className="w-full h-auto" />
                    </div>
                  )}

                  {/* What's included */}
                  <div className="bg-amber-50 rounded-xl p-4 mb-6">
                    <p className="font-semibold text-gray-900 mb-2 text-sm">What you'll get:</p>
                    <ul className="space-y-2">
                      {[
                        'The 3Es viral content formula',
                        '10 proven content templates',
                        'Engagement-boosting hooks',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle size={14} className="text-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-gray-50"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Gift size={20} />
                          {buttonText}
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-xs text-gray-400">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
