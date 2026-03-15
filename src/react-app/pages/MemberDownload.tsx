import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, ArrowLeft, CheckCircle, Lock, ExternalLink, BookOpen, Video, Play } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { PRODUCT_ASSETS, IMAGES } from '../config/assets';

// Product tips for getting the most out of each product
const PRODUCT_TIPS: Record<string, string[]> = {
  'influencers-code': [
    'Read Chapter 1-3 to establish your mindset foundation',
    'Complete the exercises at the end of each chapter',
    'Reference the 3Es and DARES frameworks as you create content',
    'Review monthly to track your progress',
  ],
  'niche-finder': [
    "Set aside 60-90 minutes to complete all exercises",
    'Be honest in your self-assessment',
    'Research your competition before finalizing your niche',
    'Validate your niche with the checklist before committing',
  ],
  'paids-workbook': [
    "Start with one pillar at a time - don't try to do all 5 at once",
    'Products (P) and Information (I) are the easiest to start with',
    'Use the Brand Deal Calculator before accepting any sponsorships',
    'Track your income from each pillar monthly',
  ],
  'tax-guide': [
    'Keep all receipts for business expenses',
    'Understand the 35% rule for tax-deductible expenses',
    'Consider registering as a provisional taxpayer',
    'Consult with a tax professional for your specific situation',
  ],
  'starter-kit': [
    'Watch the videos in order - each builds on the previous',
    'Complete the workbooks as you go through the course',
    'Take notes and apply concepts immediately',
    'Join the community to connect with other contentpreneurs',
  ],
  'content-foundations': [
    'Complete the self-reflection exercises honestly',
    'Use your SWOT analysis to guide your content strategy',
    'Revisit your value alignment quarterly',
  ],
  'social-media-intro': [
    'Start with Module 1 to understand the social media landscape',
    'Choose 1-2 platforms to focus on initially',
    'Create your first piece of content within 24 hours of completing the course',
    'Consistency beats perfection - post regularly',
  ],
  'contentpreneur-book-ebook': [
    'Coming April 2026 - check your email for updates',
    'Pre-order customers get exclusive bonus content',
  ],
  'contentpreneur-book-hardcopy': [
    'Coming April 2026 - check your email for updates',
    'Pre-order customers get exclusive bonus content',
    'Free shipping within South Africa',
  ],
};

// Product descriptions
const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'influencers-code': 'The complete blueprint from creator to influential personal brand',
  'niche-finder': 'Discover your perfect content niche and stand out from the crowd',
  'paids-workbook': 'The proven 5-pillar system for building multiple income streams',
  'tax-guide': 'SARS compliance guide for South African content creators',
  'starter-kit': 'Complete system to build and monetize your personal brand',
  'content-foundations': 'Master content creation fundamentals with guided video modules',
  'contentpreneur-pro': 'Everything you need from mindset to monetization',
  'social-media-intro': 'Master social media marketing with 3 comprehensive video modules',
  'contentpreneur-book-ebook': 'The definitive digital guide to building a profitable content business',
  'contentpreneur-book-hardcopy': 'Physical book + eBook delivered to your door. Free SA shipping.',
};

// Product types
const PRODUCT_TYPES: Record<string, 'ebook' | 'workbook' | 'guide' | 'course' | 'bundle' | 'preorder'> = {
  'influencers-code': 'ebook',
  'niche-finder': 'workbook',
  'paids-workbook': 'workbook',
  'tax-guide': 'guide',
  'starter-kit': 'course',
  'content-foundations': 'course',
  'contentpreneur-pro': 'bundle',
  'social-media-intro': 'course',
  'contentpreneur-book-ebook': 'preorder',
  'contentpreneur-book-hardcopy': 'preorder',
};

export default function MemberDownload() {
  const { productKey } = useParams<{ productKey: string }>();
  const { isAuthenticated, hasAccessToProduct, isLoading } = useMemberAccess();

  const productAssets = productKey ? PRODUCT_ASSETS[productKey] : null;

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

  // Product not found - redirect to starter-kit course page if that's what was requested
  if (!productAssets) {
    if (productKey === 'starter-kit') {
      return <Navigate to="/members/starter-kit/course" replace />;
    }
    if (productKey === 'content-foundations') {
      return <Navigate to="/members/content-foundations/course" replace />;
    }
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
            <h1 className="text-section text-gray-900">Access Required</h1>
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
  if (!hasAccessToProduct(productKey!)) {
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
            <h1 className="text-section text-gray-900">Access Not Found</h1>
            <p className="mt-4 text-gray-500">
              You don't have access to {productAssets.name}. Would you like to purchase it?
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/members" className="btn-secondary">
                Back to Hub
              </Link>
              <Link to={`/checkout/${productKey}`} className="btn-primary">
                Get {productAssets.name}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const productType = PRODUCT_TYPES[productKey!] || 'ebook';
  const tips = PRODUCT_TIPS[productKey!] || [];
  const description = PRODUCT_DESCRIPTIONS[productKey!] || productAssets.name;
  const hasCourse = productAssets.course && productAssets.course.length > 0;
  const hasFiles = productAssets.files.length > 0;

  // Has access - show download page
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-content py-12">
        {/* Back to hub */}
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
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
                  {productType === 'course' || productType === 'bundle' ? (
                    <Video size={24} className="text-gray-900" />
                  ) : productType === 'ebook' ? (
                    <BookOpen size={24} className="text-gray-900" />
                  ) : (
                    <FileText size={24} className="text-gray-900" />
                  )}
                </div>
                <div>
                  <span className="badge badge-gold text-xs capitalize">{productType}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{productAssets.name}</h1>
                </div>
              </div>

              <p className="text-gray-500 mb-8">{description}</p>

              {/* Video Course Access */}
              {hasCourse && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Video size={18} className="text-amber-500" />
                    Video Modules
                  </h2>
                  <Link
                    to={`/members/${productKey}/course`}
                    className="block p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Play size={24} className="text-white ml-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                            Start Watching
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {productAssets.course!.length} video modules ready to watch
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={18} className="text-amber-500" />
                    </div>
                  </Link>
                </div>
              )}

              {/* Download Files */}
              {hasFiles && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Download size={18} className="text-gold-500" />
                    Your Downloads
                  </h2>
                  {productAssets.files.map((file, index) => (
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
                            <h3 className="font-semibold text-gray-900 group-hover:text-gold-500 transition-colors">
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
              )}

              {/* Tips for getting the most out of it */}
              {tips.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-success-400" />
                    Tips for Getting the Most Out of This
                  </h2>
                  <ul className="space-y-3">
                    {tips.map((tip, index) => (
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
            {productAssets.mockupImage && (
              <div className="glass-card p-4 mb-6">
                <img
                  src={productAssets.mockupImage}
                  alt={productAssets.name}
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
                  <p className="font-semibold text-gray-900">Access Granted</p>
                  <p className="text-xs text-gray-500">Lifetime access</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You have full access to this product. Download and watch as many times as you need.
              </p>
            </div>

            {/* Need Help */}
            <div className="glass-card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Having trouble accessing your content? Contact support and we'll help you out.
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
