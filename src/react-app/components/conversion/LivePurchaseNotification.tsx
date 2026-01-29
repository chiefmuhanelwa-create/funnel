import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Notification {
  name: string;
  location: string;
  product: string;
  time: string;
}

const mockNotifications: Notification[] = [
  { name: 'Sarah M.', location: 'Cape Town', product: 'Starter Kit', time: '2 min ago' },
  { name: 'John D.', location: 'Johannesburg', product: 'Starter Kit', time: '5 min ago' },
  { name: 'Lisa K.', location: 'Durban', product: 'Starter Kit', time: '8 min ago' },
  { name: 'Michael T.', location: 'Pretoria', product: 'Starter Kit', time: '12 min ago' },
  { name: 'Amanda N.', location: 'Port Elizabeth', product: 'Starter Kit', time: '15 min ago' },
  { name: 'David S.', location: 'Bloemfontein', product: 'Starter Kit', time: '18 min ago' },
  { name: 'Rachel P.', location: 'East London', product: 'Starter Kit', time: '22 min ago' },
  { name: 'James B.', location: 'Polokwane', product: 'Starter Kit', time: '25 min ago' },
];

interface LivePurchaseNotificationProps {
  showDelay?: number; // Initial delay before first notification (ms)
  interval?: number; // Time between notifications (ms)
  duration?: number; // How long each notification shows (ms)
}

export default function LivePurchaseNotification({
  showDelay = 8000,
  interval = 25000,
  duration = 5000,
}: LivePurchaseNotificationProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if user dismissed
    if (dismissed) return;

    let notificationIndex = 0;

    const showRandomNotification = () => {
      const randomNotification = mockNotifications[notificationIndex % mockNotifications.length];
      notificationIndex++;
      setNotification(randomNotification);

      // Hide after duration
      setTimeout(() => {
        setNotification(null);
      }, duration);
    };

    // Show first notification after delay
    const initialTimer = setTimeout(showRandomNotification, showDelay);

    // Then show at regular intervals
    const intervalTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        // 70% chance to show
        showRandomNotification();
      }
    }, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [dismissed, showDelay, interval, duration]);

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
                <p className="text-xs text-green-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
