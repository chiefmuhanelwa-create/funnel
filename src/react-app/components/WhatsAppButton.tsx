import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string; // WhatsApp number with country code (no +, spaces, or dashes)
  message?: string; // Pre-filled message
  position?: 'left' | 'right';
}

export default function WhatsAppButton({
  phoneNumber = '27685103161',
  message = "Hi! I have a question about the Contentpreneur products.",
  position = 'right',
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  useState(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  });

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const positionClasses = position === 'left'
    ? 'left-4 sm:left-6'
    : 'right-4 sm:right-6';

  return (
    <div className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-40`}>
      <AnimatePresence>
        {/* Chat popup */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-green-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Mr. NoChill</p>
                    <p className="text-green-100 text-xs">Typically replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Message */}
            <div className="p-4 bg-gray-50">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-gray-700 text-sm">
                  Hey there! 👋 How can I help you today? Feel free to ask about:
                </p>
                <ul className="mt-2 text-sm text-gray-600">
                  <li>• Products & courses</li>
                  <li>• Coaching sessions</li>
                  <li>• Technical support</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="p-4 border-t border-gray-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                <MessageCircle size={18} />
                Start Conversation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute bottom-0 right-16 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap"
          >
            Need help? Chat with us!
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse animation */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-3 h-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      )}
    </div>
  );
}
