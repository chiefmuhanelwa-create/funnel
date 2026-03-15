import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { hasAccessThroughBundle, getProductsToGrant } from '../../../lib/bundles';

interface UserData {
  email: string;
  name: string;
}

interface EmailAccess {
  email: string;
  productKeys: string[];
  products: Array<{ id: number; product_key: string; name: string }>;
  sessionToken?: string;
  verified?: boolean;
}

interface MemberAccessContextType {
  // User authentication state
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified: boolean;

  // Email-based access
  emailAccess: EmailAccess | null;

  // Access checks
  hasAccessToProduct: (productKey: string) => boolean;
  getAllAccessibleProducts: () => string[];

  // Actions
  loginWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string; sent?: boolean }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkEmailAccess: (email: string) => Promise<boolean>;
  clearAccess: () => void;
  refreshAccess: () => Promise<void>;
}

const MemberAccessContext = createContext<MemberAccessContextType | null>(null);

export function MemberAccessProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailAccess, setEmailAccess] = useState<EmailAccess | null>(null);

  // Check existing session on mount
  useEffect(() => {
    loadAccessFromStorage();
    setIsLoading(false);
  }, []);

  const loadAccessFromStorage = () => {
    try {
      const stored = localStorage.getItem('memberAccess');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if still valid (7 days - persistent login)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setEmailAccess(parsed.data);
          setUser({
            email: parsed.data.email,
            name: parsed.data.email.split('@')[0],
          });
        } else {
          localStorage.removeItem('memberAccess');
        }
      }
    } catch (error) {
      console.error('Failed to load access from storage:', error);
    }
  };

  // Legacy login (direct email check - for backwards compatibility)
  const loginWithEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const response = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      // Safely parse JSON - handle case where server returns HTML error page
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { success: false, error: 'Server error. Please try again in a few moments.' };
      }

      if (!response.ok) {
        console.error('Check access error:', data);
        if (response.status === 503) {
          return { success: false, error: 'Service temporarily unavailable. Please try again in a few moments.' };
        }
        return { success: false, error: data.message || 'Failed to check access. Please try again.' };
      }

      if (data.products && data.products.length > 0) {
        const accessData: EmailAccess = {
          email: normalizedEmail,
          productKeys: data.products.map((p: any) => p.product_key),
          products: data.products,
          verified: false, // Not verified through magic link
        };

        setEmailAccess(accessData);
        setUser({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
        });

        localStorage.setItem('memberAccess', JSON.stringify({
          data: accessData,
          timestamp: Date.now(),
        }));

        return { success: true };
      }

      return {
        success: false,
        error: 'No purchases found for this email. Please use the email you used during checkout.',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { success: false, error: 'Network error. Please check your connection and try again.' };
      }
      return { success: false, error: `Something went wrong: ${error?.message || 'Unknown error'}. Please try again.` };
    }
  };

  // Send magic link verification code
  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string; sent?: boolean }> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      // Safely parse JSON
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { success: false, error: 'Server error. Please try again in a few moments.' };
      }

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send verification code.' };
      }

      return { success: true, sent: data.sent };
    } catch (error) {
      console.error('Send magic link error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Verify code from magic link
  const verifyCode = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code }),
      });

      // Safely parse JSON
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { success: false, error: 'Server error. Please try again in a few moments.' };
      }

      if (!response.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      if (data.success && data.products) {
        const accessData: EmailAccess = {
          email: data.email,
          productKeys: data.products.map((p: any) => p.product_key),
          products: data.products,
          sessionToken: data.sessionToken,
          verified: true,
        };

        setEmailAccess(accessData);
        setUser({
          email: data.email,
          name: data.email.split('@')[0],
        });

        localStorage.setItem('memberAccess', JSON.stringify({
          data: accessData,
          timestamp: Date.now(),
        }));

        return { success: true };
      }

      return { success: false, error: 'Verification failed.' };
    } catch (error) {
      console.error('Verify code error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setEmailAccess(null);
    localStorage.removeItem('memberAccess');
  };

  const checkEmailAccess = async (email: string): Promise<boolean> => {
    const result = await loginWithEmail(email);
    return result.success;
  };

  const clearAccess = () => {
    setEmailAccess(null);
    setUser(null);
    localStorage.removeItem('memberAccess');
  };

  const hasAccessToProduct = useCallback((productKey: string): boolean => {
    if (!emailAccess?.productKeys) return false;
    return hasAccessThroughBundle(productKey, emailAccess.productKeys);
  }, [emailAccess]);

  const getAllAccessibleProducts = useCallback((): string[] => {
    if (!emailAccess?.productKeys) return [];
    return getProductsToGrant(emailAccess.productKeys);
  }, [emailAccess]);

  const refreshAccess = async () => {
    setIsLoading(true);

    if (emailAccess?.email) {
      await loginWithEmail(emailAccess.email);
    }

    setIsLoading(false);
  };

  const value: MemberAccessContextType = {
    user,
    isAuthenticated: !!user && !!emailAccess,
    isLoading,
    isVerified: emailAccess?.verified ?? false,
    emailAccess,
    hasAccessToProduct,
    getAllAccessibleProducts,
    loginWithEmail,
    sendMagicLink,
    verifyCode,
    logout,
    checkEmailAccess,
    clearAccess,
    refreshAccess,
  };

  return (
    <MemberAccessContext.Provider value={value}>
      {children}
    </MemberAccessContext.Provider>
  );
}

export function useMemberAccess() {
  const context = useContext(MemberAccessContext);

  if (!context) {
    throw new Error('useMemberAccess must be used within a MemberAccessProvider');
  }

  return context;
}
