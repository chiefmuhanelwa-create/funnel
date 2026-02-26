import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface OrderItem {
  item_id: string;
  item_name: string;
  price: number;
}

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const customerEmail = searchParams.get('email') || '';
  const customerName = searchParams.get('name') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<{
    order_number: string;
    payment_status: string;
    total_amount_cents: number;
    currency: string;
    items?: OrderItem[];
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setError('No payment reference found');
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/checkout/verify?reference=${reference}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setOrderDetails(data.order);

        if (data.order.payment_status === 'completed') {
          setStatus('success');

          // Track purchase
          analytics.purchase({
            transaction_id: data.order.order_number,
            value: data.order.total_amount_cents,
            currency: data.order.currency,
          });
        } else if (attempts < maxAttempts) {
          // Payment still pending, retry
          attempts++;
          setTimeout(verifyPayment, 3000);
        } else {
          setStatus('pending');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Verifying your payment...
          </h2>
          <p className="mt-2 text-gray-500">Please wait while we confirm your order</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-md text-center p-8"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <p className="mt-4 text-sm text-gray-400">
            If you believe this is an error, please contact support at{' '}
            <a href="mailto:hello@contentpreneurhub.online" className="text-gold-500">
              hello@contentpreneurhub.online
            </a>
          </p>
          <Link to="/checkout/starter-kit" className="mt-6 btn-primary inline-block">
            Try Again
          </Link>
        </motion.div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-md text-center p-8"
        >
          <Loader2 className="w-16 h-16 text-yellow-500 mx-auto animate-spin" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Processing</h2>
          <p className="mt-2 text-gray-500">
            Your payment is still being processed. You'll receive an email confirmation once
            it's complete.
          </p>
          {orderDetails && (
            <p className="mt-4 text-sm text-gray-400">
              Order Number: <strong className="text-gray-900">{orderDetails.order_number}</strong>
            </p>
          )}
          <Link to="/members" className="mt-6 btn-secondary inline-block">
            Go to Member Hub
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg w-full text-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </motion.div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">Payment Successful!</h1>

        <p className="mt-4 text-lg text-gray-500">
          Thank you for your purchase! You now have instant access to your content.
        </p>

        {orderDetails && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500">Order Number</div>
            <div className="font-mono font-bold text-gray-900">{orderDetails.order_number}</div>
            <div className="mt-2 text-sm text-gray-500">
              Amount Paid:{' '}
              <span className="font-semibold text-gray-900">
                {orderDetails.currency === 'ZAR' ? 'R' : '$'}
                {(orderDetails.total_amount_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <Link
            to="/members"
            className="btn-primary w-full py-4 text-lg flex items-center justify-center"
          >
            Access Your Content
            <ArrowRight className="ml-2" size={20} />
          </Link>

          <p className="text-sm text-gray-400">
            A confirmation email has been sent to your inbox with login instructions.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <ol className="text-left text-sm text-gray-500 space-y-2">
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                1
              </span>
              Check your email for your order confirmation
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                2
              </span>
              Click "Access Your Content" above or go to /members
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                3
              </span>
              Log in with the email you purchased with
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                4
              </span>
              Start with Module 1 and begin your journey!
            </li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}
