import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, TrendingUp, ShoppingCart } from 'lucide-react';

interface SocialProofProps {
  productKey?: string;
  variant?: 'viewers' | 'purchases' | 'trending';
  minViewers?: number;
  maxViewers?: number;
  className?: string;
  useRealData?: boolean;
}

export default function SocialProof({
  productKey,
  variant = 'viewers',
  minViewers = 3,
  maxViewers = 12,
  className = '',
  useRealData = true,
}: SocialProofProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    // For 'purchases' variant, try to fetch real data
    if (useRealData && (variant === 'purchases' || variant === 'trending')) {
      fetch('/api/stats/recent-purchases')
        .then(res => res.json())
        .then(data => {
          if (data.count24h > 0) {
            setCount(data.count24h);
            setIsRealData(data.isRealData);
          } else {
            // Fallback to random if no real data
            setCount(Math.floor(Math.random() * (maxViewers - minViewers + 1)) + minViewers);
          }
        })
        .catch(() => {
          setCount(Math.floor(Math.random() * (maxViewers - minViewers + 1)) + minViewers);
        });
    } else {
      // For viewers, use simulated count
      const initial = Math.floor(Math.random() * (maxViewers - minViewers + 1)) + minViewers;
      setCount(initial);
    }

    // Show after delay for more natural feel
    const showTimeout = setTimeout(() => setIsVisible(true), 2000);

    // For viewers variant, randomly update count (simulated)
    let interval: NodeJS.Timeout | undefined;
    if (variant === 'viewers') {
      interval = setInterval(() => {
        setCount(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newCount = prev + change;
          return Math.max(minViewers, Math.min(maxViewers, newCount));
        });
      }, Math.random() * 30000 + 30000);
    }

    return () => {
      clearTimeout(showTimeout);
      if (interval) clearInterval(interval);
    };
  }, [minViewers, maxViewers, variant, useRealData]);

  const getContent = () => {
    switch (variant) {
      case 'purchases':
        return {
          icon: ShoppingCart,
          text: `${count} people purchased in the last 24 hours`,
          color: 'success',
        };
      case 'trending':
        return {
          icon: TrendingUp,
          text: `Trending! ${count} people bought this today`,
          color: 'amber',
        };
      default:
        return {
          icon: Eye,
          text: `${count} people are viewing this right now`,
          color: 'blue',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  const colorClasses = {
    success: 'bg-success-500/10 text-success-400 border-success-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm ${colorClasses[content.color as keyof typeof colorClasses]} ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${content.color === 'success' ? 'bg-success-400' : content.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${content.color === 'success' ? 'bg-success-400' : content.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
          </span>
          <Icon size={14} />
          <span className="font-medium">{content.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Recently purchased notification popup
interface RecentPurchaseProps {
  productName: string;
  customerName?: string;
  location?: string;
  delaySeconds?: number;
  durationSeconds?: number;
}

export function RecentPurchasePopup({
  productName,
  customerName = 'Someone',
  location = 'South Africa',
  delaySeconds = 15,
  durationSeconds = 5,
}: RecentPurchaseProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // First names for social proof
    const names = ['Thabo', 'Naledi', 'Sipho', 'Lerato', 'Kagiso', 'Mpho', 'Nandi', 'Themba'];
    const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Soweto'];

    // Show first popup after delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);

      // Hide after duration
      setTimeout(() => setIsVisible(false), durationSeconds * 1000);
    }, delaySeconds * 1000);

    // Show recurring popups
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), durationSeconds * 1000);
    }, 60000 + Math.random() * 60000); // 60-120 seconds

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, [delaySeconds, durationSeconds]);

  // Generate random name and location
  const names = ['Thabo', 'Naledi', 'Sipho', 'Lerato', 'Kagiso', 'Mpho', 'Nandi', 'Themba'];
  const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-gray-900 font-bold shrink-0">
              {randomName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <strong>{randomName}</strong> from {randomCity}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Just purchased <strong>{productName}</strong>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {Math.floor(Math.random() * 5) + 1} minutes ago
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse shrink-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
