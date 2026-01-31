import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth is not implemented - redirect to email-based login
    // This prevents the old OAuth flow from breaking
    const timer = setTimeout(() => {
      navigate('/members', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Redirecting to login...
        </h2>
        <p className="mt-2 text-gray-500">Please use your email to access your purchases</p>
      </div>
    </div>
  );
}
