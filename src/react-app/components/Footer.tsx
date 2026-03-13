import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Linkedin, Music, LogIn, Facebook } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Footer() {
  const { isAuthenticated } = useMemberAccess();

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://www.instagram.com/nochill_god/',
      hoverColor: 'hover:text-pink-500',
    },
    {
      icon: Twitter,
      url: 'https://x.com/NOCHILL_GOD',
      hoverColor: 'hover:text-blue-500',
    },
    {
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/ndivhuwo-muhanelwa/',
      hoverColor: 'hover:text-blue-600',
    },
    {
      icon: Youtube,
      url: 'https://www.youtube.com/@NOCHILLGOD',
      hoverColor: 'hover:text-red-500',
    },
    {
      icon: Music, // TikTok
      url: 'https://www.tiktok.com/@nochillgod',
      hoverColor: 'hover:text-gray-900',
    },
    {
      icon: Facebook,
      url: 'https://www.facebook.com/NdivhuwoMuhanelwaQuotes/',
      hoverColor: 'hover:text-blue-500',
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Member Login Button (if not authenticated) */}
        {!isAuthenticated && (
          <div className="flex justify-center mb-8">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-amber-500 hover:bg-amber-600 rounded-xl md:rounded-2xl text-gray-900 font-semibold text-sm md:text-base transition-all duration-300 min-h-[44px]"
            >
              <LogIn size={18} />
              Member Login
            </Link>
          </div>
        )}

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-400 ${social.hoverColor} transition-colors duration-300`}
            >
              <social.icon size={24} />
            </a>
          ))}
        </div>

        {/* Copyright & Contact */}
        <div className="text-center text-sm text-gray-500">
          <p>&copy; 2026 NOCHILL PTY LTD. All rights reserved.</p>
          <p className="mt-1">Turn Your Phone Into a Business.</p>
          <p className="mt-1">
            Questions? Email{' '}
            <a
              href="mailto:info@nochill.co.za"
              className="text-amber-600 hover:text-amber-700 hover:underline transition-colors duration-300"
            >
              info@nochill.co.za
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
