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
  // OAuth authentication
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  oauthProductKeys: string[];

  // Email-based access (fallback)
  emailAccess: EmailAccess | null;

  // Combined access check
  hasAccessToProduct: (productKey: string) => boolean;
  getAllAccessibleProducts: () => string[];

  // Actions
  login: () => void;
  logout: () => void;
  checkEmailAccess: (email: string) => Promise<boolean>;
  clearEmailAccess: () => void;
  refreshAccess: () => Promise<void>;
}

const MemberAccessContext = createContext<MemberAccessContextType | null>(null);

export function MemberAccessProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oauthProductKeys, setOauthProductKeys] = useState<string[]>([]);
  const [emailAccess, setEmailAccess] = useState<EmailAccess | null>(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
    loadEmailAccessFromStorage();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        await fetchUserProducts();
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await fetch('/api/auth/user-products', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOauthProductKeys(data.productKeys || []);
      }
    } catch (error) {
      console.error('Failed to fetch user products:', error);
    }
  };

  const loadEmailAccessFromStorage = () => {
    try {
      const stored = sessionStorage.getItem('emailAccess');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if still valid (24 hours)
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setEmailAccess(parsed.data);
        } else {
          sessionStorage.removeItem('emailAccess');
        }
      }
    } catch (error) {
      console.error('Failed to load email access from storage:', error);
    }
  };

  const login = () => {
    // Redirect to OAuth login
    window.location.href = '/api/auth/google/redirect';
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { credentials: 'include' });
      setUser(null);
      setOauthProductKeys([]);
      setEmailAccess(null);
      sessionStorage.removeItem('emailAccess');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkEmailAccess = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/products/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.products && data.products.length > 0) {
          const accessData: EmailAccess = {
            email,
            productKeys: data.products.map((p: any) => p.product_key),
            products: data.products,
          };

          setEmailAccess(accessData);

          // Store in sessionStorage with timestamp
          sessionStorage.setItem('emailAccess', JSON.stringify({
            data: accessData,
            timestamp: Date.now(),
          }));

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Email access check error:', error);
      return false;
    }
  };

  const clearEmailAccess = () => {
    setEmailAccess(null);
    sessionStorage.removeItem('emailAccess');
  };

  const hasAccessToProduct = useCallback((productKey: string): boolean => {
    // Check OAuth access first
    if (oauthProductKeys.includes(productKey)) {
      return true;
    }

    // Check email-based access
    if (emailAccess?.productKeys.includes(productKey)) {
      return true;
    }

    return false;
  }, [oauthProductKeys, emailAccess]);

  const getAllAccessibleProducts = useCallback((): string[] => {
    const products = new Set<string>();

    oauthProductKeys.forEach(key => products.add(key));
    emailAccess?.productKeys.forEach(key => products.add(key));

    return Array.from(products);
  }, [oauthProductKeys, emailAccess]);

  const refreshAccess = async () => {
    setIsLoading(true);
    await checkSession();

    if (emailAccess?.email) {
      await checkEmailAccess(emailAccess.email);
    }

    setIsLoading(false);
  };

  const value: MemberAccessContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    oauthProductKeys,
    emailAccess,
    hasAccessToProduct,
    getAllAccessibleProducts,
    login,
    logout,
    checkEmailAccess,
    clearEmailAccess,
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
