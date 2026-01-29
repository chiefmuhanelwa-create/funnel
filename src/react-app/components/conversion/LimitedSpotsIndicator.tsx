import { motion } from 'framer-motion';
import { AlertCircle, Users } from 'lucide-react';

interface LimitedSpotsIndicatorProps {
  spotsLeft?: number;
  totalSpots?: number;
  variant?: 'badge' | 'bar';
}

export default function LimitedSpotsIndicator({
  spotsLeft = 7,
  totalSpots = 20,
  variant = 'badge',
}: LimitedSpotsIndicatorProps) {
  const percentageLeft = (spotsLeft / totalSpots) * 100;
  const isUrgent = spotsLeft <= 5;

  if (variant === 'bar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-red-400" />
            <span className="text-sm font-medium text-white">
              {spotsLeft} spots left at this price
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {spotsLeft}/{totalSpots}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - percentageLeft}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isUrgent
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
        isUrgent
          ? 'bg-red-500/20 border border-red-500/40'
          : 'bg-yellow-500/20 border border-yellow-500/40'
      }`}
    >
      <AlertCircle
        size={16}
        className={isUrgent ? 'text-red-400' : 'text-yellow-400'}
      />
      <div>
        <span
          className={`text-sm font-bold ${
            isUrgent ? 'text-red-400' : 'text-yellow-400'
          }`}
        >
          Only {spotsLeft} spots left!
        </span>
        <span className="text-xs text-gray-500 ml-1">at this price</span>
      </div>
    </motion.div>
  );
}
