/**
 * SalahMate — Centralized Theme Architecture (`src/context/ThemeContext.tsx`)
 *
 * Provides a unified theme Context for the single premium UI redesign.
 * All light/dark toggling has been removed.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { salahMateTheme } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface ThemeContextType {
  readonly currentTheme: SalahMateTheme;
  // Kept for backward compatibility if any components still check it, though it always returns false.
  readonly isDarkMode: boolean;
  // Dummy functions to prevent crashes if other parts of the app call them
  readonly toggleTheme: () => void;
  readonly setTheme: (isDark: boolean) => void;
  readonly syncThemeWithBackend: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      currentTheme: salahMateTheme,
      isDarkMode: false,
      toggleTheme: () => {},
      setTheme: () => {},
      syncThemeWithBackend: async () => {},
    }),
    []
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a <ThemeProvider>.');
  }
  return context;
}
