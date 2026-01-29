import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, LogOut } from 'lucide-react';
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
          ? 'bg-black/90 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left Side - Brand */}
          <Link
            to={isAuthenticated ? "/members" : "/"}
            className="flex flex-col group"
          >
            <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              CONTENTPRENEUR
            </span>
            <span className="text-yellow-400 text-xs sm:text-sm font-light -mt-1">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium text-sm transition-all duration-300 min-h-[44px]"
                >
                  <Home size={18} />
                  My Hub
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-400 font-medium text-sm transition-all duration-300 min-h-[44px]"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              /* Member Login for unauthenticated users */
              <Link
                to="/members"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 rounded-full text-gold-500 font-medium text-sm transition-all duration-300 min-h-[44px]"
              >
                <Home size={18} />
                Member Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              <div className="bg-black/95 backdrop-blur-lg rounded-2xl mt-2 mb-4 p-4 border border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/members"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/5 transition-all min-h-[44px]"
                    >
                      <Home size={18} />
                      My Hub
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all min-h-[44px]"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-white/50 text-sm">
                    <Link
                      to="/members"
                      className="text-yellow-400 hover:text-yellow-300 font-medium"
                    >
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
