import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

interface BackButtonProps {
  /**
   * Override the default destination
   * If not provided, will auto-detect based on auth state
   */
  to?: string;
  /**
   * Override the label text
   */
  label?: string;
  /**
   * Show icon (default: true)
   */
  showIcon?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Context-aware back button that navigates:
 * - Authenticated users → /members (My Hub)
 * - Unauthenticated users → / (Home)
 *
 * Use this on all product and sales pages for consistent UX
 */
export default function BackButton({
  to,
  label,
  showIcon = true,
  className = '',
}: BackButtonProps) {
  const { isAuthenticated, emailAccess } = useMemberAccess();

  // Determine if user is logged in (either via auth or email access)
  const isLoggedIn = isAuthenticated || !!emailAccess;

  // Auto-detect destination based on auth state
  const destination = to ?? (isLoggedIn ? '/members' : '/');

  // Auto-detect label based on destination
  const displayLabel = label ?? (isLoggedIn ? 'Back to My Hub' : 'Back to Home');

  return (
    <Link
      to={destination}
      className={`inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm ${className}`}
    >
      {showIcon && <ArrowLeft size={16} />}
      {displayLabel}
    </Link>
  );
}
