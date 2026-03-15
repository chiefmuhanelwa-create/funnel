import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Notification {
  name: string;
  location: string;
  product: string;
  time: string;
}

// Fallback data when no real purchases available
const fallbackNotifications: Notification[] = [
  { name: 'S***a', location: 'Cape Town', product: 'Starter Kit', time: '2 min ago' },
  { name: 'J***n', location: 'Johannesburg', product: 'Starter Kit', time: '5 min ago' },
  { name: 'L***a', location: 'Durban', product: 'Starter Kit', time: '8 min ago' },
  { name: 'M***l', location: 'Pretoria', product: 'Starter Kit', time: '12 min ago' },
];

interface LivePurchaseNotificationProps {
  showDelay?: number;
  interval?: number;
  duration?: number;
  useRealData?: boolean;
}

export default function LivePurchaseNotification({
  showDelay = 8000,
  interval = 25000,
  duration = 5000,
  useRealData = true,
}: LivePurchaseNotificationProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fallbackNotifications);
  const [isRealData, setIsRealData] = useState(false);

  // Fetch real purchase data
  useEffect(() => {
    if (!useRealData) return;

    const fetchRecentPurchases = async () => {
      try {
        const response = await fetch('/api/stats/recent-purchases');
        if (response.ok) {
          const data = await response.json();
          if (data.purchases && data.purchases.length > 0) {
            setNotifications(data.purchases);
            setIsRealData(data.isRealData);
          }
        }
      } catch (error) {
        console.log('Using fallback notification data');
      }
    };

    fetchRecentPurchases();
    // Refresh real data every 5 minutes
    const refreshInterval = setInterval(fetchRecentPurchases, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [useRealData]);

  useEffect(() => {
    if (dismissed || notifications.length === 0) return;

    let notificationIndex = 0;

    const showNextNotification = () => {
      const nextNotification = notifications[notificationIndex % notifications.length];
      notificationIndex++;
      setNotification(nextNotification);

      setTimeout(() => {
        setNotification(null);
      }, duration);
    };

    const initialTimer = setTimeout(showNextNotification, showDelay);

    const intervalTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        showNextNotification();
      }
    }, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [dismissed, showDelay, interval, duration, notifications]);

  const handleDismiss = () => {
    setNotification(null);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-2xl p-4 backdrop-blur-lg shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">
                  {notification.name} from {notification.location}
                </p>
                <p className="text-xs text-gray-600">
                  Just purchased "{notification.product}"
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {notification.time}
                  {isRealData && <span className="ml-1 opacity-60">• verified</span>}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
