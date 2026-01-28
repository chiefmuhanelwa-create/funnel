import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { loadAnalytics } from './utils/loadAnalytics';

// Components
import StickyNav from './components/StickyNav';
import Footer from './components/Footer';

// Public pages - eagerly loaded
import Home from './pages/Home';
import StarterKitProduct from './pages/StarterKitProduct';
import CheckoutStarterKit from './pages/CheckoutStarterKit';
import CheckoutSuccess from './pages/CheckoutSuccess';
import FreeWorkbook from './pages/FreeWorkbook';
import AuthCallback from './pages/AuthCallback';

// Product pages - eagerly loaded for sales conversion
import InfluencersCodeProduct from './pages/InfluencersCodeProduct';
import NicheFinderProduct from './pages/NicheFinderProduct';
import PAIDSWorkbookProduct from './pages/PAIDSWorkbookProduct';

// Member pages
import MembersHub from './pages/MembersHub';
import Members from './pages/Members';
import StarterKitCourse from './pages/StarterKitCourse';
import Dashboard from './pages/Dashboard';

// Admin pages
import Admin from './pages/Admin';

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-500">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-white/50">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <StickyNav />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contentpreneur-starter-kit" element={<StarterKitProduct />} />
          <Route path="/checkout/starter-kit" element={<CheckoutStarterKit />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/free/paids-workbook" element={<FreeWorkbook leadMagnet="paids-workbook" />} />
          <Route path="/free/niche-finder" element={<FreeWorkbook leadMagnet="niche-finder" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Individual Product Sales Pages */}
          <Route path="/products/influencers-code" element={<InfluencersCodeProduct />} />
          <Route path="/products/niche-finder" element={<NicheFinderProduct />} />
          <Route path="/products/paids-workbook" element={<PAIDSWorkbookProduct />} />

          {/* Legacy product routes (redirect to new paths) */}
          <Route path="/influencers-code" element={<InfluencersCodeProduct />} />
          <Route path="/niche-finder" element={<NicheFinderProduct />} />
          <Route path="/paids-workbook" element={<PAIDSWorkbookProduct />} />

          {/* Member routes */}
          <Route path="/members" element={<MembersHub />} />
          <Route path="/members/hub" element={<MembersHub />} />
          <Route path="/members/legacy" element={<Members />} />
          <Route path="/members/starter-kit" element={<StarterKitCourse />} />
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
    <div className="min-h-[60vh] flex items-center justify-center bg-dark-500 pt-20">
      <div className="text-center">
        <div className="text-8xl font-black text-gradient-gold mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
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
