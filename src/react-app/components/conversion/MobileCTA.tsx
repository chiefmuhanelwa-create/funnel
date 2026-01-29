import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

interface MobileCTAProps {
  ctaText?: string;
  ctaLink?: string;
  price?: string;
  urgencyText?: string;
  scrollThreshold?: number;
}

export default function MobileCTA({
  ctaText = 'Get Started Now',
  ctaLink = '/checkout/starter-kit',
  price = '$67',
  urgencyText,
  scrollThreshold = 300,
}: MobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show CTA after scrolling past threshold
      if (window.scrollY > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, scrollThreshold]);

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none"
        >
          <Link
            to={ctaLink}
            className="block w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-dark-500 font-black text-center shadow-2xl pointer-events-auto hover:shadow-yellow-500/25 transition-shadow"
          >
            <span className="flex items-center justify-center gap-2">
              {ctaText} - {price}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>

          {urgencyText && (
            <p className="text-center text-xs text-yellow-400 mt-2 font-semibold flex items-center justify-center gap-1 pointer-events-none">
              <Clock size={12} />
              {urgencyText}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
