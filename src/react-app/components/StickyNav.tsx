import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, login, logout } = useMemberAccess();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contentpreneur-starter-kit', label: 'Starter Kit' },
    { href: '/free/paids-workbook', label: 'Free Resources' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-xl md:text-2xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Contentpreneur<span className="text-primary-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-primary-600'
                    : 'text-white/90 hover:text-white'
                } ${location.pathname === link.href ? 'text-primary-500' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/members"
                  className={`font-medium transition-colors ${
                    isScrolled
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  My Content
                </Link>
                <button
                  onClick={logout}
                  className={`text-sm ${
                    isScrolled ? 'text-gray-500' : 'text-white/70'
                  } hover:text-primary-500`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="btn-primary text-sm"
              >
                Member Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-medium text-gray-700 hover:text-primary-600 ${
                    location.pathname === link.href ? 'text-primary-600' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-gray-200" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/members"
                    className="font-medium text-gray-700 hover:text-primary-600"
                  >
                    My Content
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left text-gray-500 hover:text-primary-600"
                  >
                    Logout ({user?.email})
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="btn-primary w-full"
                >
                  Member Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
