import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  title?: string;
  compact?: boolean;
}

export default function CountdownTimer({
  targetDate,
  onExpire,
  title = 'Offer Ends In:',
  compact = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        if (onExpire) onExpire();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock size={16} className="text-red-400" />
        <span className="text-white/70">{title}</span>
        <span className="font-mono font-bold text-yellow-400">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center"
    >
      <p className="text-lg font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
        <Clock size={20} />
        {title}
      </p>

      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-white bg-white/10 rounded-lg px-3 py-2 min-w-[60px] sm:min-w-[80px]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm text-white/50 mt-1 uppercase tracking-wide">
                Days
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-yellow-500">:</span>
          </>
        )}

        <div className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-black text-white bg-white/10 rounded-lg px-3 py-2 min-w-[60px] sm:min-w-[80px]">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm text-white/50 mt-1 uppercase tracking-wide">
            Hours
          </span>
        </div>

        <span className="text-2xl sm:text-3xl font-bold text-yellow-500">:</span>

        <div className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-black text-white bg-white/10 rounded-lg px-3 py-2 min-w-[60px] sm:min-w-[80px]">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm text-white/50 mt-1 uppercase tracking-wide">
            Mins
          </span>
        </div>

        <span className="text-2xl sm:text-3xl font-bold text-yellow-500">:</span>

        <div className="flex flex-col items-center">
          <motion.span
            key={timeLeft.seconds}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-black text-white bg-white/10 rounded-lg px-3 py-2 min-w-[60px] sm:min-w-[80px]"
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </motion.span>
          <span className="text-xs sm:text-sm text-white/50 mt-1 uppercase tracking-wide">
            Secs
          </span>
        </div>
      </div>
    </motion.div>
  );
}
