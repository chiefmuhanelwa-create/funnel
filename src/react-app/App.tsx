import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { loadAnalytics } from './utils/loadAnalytics';

// Public pages
import Home from './pages/Home';
import StarterKitProduct from './pages/StarterKitProduct';
import CheckoutStarterKit from './pages/CheckoutStarterKit';
import CheckoutSuccess from './pages/CheckoutSuccess';
import FreeWorkbook from './pages/FreeWorkbook';
import AuthCallback from './pages/AuthCallback';

// Member pages
import Members from './pages/Members';
import StarterKitCourse from './pages/StarterKitCourse';
import Dashboard from './pages/Dashboard';

// Admin pages
import Admin from './pages/Admin';

// Components
import StickyNav from './components/StickyNav';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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

          {/* Member routes */}
          <Route path="/members" element={<Members />} />
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
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
