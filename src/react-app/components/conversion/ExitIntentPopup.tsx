import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Percent, Gift } from 'lucide-react';

interface ExitIntentPopupProps {
  discountCode?: string;
  discountPercent?: number;
  onApplyDiscount?: (code: string) => void;
}

export default function ExitIntentPopup({
  discountCode = 'SPECIAL10',
  discountPercent = 10,
  onApplyDiscount,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only trigger on product/checkout pages
    const isRelevantPage =
      window.location.pathname.includes('/checkout') ||
      window.location.pathname.includes('/contentpreneur') ||
      window.location.pathname.includes('/starter-kit');

    if (!isRelevantPage) return;

    // Check if already shown in this session
    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    // Mouse leave detection (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves to top of viewport (like closing tab)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Mobile: Show after 30 seconds of inactivity
    let mobileTimeout: NodeJS.Timeout;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      mobileTimeout = setTimeout(() => {
        if (!hasShown) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }, 30000);
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (mobileTimeout) clearTimeout(mobileTimeout);
    };
  }, [hasShown]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyDiscount = () => {
    if (onApplyDiscount) {
      onApplyDiscount(discountCode);
    }
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/70 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: -50 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-gradient-to-br from-gray-100 to-white rounded-3xl p-8 border border-gray-200 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-6">
            <Gift size={32} className="text-gray-900" />
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Wait! Don't Leave Empty-Handed
            </h2>
            <p className="text-gray-600 mb-6">
              Get <span className="text-amber-600 font-bold">{discountPercent}% OFF</span> your
              first purchase
            </p>

            {/* Discount Code Box */}
            <div
              onClick={handleCopyCode}
              className="bg-amber-50 border-2 border-dashed border-amber-500 rounded-xl p-4 mb-6 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent size={20} className="text-amber-600" />
                <span className="text-2xl font-mono font-bold text-amber-700 tracking-wider">
                  {discountCode}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {copied ? 'Copied!' : 'Click to copy'}
              </p>
            </div>

            {/* Benefits */}
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-400" />
                Instant access to all modules
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-400" />
                Lifetime updates included
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} className="text-green-400" />
                30-day money-back guarantee
              </li>
            </ul>

            {/* CTA */}
            <button
              onClick={handleApplyDiscount}
              className="w-full btn-primary btn-lg flex items-center justify-center gap-2"
            >
              Claim My {discountPercent}% Discount
              <ArrowRight size={18} />
            </button>

            <p className="text-xs text-gray-400 mt-4">
              This offer is only available on this page
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
