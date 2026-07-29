/**
 * SalahMate — Dynamic Expo Configuration
 *
 * Using app.config.ts instead of app.json allows:
 *   1. Reading environment variables at build time
 *   2. Conditional configuration per environment
 *   3. TypeScript support for configuration
 *
 * Environment variables are injected via the `extra` field
 * and accessed at runtime through expo-constants.
 */

import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SalahMate',
  slug: 'salahmate',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'salahmate',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.salahmate.app',
  },
  android: {
    package: 'com.salahmate.app',
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/android-icon-foreground.png',
    },
  },
  androidStatusBar: {
    barStyle: 'dark-content',
    backgroundColor: '#00000000',
    translucent: true,
  },
  web: {
    output: 'static' as const,
    favicon: './assets/images/favicon.png',
  },

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F8FAFC',
        image: './assets/branding/splash_logo.png',
        dark: {
          backgroundColor: '#0F172A',
          image: './assets/branding/splash_logo.png',
        },
        imageWidth: 300,
        resizeMode: 'contain',
      },
    ],
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    APP_ENV: process.env.APP_ENV || 'development',
  },
});
