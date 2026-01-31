import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, LogOut, User } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useMemberAccess();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left Side - Brand */}
          <Link
            to={isAuthenticated ? "/members" : "/"}
            className="flex flex-col group"
          >
            <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900">
              CONTENTPRENEUR
            </span>
            <span className="text-amber-600 text-xs sm:text-sm font-medium -mt-1">
              by Mr NoChill
            </span>
          </Link>

          {/* Right Side - Auth Buttons (conditional) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* My Hub Button */}
                <Link
                  to="/members"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 rounded-full text-amber-700 font-medium text-sm transition-all duration-300 border border-amber-200"
                >
                  <Home size={18} />
                  My Hub
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-red-50 rounded-full text-gray-600 hover:text-red-600 font-medium text-sm transition-all duration-300 border border-gray-200 hover:border-red-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              /* Member Login for unauthenticated users */
              <Link
                to="/members"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-full text-gray-900 font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <User size={18} />
                Member Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-white rounded-2xl mt-2 mb-4 p-4 border border-gray-200 shadow-lg">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/members"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all min-h-[44px]"
                    >
                      <Home size={18} />
                      My Hub
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all min-h-[44px]"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Link
                      to="/members"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-full text-gray-900 font-medium transition-all"
                    >
                      <User size={18} />
                      Member Login
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
