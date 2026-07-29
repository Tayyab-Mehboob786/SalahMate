/**
 * SalahMate — Centralized Theme Architecture (`src/context/ThemeContext.tsx`)
 *
 * Provides instant, frontend-only Light Mode / Dark Mode / Auto (System) switching
 * with persistent local storage via MMKV (`react-native-mmkv`) in native builds or `expo-secure-store` in Expo Go.
 *
 * Features:
 * - Three-option theme support: `'light' | 'dark' | 'auto'`
 * - Automatically tracks device `systemColorScheme` when in `'auto'` mode
 * - Lazy safe require of MMKV (prevents NitroModules crash in Expo Go)
 * - Reads saved theme preference synchronously on launch (zero flash)
 * - Exposes `currentTheme`, `isDarkMode`, `themeMode`, and `setThemeMode()` via React Context
 * - Synchronized with React Native Paper Material Design 3 and Glassmorphism tokens
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import type { ColorSchemeName } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { salahMateDarkTheme, salahMateLightTheme } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_MODE_STORAGE_KEY = 'salahmate_theme_mode';
const OLD_THEME_STORAGE_KEY = 'salahmate_theme_is_dark';

interface SimpleStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
}

let storage: SimpleStorage;

try {
  // Lazy require to prevent top-level NitroModules crash inside Expo Go / web
  const mmkvModule = require('react-native-mmkv');
  const mmkvInstance = mmkvModule.createMMKV({ id: 'salahmate-theme-storage' });
  storage = {
    getString: (key: string) => mmkvInstance.getString(key),
    set: (key: string, value: string) => mmkvInstance.set(key, value),
  };
} catch {
  // Safe fallback to Expo SecureStore (100% compatible with Expo Go)
  storage = {
    getString: (key: string) => {
      try {
        const val = SecureStore.getItem(key);
        return val !== null ? val : undefined;
      } catch {
        return undefined;
      }
    },
    set: (key: string, value: string) => {
      try {
        SecureStore.setItemAsync(key, value).catch(() => {});
      } catch {
        // Ignore storage write errors in restricted simulator environments
      }
    },
  };
}

export interface ThemeContextType {
  readonly currentTheme: SalahMateTheme;
  readonly isDarkMode: boolean;
  readonly themeMode: ThemeMode;
  readonly setThemeMode: (mode: ThemeMode) => void;
  readonly toggleTheme: () => void;
  readonly setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function getInitialThemeMode(): ThemeMode {
  try {
    const savedMode = storage.getString(THEME_MODE_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto') {
      return savedMode;
    }
    // Migration from boolean key if it exists
    const oldSaved = storage.getString(OLD_THEME_STORAGE_KEY);
    if (oldSaved !== undefined && oldSaved !== null) {
      return oldSaved === 'true' ? 'dark' : 'light';
    }
  } catch (error) {
    console.warn('Error reading theme mode from local storage:', error);
  }
  return 'auto'; // Default to auto/system
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getInitialThemeMode());

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      storage.set(THEME_MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Error saving theme mode to local storage:', error);
    }
  }, []);

  const setTheme = useCallback(
    (isDark: boolean) => {
      setThemeMode(isDark ? 'dark' : 'light');
    },
    [setThemeMode]
  );

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        storage.set(THEME_MODE_STORAGE_KEY, next);
      } catch (error) {
        console.warn('Error saving theme mode to local storage:', error);
      }
      return next;
    });
  }, []);

  const isDarkMode = useMemo(() => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const currentTheme = useMemo<SalahMateTheme>(
    () => (isDarkMode ? salahMateDarkTheme : salahMateLightTheme),
    [isDarkMode]
  );

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      currentTheme,
      isDarkMode,
      themeMode,
      setThemeMode,
      toggleTheme,
      setTheme,
    }),
    [currentTheme, isDarkMode, themeMode, setThemeMode, toggleTheme, setTheme]
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
