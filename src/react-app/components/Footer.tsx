import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Linkedin, Music, LogIn, Mail, Loader2, CheckCircle } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Footer() {
  const { isAuthenticated } = useMemberAccess();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter', tags: ['newsletter'] }),
      });
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Subscribe failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      icon: Instagram,
      url: 'https://instagram.com/mrnochill',
      hoverColor: 'hover:text-pink-500',
    },
    {
      icon: Twitter,
      url: 'https://twitter.com/mrnochill',
      hoverColor: 'hover:text-blue-500',
    },
    {
      icon: Linkedin,
      url: 'https://linkedin.com/in/mrnochill',
      hoverColor: 'hover:text-blue-600',
    },
    {
      icon: Youtube,
      url: 'https://youtube.com/@mrnochill',
      hoverColor: 'hover:text-red-500',
    },
    {
      icon: Music, // TikTok
      url: 'https://tiktok.com/@mrnochill',
      hoverColor: 'hover:text-gray-900',
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto mb-10 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Join 10,000+ Contentpreneurs
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Get weekly tips to grow your content business. No spam, ever.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 px-4 rounded-xl">
              <CheckCircle size={20} />
              <span className="font-medium">You're subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

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
