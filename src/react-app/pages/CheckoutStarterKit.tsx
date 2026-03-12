import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, CreditCard, Loader2, Lock, Zap, Tag, X } from 'lucide-react';
import { analytics } from '../utils/analytics';
import {
  CountdownTimer,
  LimitedSpotsIndicator,
  LivePurchaseNotification,
  MobileCTA,
} from '../components/conversion';

interface OrderBump {
  key: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

// Product mockup images from Vercel Blob Storage
const PRODUCT_IMAGES = {
  influencersCode: 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com/images/the-influencer-s-code-mockup--book-cover-.jpeg',
  socialMediaIntro: 'https://kgivdudngd1zphnr.public.blob.vercel-storage.com/images/social-media-intro-mockup.jpeg',
};

interface AppliedDiscount {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
}

export default function CheckoutStarterKit() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchangeRate, setExchangeRate] = useState(18.5);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  // Countdown timer - set to end of current day + 3 days
  const [offerEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const mainProduct = {
    key: 'starter-kit',
    name: 'Contentpreneur Starter Kit',
    price: 6700, // $67 in cents
  };

  const orderBumps: OrderBump[] = [
    {
      key: 'influencers-code',
      name: "The Influencer's Code (eBook)",
      price: 1200,
      description: 'Bestselling eBook with 6,000+ copies sold. Learn the secrets of successful influencers. Normally $19, yours for just $12 today.',
      imageUrl: PRODUCT_IMAGES.influencersCode,
    },
    {
      key: 'social-media-intro',
      name: 'Introduction to Social Media Course',
      price: 1700,
      description: '4-module course on social media mastery. Learn platform selection, content creation, and growth tactics. Normally $27, yours for just $17 today.',
      imageUrl: PRODUCT_IMAGES.socialMediaIntro,
    },
  ];

  useEffect(() => {
    // Fetch exchange rate
    fetch('/api/exchange-rate')
      .then((res) => res.json())
      .then((data) => setExchangeRate(data.rate))
      .catch(() => console.log('Using fallback exchange rate'));

    // Track checkout started
    analytics.beginCheckout({
      value: mainProduct.price,
      currency: 'USD',
      items: [{ item_id: mainProduct.key, item_name: mainProduct.name, price: mainProduct.price }],
    });
  }, []);

  const toggleBump = (key: string) => {
    setSelectedBumps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const calculateSubtotal = () => {
    let total = mainProduct.price;
    selectedBumps.forEach((key) => {
      const bump = orderBumps.find((b) => b.key === key);
      if (bump) total += bump.price;
    });
    return total;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (appliedDiscount) {
      return subtotal - appliedDiscount.discount_amount;
    }
    return subtotal;
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setCheckingDiscount(true);
    setDiscountError('');

    try {
      const productKeys = [mainProduct.key, ...selectedBumps];
      const subtotal = calculateSubtotal();

      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.toUpperCase(),
          productKeys,
          subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedDiscount(data);
        analytics.customEvent('discount_applied', {
          code: discountCode,
          discount_amount: data.discount_amount,
          discount_type: data.discount_type,
        });
      } else {
        setDiscountError(data.error || 'Invalid discount code');
      }
    } catch (err) {
      setDiscountError('Failed to validate code');
    } finally {
      setCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const subtotalUSD = calculateSubtotal();
  const totalUSD = calculateTotal();
  const totalZAR = Math.round(totalUSD * exchangeRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Track payment info added
      analytics.addPaymentInfo({ value: totalUSD, currency: 'USD' });

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: [mainProduct.key],
          includeOrderBumps: selectedBumps,
          customerEmail: email,
          customerName: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Paystack
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-5 gap-8"
        >
          {/* Order Form */}
          <div className="lg:col-span-3">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Lock size={18} className="text-gray-900" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Secure Checkout</h1>
                  <p className="text-sm text-gray-500">Your information is protected</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Customer Info */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      placeholder="john@example.com"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      Your course access will be sent to this email
                    </p>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    Have a discount code?
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      disabled={!!appliedDiscount}
                      className="input flex-1"
                    />
                    {!appliedDiscount ? (
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        disabled={checkingDiscount || !discountCode.trim()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-900 font-medium text-sm transition-colors disabled:opacity-50"
                      >
                        {checkingDiscount ? 'Checking...' : 'Apply'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 font-medium text-sm transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {discountError && (
                    <p className="mt-2 text-sm text-red-400">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle size={16} />
                      Code <strong>{appliedDiscount.code}</strong> applied! Saving $
                      {(appliedDiscount.discount_amount / 100).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Order Bumps */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-gold-500" />
                    Special Offers (One-Time Only)
                  </h2>
                  <div className="space-y-3">
                    {orderBumps.map((bump) => (
                      <div
                        key={bump.key}
                        onClick={() => toggleBump(bump.key)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedBumps.includes(bump.key)
                            ? 'border-gold-500 bg-gold-500/10'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                              selectedBumps.includes(bump.key)
                                ? 'border-gold-500 bg-gold-500'
                                : 'border-amber-300'
                            }`}
                          >
                            {selectedBumps.includes(bump.key) && (
                              <CheckCircle className="text-gray-900" size={14} />
                            )}
                          </div>
                          {bump.imageUrl && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                              <img
                                src={bump.imageUrl}
                                alt={bump.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{bump.name}</span>
                              <span className="font-semibold text-gold-500">
                                +${(bump.price / 100).toFixed(0)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{bump.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-error-500/10 border border-error-500/20 text-error-400 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <CreditCard className="mr-2" size={20} />
                      Complete Order - R{(totalZAR / 100).toFixed(2)}
                    </span>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-success-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            {/* Urgency Elements */}
            <div className="space-y-4 mb-6">
              <CountdownTimer
                targetDate={offerEndDate}
                title="Special Price Ends In:"
                compact={false}
              />
              <LimitedSpotsIndicator spotsLeft={7} totalSpots={20} variant="bar" />
            </div>

            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{mainProduct.name}</span>
                  <span className="font-medium text-gray-900">${(mainProduct.price / 100).toFixed(0)}</span>
                </div>

                {selectedBumps.map((key) => {
                  const bump = orderBumps.find((b) => b.key === key);
                  if (!bump) return null;
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{bump.name}</span>
                      <span className="font-medium text-gray-600">${(bump.price / 100).toFixed(0)}</span>
                    </div>
                  );
                })}

                {appliedDiscount && (
                  <>
                    <div className="divider my-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-600">${(subtotalUSD / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>
                        Discount ({appliedDiscount.code})
                        {appliedDiscount.discount_type === 'percentage' &&
                          ` (${appliedDiscount.discount_value}%)`}
                      </span>
                      <span>-${(appliedDiscount.discount_amount / 100).toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="divider my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-gradient-gold">${(totalUSD / 100).toFixed(0)}</div>
                    <div className="text-sm font-normal text-gray-400">
                      ≈ R{(totalZAR / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* What's included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {[
                    '10 Video Modules (Including Bonus)',
                    'Niche Finder Workbook',
                    'PAIDS Framework Workbook',
                    'NoChill Tool Stack',
                    'Lifetime Access',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="text-success-400 mr-2 shrink-0" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee badge */}
              <div className="mt-6 p-4 rounded-xl bg-success-500/10 border border-success-500/20">
                <div className="flex items-center gap-3">
                  <Shield size={24} className="text-success-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">30-Day Money-Back Guarantee</p>
                    <p className="text-xs text-gray-500">Not satisfied? Get a full refund.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Conversion Elements */}
      <LivePurchaseNotification />
      <MobileCTA
        ctaText="Get Started Now"
        ctaLink="/checkout/starter-kit"
        price="$67"
        urgencyText="Special pricing ends soon"
      />
    </div>
  );
}
