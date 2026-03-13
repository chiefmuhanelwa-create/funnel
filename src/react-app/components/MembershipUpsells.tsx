import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Monitor, Gift, FileText } from 'lucide-react';

interface UpsellProduct {
  key: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ElementType;
  link: string;
  badge?: string;
  isPreOrder?: boolean;
}

const UPSELL_PRODUCTS: UpsellProduct[] = [
  {
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'Bestselling eBook with 6,000+ copies sold. Learn the secrets of successful influencers.',
    price: 19,
    originalPrice: 197,
    icon: BookOpen,
    link: '/checkout/influencers-code',
    badge: 'BESTSELLER',
  },
  {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'Essential tax strategies and legal protection for South African content creators.',
    price: 47,
    icon: FileText,
    link: '/checkout/tax-guide',
    badge: 'ESSENTIAL',
  },
  {
    key: 'content-foundations',
    name: 'Content Foundations Course',
    description: 'Master content creation fundamentals with 3 video modules: Self Reflection, SWOT Analysis, Value Alignment.',
    price: 37,
    icon: Monitor,
    link: '/checkout/content-foundations',
    badge: '3 MODULES',
  },
  {
    key: 'contentpreneur-book-ebook',
    name: 'Contentpreneur Guide (eBook)',
    description: 'The definitive guide to building a profitable content business.',
    price: 19,
    originalPrice: 27,
    icon: BookOpen,
    link: '/checkout/contentpreneur-book-ebook',
    badge: 'COMING SOON',
    isPreOrder: true,
  },
  {
    key: 'contentpreneur-book-hardcopy',
    name: 'Contentpreneur Guide (Hardcopy)',
    description: 'Physical book + eBook. Free shipping in South Africa.',
    price: 37,
    originalPrice: 47,
    icon: Gift,
    link: '/checkout/contentpreneur-book-hardcopy',
    badge: 'COMING SOON',
    isPreOrder: true,
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
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-colors">
                <product.icon className="text-gold-500" size={24} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-gold-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
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
