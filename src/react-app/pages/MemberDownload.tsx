import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, ArrowLeft, CheckCircle, Lock, ExternalLink, BookOpen } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { DOCUMENTS, IMAGES } from '../config/assets';

// Product download configuration
const DOWNLOAD_PRODUCTS: Record<string, {
  key: string;
  name: string;
  description: string;
  type: 'ebook' | 'workbook' | 'guide';
  image?: string;
  files: { name: string; url: string; description?: string }[];
  tips?: string[];
}> = {
  'influencers-code': {
    key: 'influencers-code',
    name: "The Influencer's Code",
    description: 'The complete blueprint from creator to influential personal brand',
    type: 'ebook',
    image: IMAGES.influencersCodeMockup,
    files: [
      {
        name: "The Influencer's Code - Complete eBook.pdf",
        url: DOCUMENTS.influencersCode,
        description: 'Full 13-chapter guide to personal branding and influence'
      },
    ],
    tips: [
      'Read Chapter 1-3 to establish your mindset foundation',
      'Complete the exercises at the end of each chapter',
      'Reference the 3Es and DARES frameworks as you create content',
      'Review monthly to track your progress',
    ],
  },
  'niche-finder': {
    key: 'niche-finder',
    name: 'Niche Finder Workbook',
    description: 'Discover your perfect content niche and stand out from the crowd',
    type: 'workbook',
    image: IMAGES.nicheWorkbookMockup,
    files: [
      {
        name: 'Niche Finder Workbook.pdf',
        url: DOCUMENTS.nicheFinderWorkbook,
        description: '6 guided exercises to find your profitable niche'
      },
    ],
    tips: [
      'Set aside 60-90 minutes to complete all exercises',
      'Be honest in your self-assessment',
      'Research your competition before finalizing your niche',
      'Validate your niche with the checklist before committing',
    ],
  },
  'paids-workbook': {
    key: 'paids-workbook',
    name: 'PAIDS Framework Workbook',
    description: 'The proven 5-pillar system for building multiple income streams',
    type: 'workbook',
    image: IMAGES.paidsWorkbookMockup,
    files: [
      {
        name: 'PAIDS Framework Workbook.pdf',
        url: DOCUMENTS.paidsFrameworkWorkbook,
        description: 'Complete implementation guide for 5 income streams'
      },
    ],
    tips: [
      'Start with one pillar at a time - don\'t try to do all 5 at once',
      'Products (P) and Information (I) are the easiest to start with',
      'Use the Brand Deal Calculator before accepting any sponsorships',
      'Track your income from each pillar monthly',
    ],
  },
  'tax-guide': {
    key: 'tax-guide',
    name: 'Tax Guide for Contentpreneurs',
    description: 'SARS compliance guide for South African content creators',
    type: 'guide',
    image: IMAGES.taxGuideMockup,
    files: [
      {
        name: 'Tax Guide for Contentpreneurs.pdf',
        url: DOCUMENTS.taxGuide,
        description: 'Complete SARS compliance guide with VDP process'
      },
    ],
    tips: [
      'Keep all receipts for business expenses',
      'Understand the 35% rule for tax-deductible expenses',
      'Consider registering as a provisional taxpayer',
      'Consult with a tax professional for your specific situation',
    ],
  },
};

export default function MemberDownload() {
  const { productKey } = useParams<{ productKey: string }>();
  const { isAuthenticated, hasAccessToProduct, isLoading } = useMemberAccess();

  const product = productKey ? DOWNLOAD_PRODUCTS[productKey] : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return <Navigate to="/members" replace />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-tight py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/20 flex items-center justify-center mb-6">
              <Lock size={28} className="text-gold-500" />
            </div>
            <h1 className="text-section text-white">Access Required</h1>
            <p className="mt-4 text-gray-500">
              Please log in to access your purchased content.
            </p>
            <Link to="/members" className="mt-8 btn-primary inline-flex">
              Log In
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // No access to this product
  if (!hasAccessToProduct(product.key)) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container-tight py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-error-500/20 flex items-center justify-center mb-6">
              <Lock size={28} className="text-error-400" />
            </div>
            <h1 className="text-section text-white">Access Not Found</h1>
            <p className="mt-4 text-gray-500">
              You don't have access to {product.name}. Would you like to purchase it?
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/members" className="btn-secondary">
                Back to Hub
              </Link>
              <Link to={`/checkout/${product.key}`} className="btn-primary">
                Get {product.name}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Has access - show download page
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-12">
        {/* Back to hub */}
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to My Hub
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  {product.type === 'ebook' ? (
                    <BookOpen size={24} className="text-gray-900" />
                  ) : (
                    <FileText size={24} className="text-gray-900" />
                  )}
                </div>
                <div>
                  <span className="badge badge-gold text-xs capitalize">{product.type}</span>
                  <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                </div>
              </div>

              <p className="text-gray-500 mb-8">{product.description}</p>

              {/* Download Files */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Download size={18} className="text-gold-500" />
                  Your Downloads
                </h2>
                {product.files.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gold-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                          <FileText size={24} className="text-gold-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-gold-500 transition-colors">
                            {file.name}
                          </h3>
                          {file.description && (
                            <p className="text-sm text-gray-500 mt-1">{file.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gold-500">
                        <span className="text-sm font-medium hidden sm:block">Download</span>
                        <ExternalLink size={18} />
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Tips for getting the most out of it */}
              {product.tips && product.tips.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-success-400" />
                    Tips for Getting the Most Out of This
                  </h2>
                  <ul className="space-y-3">
                    {product.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-500">
                        <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-sm font-bold shrink-0">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Product Image */}
            {product.image && (
              <div className="glass-card p-4 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            )}

            {/* Access Status */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-success-500/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-success-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Access Granted</p>
                  <p className="text-xs text-gray-500">Lifetime access</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You have full access to this product. Download it as many times as you need.
              </p>
            </div>

            {/* Need Help */}
            <div className="glass-card p-6 mt-6">
              <h3 className="font-semibold text-white mb-3">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Having trouble with your download? Contact support and we'll help you out.
              </p>
              <a
                href="mailto:support@contentpreneurhub.online"
                className="text-gold-500 hover:text-gold-400 text-sm font-medium"
              >
                support@contentpreneurhub.online
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
