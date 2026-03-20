import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, CreditCard, Loader2, Lock, Zap, Tag, X, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';
import { IMAGES } from '../config/assets';
import { useMemberAccess } from '../context/MemberAccessContext';
import SocialProof from '../components/conversion/SocialProof';

// Product bundles - what products are included when you own a product
const PRODUCT_BUNDLES: Record<string, string[]> = {
  'starter-kit': ['niche-finder', 'paids-workbook'],
  'contentpreneur-pro': ['starter-kit', 'content-foundations', 'influencers-code', 'tax-guide', 'niche-finder', 'paids-workbook'],
};

// Products that are bundled (not sold standalone) - redirect to starter-kit
const BUNDLED_ONLY_PRODUCTS = ['niche-finder', 'paids-workbook', 'content-arsenal'];

// Product configuration
// IMPORTANT: All prices are in ZAR CENTS (e.g., 69900 = R699.00)
const PRODUCTS: Record<string, {
  key: string;
  name: string;
  description: string;
  price: number; // ZAR cents (69900 = R699.00)
  image?: string;
  features: string[];
  salesPage: string;
  isPreOrder?: boolean;
}> = {
  'starter-kit': {
    key: 'starter-kit',
    name: 'Contentpreneur Starter Kit',
    description: 'Complete 9-module course to build your personal brand and monetize your content',
    price: 69900, // R699.00
    image: IMAGES.starterKitCourseMockup,
    features: ['9 Video Modules', 'Niche Finder Workbook', 'PAIDS Framework Workbook', 'NoChill Tool Stack', 'Lifetime Access'],
    salesPage: '/contentpreneur-starter-kit',
  },
  'influencers-code': {
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'The complete blueprint from creator to influential personal brand',
    price: 19900, // R199.00
    image: IMAGES.influencersCodeMockup,
    features: ['14 Comprehensive Chapters', '3Es Content Formula', 'DARES Framework', 'Instant PDF Download', 'Lifetime Access'],
    salesPage: '/products/influencers-code',
  },
  'tax-guide': {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'SARS compliance guide for South African content creators',
    price: 44900, // R449.00
    image: IMAGES.taxGuideMockup,
    features: ['VDP Process Guide', '6 Tax Types Explained', '35% Rule Strategy', 'Deduction Checklist', 'Instant PDF Download'],
    salesPage: '/products/tax-guide',
  },
  'content-foundations': {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    description: 'Essential groundwork for building your authentic brand',
    price: 39900, // R399.00
    image: IMAGES.contentFoundationsMockup,
    features: ['3 Video Modules', 'Self Reflection Exercises', 'SWOT Analysis Template', 'Value Alignment Workshop'],
    salesPage: '/products/content-foundations',
  },
  'coaching-session': {
    key: 'coaching-session',
    name: '1-on-1 Strategy Call',
    description: '60-minute personalized strategy session with Mr. NoChill',
    price: 499900, // R4,999.00
    features: ['60-Min Video Call', '90-Day Action Plan', 'Session Recording', '7-Day Email Follow-up'],
    salesPage: '/products/coaching',
  },
  'contentpreneur-pro': {
    key: 'contentpreneur-pro',
    name: 'Contentpreneur Pro Bundle',
    description: 'The complete system: All courses, workbooks, and guides. Save R400!',
    price: 129900, // R1,299.00
    image: IMAGES.starterKitCourseMockup,
    features: [
      '9-Module Personal Branding Course',
      'Content Foundations Course',
      "The Influencer's Code eBook",
      'Tax Guide for Contentpreneurs',
      'Niche Finder Workbook',
      'PAIDS Framework Workbook',
      'NoChill Tool Stack Access',
      'Lifetime Access',
    ],
    salesPage: '/contentpreneur-starter-kit',
  },
  'contentpreneur-book-ebook': {
    key: 'contentpreneur-book-ebook',
    name: 'Contentpreneur Guide (eBook)',
    description: 'The definitive digital guide to building a profitable content business',
    price: 24900, // R249.00
    features: ['10 Comprehensive Chapters', 'Instant PDF Download', 'Lifetime Updates', 'Mobile-Friendly Format'],
    salesPage: '/products/contentpreneur-book',
    isPreOrder: true,
  },
  'contentpreneur-book-hardcopy': {
    key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur Guide (Hardcopy + eBook)',
    description: 'Physical book + digital copy. Free shipping within South Africa',
    price: 39900, // R399.00
    features: ['Physical Hardcover Book', 'eBook Included', 'Free SA Shipping', 'Author-Signed Copy'],
    salesPage: '/products/contentpreneur-book',
    isPreOrder: true,
  },
};

// Order bumps configuration - discounted prices when purchased together (ZAR cents)
// Valid upsells: Influencer's Code, Content Foundations, Tax Guide, Contentpreneur Book, Coaching
const ORDER_BUMPS: Record<string, { key: string; name: string; price: number; description: string }[]> = {
  'starter-kit': [
    { key: 'influencers-code', name: "The Influencer's Code (eBook)", price: 14900, description: 'Learn the secrets of successful influencers. Normally R199, yours for just R149 today.' },
    { key: 'content-foundations', name: 'Content Foundations Course', price: 29900, description: '3-module video course on self-reflection, SWOT analysis & value alignment. Normally R399, yours for just R299 today.' },
  ],
  'influencers-code': [
    { key: 'tax-guide', name: 'Tax Guide for Contentpreneurs', price: 29900, description: 'SARS compliance guide - save on taxes legally. Normally R449, yours for just R299 today.' },
    { key: 'content-foundations', name: 'Content Foundations Course', price: 29900, description: '3-module video course on content creation fundamentals. Normally R399.' },
  ],
  'tax-guide': [
    { key: 'influencers-code', name: "The Influencer's Code", price: 14900, description: 'The complete blueprint for influencer success. Normally R199.' },
  ],
  'content-foundations': [
    { key: 'starter-kit', name: 'Upgrade to Full Starter Kit', price: 34900, description: 'Get all 9 modules instead of just 3. Save R350!' },
    { key: 'influencers-code', name: "The Influencer's Code", price: 14900, description: 'The complete blueprint for influencer success. Normally R199.' },
  ],
  'coaching-session': [],
  'contentpreneur-book-ebook': [
    { key: 'influencers-code', name: "The Influencer's Code", price: 14900, description: 'The complete blueprint for influencer success. Normally R199.' },
  ],
  'contentpreneur-book-hardcopy': [
    { key: 'influencers-code', name: "The Influencer's Code", price: 14900, description: 'The complete blueprint for influencer success. Normally R199.' },
  ],
  'contentpreneur-pro': [],
};

interface AppliedDiscount {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
}

export default function Checkout() {
  const { productKey } = useParams<{ productKey: string }>();
  const { getAllAccessibleProducts, isAuthenticated, user } = useMemberAccess();
  const product = productKey ? PRODUCTS[productKey] : null;
  const allBumps = productKey ? ORDER_BUMPS[productKey] || [] : [];

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // All prices now in ZAR - no conversion needed
  const [ownedProducts, setOwnedProducts] = useState<string[]>([]);
  const [checkingOwnership, setCheckingOwnership] = useState(false);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  // Cart tracking state
  const [cartTracked, setCartTracked] = useState(false);

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
      // Get owned products from context
      const owned = getAllAccessibleProducts();
      setOwnedProducts(owned);
    }
  }, [isAuthenticated, user, getAllAccessibleProducts]);

  // Track checkout started when email is captured
  useEffect(() => {
    if (email && email.includes('@') && productKey && !cartTracked) {
      const trackCart = async () => {
        try {
          await fetch('/api/track-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              productKey,
              action: 'checkout_started',
              metadata: { name, bumps: selectedBumps },
            }),
          });
          setCartTracked(true);
        } catch (err) {
          console.log('Cart tracking error:', err);
        }
      };

      const timeoutId = setTimeout(trackCart, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [email, productKey, cartTracked, name, selectedBumps]);

  // Track abandonment when user leaves page without completing
  useEffect(() => {
    if (!cartTracked || !email || !productKey) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable tracking before page closes
      const data = JSON.stringify({
        email: email.toLowerCase().trim(),
        productKey,
        action: 'checkout_abandoned',
      });
      navigator.sendBeacon('/api/track-cart', data);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cartTracked, email, productKey]);

  // Check email ownership when email changes (debounced)
  useEffect(() => {
    const checkOwnership = async () => {
      if (!email || email.length < 5 || !email.includes('@')) return;

      setCheckingOwnership(true);
      try {
        const response = await fetch('/api/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            // Get all owned products including bundles
            const owned = new Set<string>();
            data.products.forEach((p: any) => {
              owned.add(p.product_key);
              // Add bundle products
              if (PRODUCT_BUNDLES[p.product_key]) {
                PRODUCT_BUNDLES[p.product_key].forEach(k => owned.add(k));
              }
            });
            setOwnedProducts(Array.from(owned));
          } else {
            setOwnedProducts([]);
          }
        }
      } catch (err) {
        console.log('Could not check ownership:', err);
      } finally {
        setCheckingOwnership(false);
      }
    };

    const timeoutId = setTimeout(checkOwnership, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  // Filter bumps to exclude owned products
  const bumps = useMemo(() => {
    return allBumps.filter(bump => !ownedProducts.includes(bump.key));
  }, [allBumps, ownedProducts]);

  useEffect(() => {
    if (!product) return;

    // Track checkout started
    analytics.beginCheckout({
      value: product.price / 100, // Convert cents to Rands for analytics
      currency: 'ZAR',
      items: [{ item_id: product.key, item_name: product.name, price: product.price / 100 }],
    });
  }, [product]);

  // Redirect bundled-only products to starter-kit (they're included free)
  if (productKey && BUNDLED_ONLY_PRODUCTS.includes(productKey)) {
    return <Navigate to="/contentpreneur-starter-kit" replace />;
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const toggleBump = (key: string) => {
    setSelectedBumps((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const calculateSubtotal = () => {
    let total = product.price;
    selectedBumps.forEach((key) => {
      const bump = bumps.find((b) => b.key === key);
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
      const productKeys = [product.key, ...selectedBumps];
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

  const subtotalZAR = calculateSubtotal();
  const totalZAR = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      analytics.addPaymentInfo({ value: totalZAR / 100, currency: 'ZAR' });

      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKeys: [product.key],
          includeOrderBumps: selectedBumps,
          customerEmail: email,
          customerName: name,
          discountCode: appliedDiscount?.code || null,
          discountAmount: appliedDiscount?.discount_amount || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Mark cart as completed before redirect
      if (cartTracked && email && productKey) {
        navigator.sendBeacon('/api/track-cart', JSON.stringify({
          email: email.toLowerCase().trim(),
          productKey,
          action: 'checkout_completed',
        }));
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
        {/* Back to product */}
        <Link
          to={product.salesPage}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to product
        </Link>

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
                      Your access will be sent to this email
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
                      Code <strong>{appliedDiscount.code}</strong> applied! Saving R
                      {(appliedDiscount.discount_amount / 100).toFixed(0)}
                    </div>
                  )}
                </div>

                {/* Order Bumps */}
                {(bumps.length > 0 || (allBumps.length > 0 && ownedProducts.length > 0)) && (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-gold-500" />
                      Special Offers (One-Time Only)
                    </h2>
                    {bumps.length === 0 && allBumps.length > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
                        <CheckCircle size={16} />
                        <span>You already own the add-on products available for this checkout!</span>
                      </div>
                    )}
                    <div className="space-y-3">
                      {bumps.map((bump) => (
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
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{bump.name}</span>
                                <span className="font-semibold text-gold-500">
                                  +R{(bump.price / 100).toFixed(0)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{bump.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
            <div className="glass-card p-6 sticky top-24">
              <div className="mb-4">
                <SocialProof variant="purchases" minViewers={2} maxViewers={8} className="text-xs" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Product Image */}
              {product.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-auto" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-medium text-gray-900">R{(product.price / 100).toFixed(0)}</span>
                </div>

                {selectedBumps.map((key) => {
                  const bump = bumps.find((b) => b.key === key);
                  if (!bump) return null;
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{bump.name}</span>
                      <span className="font-medium text-gray-600">R{(bump.price / 100).toFixed(0)}</span>
                    </div>
                  );
                })}

                {appliedDiscount && (
                  <>
                    <div className="divider my-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-600">R{(subtotalZAR / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>
                        Discount ({appliedDiscount.code})
                        {appliedDiscount.discount_type === 'percentage' &&
                          ` (${appliedDiscount.discount_value}%)`}
                      </span>
                      <span>-R{(appliedDiscount.discount_amount / 100).toFixed(0)}</span>
                    </div>
                  </>
                )}

                <div className="divider my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-gradient-gold">R{(totalZAR / 100).toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* Pre-order notice */}
              {product.isPreOrder && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pre-Order</p>
                      <p className="text-xs text-gray-500">This product is coming April 2026. You'll be notified when it's ready!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* What's included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="text-success-400 mr-2 shrink-0" size={14} />
                      {feature}
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
    </div>
  );
}
