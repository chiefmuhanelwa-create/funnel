import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Footer() {
  const { isAuthenticated, login } = useMemberAccess();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold">
              Contentpreneur<span className="text-primary-400">Hub</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Empowering content creators to build sustainable businesses through
              the PAIDS Framework. Transform your passion into profit.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://instagram.com/contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://youtube.com/@contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Youtube size={24} />
              </a>
              <a
                href="https://twitter.com/contentpreneurhub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contentpreneur-starter-kit"
                  className="text-gray-400 hover:text-white transition"
                >
                  Starter Kit
                </Link>
              </li>
              <li>
                <Link
                  to="/free/paids-workbook"
                  className="text-gray-400 hover:text-white transition"
                >
                  Free Resources
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@contentpreneurhub.online"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Member Access */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Members</h3>
            <ul className="space-y-2">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/members"
                      className="text-gray-400 hover:text-white transition"
                    >
                      My Content
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={login}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Member Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Contentpreneur Hub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
