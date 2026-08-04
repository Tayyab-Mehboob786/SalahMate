/**
 * SalahMate Authentication Hook & State Architecture
 *
 * Provides current user state (`isAuthenticated`, `isLoading`) to the Root Navigation Guard.
 * This is the architectural contract for Phase 2+ authentication implementation.
 */

import { createContext, useContext, useMemo, useState } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (userData?: any) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

/**
 * Placeholder Auth Provider for Navigation Guard verification.
 * In production / future phases, this will read from SecureStore and TanStack Query.
 */
import { usersApi } from '@/api/users.api';

export function useAuthProviderState(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  const login = (userData?: any) => {
    console.log('[AuthContext] login() called, AuthContext updated');
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    console.log('[AuthContext] logout() called');
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.warn('Failed to refresh user profile:', error);
    }
  };

  return useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      refreshUser,
    }),
    [isAuthenticated, isLoading, user],
  );
}
