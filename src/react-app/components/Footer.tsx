import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Mail, Shield, CreditCard } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Footer() {
  const { isAuthenticated, login } = useMemberAccess();

  return (
    <footer className="bg-dark-600 border-t border-white/5">
      {/* Main footer content */}
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-white">
                Contentpreneur<span className="text-gradient-gold">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-white/50 max-w-md leading-relaxed">
              Empowering content creators to build sustainable businesses through
              the PAIDS Framework. Transform your passion into profit.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com/@contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://twitter.com/contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:hello@contentpreneurhub.online"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
              >
                <Mail size={20} />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="security-badge">
                <Shield size={14} />
                <span>SSL Secured</span>
              </div>
              <div className="security-badge">
                <CreditCard size={14} />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/50 hover:text-gold-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contentpreneur-starter-kit"
                  className="text-white/50 hover:text-gold-500 transition-colors"
                >
                  Starter Kit
                </Link>
              </li>
              <li>
                <Link
                  to="/free/paids-workbook"
                  className="text-white/50 hover:text-gold-500 transition-colors"
                >
                  Free Resources
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@contentpreneurhub.online"
                  className="text-white/50 hover:text-gold-500 transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Member Access */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Members
            </h3>
            <ul className="space-y-3">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/members"
                      className="text-white/50 hover:text-gold-500 transition-colors"
                    >
                      My Content
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-white/50 hover:text-gold-500 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={login}
                    className="text-white/50 hover:text-gold-500 transition-colors"
                  >
                    Member Login
                  </button>
                </li>
              )}
            </ul>

            {/* Newsletter signup hint */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/70 mb-3">Get free tips weekly</p>
              <Link
                to="/free/paids-workbook"
                className="text-sm text-gold-500 hover:text-gold-400 font-medium"
              >
                Join 10K+ creators →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-content py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Contentpreneur Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
