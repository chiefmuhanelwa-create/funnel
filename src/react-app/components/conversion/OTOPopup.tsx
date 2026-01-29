import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Check, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface OTOPopupProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing?: boolean;
  productName?: string;
  originalPrice?: number;
  otoPrice?: number;
  features?: string[];
  timerDuration?: number; // in seconds
}

export default function OTOPopup({
  isVisible,
  onAccept,
  onDecline,
  isProcessing = false,
  productName = "The Influencer's Code",
  originalPrice = 47,
  otoPrice = 17,
  features = [
    'Self-Awareness & Confidence Building',
    'The 3Es Formula & Algorithm Mastery',
    'PAIDS Monetization Deep Dive',
    'DARES Scale System',
  ],
  timerDuration = 15 * 60, // 15 minutes
}: OTOPopupProps) {
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline(); // Auto-decline when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onDecline]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const savings = originalPrice - otoPrice;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onDecline}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gradient-to-br from-dark-400 to-dark-500 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl my-8"
          >
            {/* Close Button */}
            <button
              onClick={onDecline}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
              <Clock size={16} className="text-red-400" />
              <span className="text-red-400 font-mono font-bold">{formatTime(timeLeft)}</span>
              <span className="text-red-300 text-sm">remaining</span>
            </div>

            {/* OTO Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={18} className="text-yellow-400" />
              <span className="text-yellow-400 font-bold uppercase tracking-wide text-sm">
                One-Time Special Offer
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
              Wait! Before You Go...
            </h2>
            <p className="text-white/60 text-center mb-6">
              Add {productName} for{' '}
              <span className="text-yellow-400 font-bold">{savingsPercent}% OFF</span>
            </p>

            {/* Product Details */}
            <div className="bg-white/5 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                  <BookOpen size={28} className="text-dark-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{productName}</h3>
                  <p className="text-white/50 text-sm mt-1">
                    The #1 bestselling book on content monetization. 6,000+ copies sold.
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                    <Check size={16} className="text-green-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div>
                <p className="text-white/50 text-sm line-through">${originalPrice}</p>
                <p className="text-2xl font-bold text-green-400">${otoPrice}</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-green-500 text-dark-500 font-bold text-sm px-3 py-1 rounded-full">
                  Save ${savings}
                </span>
                <p className="text-white/50 text-xs mt-1">{savingsPercent}% OFF</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={onAccept}
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className="w-full btn-primary btn-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <Check size={18} />
                    YES! Add {productName} for ${otoPrice}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <button
                onClick={onDecline}
                disabled={isProcessing}
                className="w-full text-sm text-white/40 hover:text-white/60 transition-colors py-2"
              >
                No thanks, I'll pay full price later
              </button>
            </div>

            {/* Fine Print */}
            <p className="text-center text-xs text-white/30 mt-4">
              This one-time offer is available only on this page and expires in{' '}
              {formatTime(timeLeft)}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
