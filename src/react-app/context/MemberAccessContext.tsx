import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface UserData {
  email: string;
  name: string;
}

interface EmailAccess {
  email: string;
  productKeys: string[];
  products: Array<{ id: number; product_key: string; name: string }>;
}

interface MemberAccessContextType {
  // User authentication state
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Email-based access
  emailAccess: EmailAccess | null;

  // Access checks
  hasAccessToProduct: (productKey: string) => boolean;
  getAllAccessibleProducts: () => string[];

  // Actions
  loginWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
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
      const stored = sessionStorage.getItem('memberAccess');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if still valid (24 hours)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setEmailAccess(parsed.data);
          setUser({
            email: parsed.data.email,
            name: parsed.data.email.split('@')[0], // Use email prefix as name
          });
        } else {
          sessionStorage.removeItem('memberAccess');
        }
      }
    } catch (error) {
      console.error('Failed to load access from storage:', error);
    }
  };

  const loginWithEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email has any purchases
      const response = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to check access. Please try again.' };
      }

      const data = await response.json();

      if (data.products && data.products.length > 0) {
        const accessData: EmailAccess = {
          email: normalizedEmail,
          productKeys: data.products.map((p: any) => p.product_key),
          products: data.products,
        };

        setEmailAccess(accessData);
        setUser({
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
        });

        // Store in sessionStorage with timestamp
        sessionStorage.setItem('memberAccess', JSON.stringify({
          data: accessData,
          timestamp: Date.now(),
        }));

        return { success: true };
      }

      return {
        success: false,
        error: 'No purchases found for this email. Please use the email you used during checkout.',
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setEmailAccess(null);
    sessionStorage.removeItem('memberAccess');
  };

  const checkEmailAccess = async (email: string): Promise<boolean> => {
    const result = await loginWithEmail(email);
    return result.success;
  };

  const clearAccess = () => {
    setEmailAccess(null);
    setUser(null);
    sessionStorage.removeItem('memberAccess');
  };

  const hasAccessToProduct = useCallback((productKey: string): boolean => {
    if (emailAccess?.productKeys.includes(productKey)) {
      return true;
    }

    // Check for bundle access (starter-kit includes niche-finder and paids-workbook)
    if (productKey === 'niche-finder' || productKey === 'paids-workbook') {
      if (emailAccess?.productKeys.includes('starter-kit')) {
        return true;
      }
    }

    return false;
  }, [emailAccess]);

  const getAllAccessibleProducts = useCallback((): string[] => {
    const products = new Set<string>();

    emailAccess?.productKeys.forEach(key => {
      products.add(key);

      // Add bundled products
      if (key === 'starter-kit') {
        products.add('niche-finder');
        products.add('paids-workbook');
      }
    });

    return Array.from(products);
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
    emailAccess,
    hasAccessToProduct,
    getAllAccessibleProducts,
    loginWithEmail,
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
