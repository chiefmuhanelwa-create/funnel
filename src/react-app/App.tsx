import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { loadAnalytics } from './utils/loadAnalytics';

// Components
import StickyNav from './components/StickyNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Public pages - eagerly loaded
import Home from './pages/Home';
import StarterKitProduct from './pages/StarterKitProduct';
import CheckoutStarterKit from './pages/CheckoutStarterKit';
import CheckoutSuccess from './pages/CheckoutSuccess';
import AuthCallback from './pages/AuthCallback';

// Product pages - eagerly loaded for sales conversion
import InfluencersCodeProduct from './pages/InfluencersCodeProduct';
import TaxGuideProduct from './pages/TaxGuideProduct';
import ContentFoundationsProduct from './pages/ContentFoundationsProduct';
import CoachingProduct from './pages/CoachingProduct';
import ContentpreneurBookProduct from './pages/ContentpreneurBookProduct';
import Consultation from './pages/Consultation';
import FreeTools from './pages/FreeTools';
import RateCardPro from './pages/RateCardPro';
import TaxTools from './pages/TaxTools';
import LeadMagnetLanding from './pages/LeadMagnetLanding';

// Checkout pages
import Checkout from './pages/Checkout';

// Member pages
import MembersHub from './pages/MembersHub';
import Members from './pages/Members';
import StarterKitCourse from './pages/StarterKitCourse';
import ContentFoundationsCourse from './pages/ContentFoundationsCourse';
import MemberDownload from './pages/MemberDownload';
import Dashboard from './pages/Dashboard';

// Admin pages
import Admin from './pages/Admin';

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <StickyNav />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contentpreneur-starter-kit" element={<StarterKitProduct />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Product Sales Pages */}
          <Route path="/products/influencers-code" element={<InfluencersCodeProduct />} />
          <Route path="/products/tax-guide" element={<TaxGuideProduct />} />
          <Route path="/products/content-foundations" element={<ContentFoundationsProduct />} />
          <Route path="/products/coaching" element={<CoachingProduct />} />
          <Route path="/products/contentpreneur-book" element={<ContentpreneurBookProduct />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/free" element={<FreeTools />} />
          <Route path="/free/:toolKey" element={<FreeTools />} />
          <Route path="/tools/ratecard" element={<RateCardPro />} />
          <Route path="/tools/tax" element={<TaxTools />} />

          {/* Hidden Landing Pages for Ads (not in navigation) */}
          <Route path="/lp/:leadKey" element={<LeadMagnetLanding />} />

          {/* Checkout Routes - Generic checkout for all products */}
          <Route path="/checkout/starter-kit" element={<CheckoutStarterKit />} />
          <Route path="/checkout/:productKey" element={<Checkout />} />

          {/* Legacy product routes (redirect to new paths) */}
          <Route path="/influencers-code" element={<InfluencersCodeProduct />} />

          {/* Member routes */}
          <Route path="/members" element={<MembersHub />} />
          <Route path="/members/hub" element={<MembersHub />} />
          <Route path="/members/legacy" element={<Members />} />
          <Route path="/members/starter-kit" element={<StarterKitCourse />} />
          <Route path="/members/content-foundations" element={<ContentFoundationsCourse />} />
          <Route path="/members/:productKey" element={<MemberDownload />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white pt-20">
      <div className="text-center px-4">
        <div className="text-6xl sm:text-8xl font-black text-gradient-gold mb-4">404</div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="btn-primary inline-flex"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default App;
