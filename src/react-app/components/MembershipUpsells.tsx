import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PRODUCTS, formatPrice } from '../config/products';
import { IMAGES } from '../config/assets';

interface UpsellProduct {
  key: string;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  imageUrl: string;
  link: string;
  badge?: string;
  isPreOrder?: boolean;
}

// Build upsell products from centralized config (prices in ZAR cents)
const UPSELL_PRODUCTS: UpsellProduct[] = [
  {
    key: 'influencers-code',
    name: PRODUCTS['influencers-code'].name,
    description: PRODUCTS['influencers-code'].description,
    priceCents: PRODUCTS['influencers-code'].priceCents,
    originalPriceCents: PRODUCTS['influencers-code'].originalPriceCents,
    imageUrl: IMAGES.influencersCodeMockup,
    link: PRODUCTS['influencers-code'].purchaseLink,
    badge: 'BESTSELLER',
  },
  {
    key: 'tax-guide',
    name: PRODUCTS['tax-guide'].name,
    description: PRODUCTS['tax-guide'].description,
    priceCents: PRODUCTS['tax-guide'].priceCents,
    imageUrl: IMAGES.taxGuideMockup,
    link: PRODUCTS['tax-guide'].purchaseLink,
    badge: 'ESSENTIAL',
  },
  {
    key: 'content-foundations',
    name: PRODUCTS['content-foundations'].name,
    description: PRODUCTS['content-foundations'].description,
    priceCents: PRODUCTS['content-foundations'].priceCents,
    imageUrl: IMAGES.contentFoundationsMockup,
    link: PRODUCTS['content-foundations'].purchaseLink,
    badge: '3 MODULES',
  },
  {
    key: 'contentpreneur-book-hardcopy',
    name: PRODUCTS['contentpreneur-book-hardcopy'].name,
    description: PRODUCTS['contentpreneur-book-hardcopy'].description,
    priceCents: PRODUCTS['contentpreneur-book-hardcopy'].priceCents,
    originalPriceCents: PRODUCTS['contentpreneur-book-hardcopy'].originalPriceCents,
    imageUrl: IMAGES.contentpreneurBookMockup,
    link: PRODUCTS['contentpreneur-book-hardcopy'].purchaseLink,
    badge: 'COMING SOON',
    isPreOrder: PRODUCTS['contentpreneur-book-hardcopy'].isPreOrder,
  },
];

interface MembershipUpsellsProps {
  ownedProducts: string[];
}

export default function MembershipUpsells({ ownedProducts }: MembershipUpsellsProps) {
  // Filter out products the user already owns
  const availableUpsells = UPSELL_PRODUCTS.filter(
    (product) => !ownedProducts.includes(product.key)
  );

  if (availableUpsells.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-gold-500" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Expand Your Learning</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {availableUpsells.map((product) => (
          <Link
            key={product.key}
            to={product.link}
            className="group relative block p-5 rounded-xl border-2 border-gray-200 hover:border-gold-500 bg-white transition-all hover:shadow-lg"
          >
            {product.badge && (
              <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                product.badge === 'BESTSELLER'
                  ? 'bg-purple-500 text-white'
                  : product.badge === 'NEW'
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-500 text-black'
              }`}>
                {product.badge}
              </span>
            )}

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-gold-600">{formatPrice(product.priceCents)}</span>
                  {product.originalPriceCents && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPriceCents)}
                    </span>
                  )}
                  {product.isPreOrder && (
                    <span className="text-xs text-amber-600 font-medium">
                      Coming April 2026
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
