import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Linkedin, Music, LogIn } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Footer() {
  const { isAuthenticated, login } = useMemberAccess();

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://instagram.com/mrnochill',
      hoverColor: 'hover:text-pink-400',
    },
    {
      icon: Twitter,
      url: 'https://twitter.com/mrnochill',
      hoverColor: 'hover:text-blue-400',
    },
    {
      icon: Linkedin,
      url: 'https://linkedin.com/in/mrnochill',
      hoverColor: 'hover:text-blue-500',
    },
    {
      icon: Youtube,
      url: 'https://youtube.com/@mrnochill',
      hoverColor: 'hover:text-red-500',
    },
    {
      icon: Music, // TikTok
      url: 'https://tiktok.com/@mrnochill',
      hoverColor: 'hover:text-white',
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Member Login Button (if not authenticated) */}
        {!isAuthenticated && (
          <div className="flex justify-center mb-8">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 rounded-xl md:rounded-2xl text-white font-semibold text-sm md:text-base transition-all duration-300 min-h-[44px]"
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
              className={`w-6 h-6 text-blue-300 ${social.hoverColor} transition-colors duration-300`}
            >
              <social.icon size={24} />
            </a>
          ))}
        </div>

        {/* Copyright & Contact */}
        <div className="text-center text-sm text-blue-300/60">
          <p>&copy; 2024 NOCHILL PTY LTD. All rights reserved.</p>
          <p className="mt-1">Turn Your Phone Into a Business.</p>
          <p className="mt-1">
            Questions? Email{' '}
            <a
              href="mailto:info@nochill.co.za"
              className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors duration-300"
            >
              info@nochill.co.za
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
