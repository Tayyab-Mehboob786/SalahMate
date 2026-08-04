/**
 * SalahMate Root Navigation Architecture
 *
 * Wraps the application in:
 * - AuthContext: Supplies current authentication state (`isAuthenticated`, `isLoading`).
 * - PaperProvider: Supplies Material Design 3 theme tokens (`salahMateLightTheme`).
 * - RootNavigationGuard: Monitors route segment changes (`useSegments`) and enforces
 *   Protected Routes vs Guest Routes separation.
 * - Stack: Root stack router managing Splash (`index`), Guest (`(auth)`), Main (`(tabs)`), and Modal (`settings`).
 */

import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext, useAuth, useAuthProviderState } from '@/hooks/auth/useAuth';
import { ThemeProvider, useAppTheme, LocationProvider, GoalsProvider, PrayerTimesProvider } from '@/context';

// Keep the native splash screen visible until initial app loading / auth guard completes
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Monitors route segment changes and redirects based on authentication status.
 * - Protected Routes: `(tabs)`, `settings`, `profile`, `ai-motivation`, `notifications`
 * - Guest Routes: `(auth)`
 */
function RootNavigationGuard() {
  const { isAuthenticated, isLoading, user, refreshUser } = useAuth();
  const { syncThemeWithBackend } = useAppTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const topSegment = segments[0] as unknown as string | undefined;
    const inAuthGroup = topSegment === '(auth)';
    const isSplash = topSegment === undefined || topSegment === 'index';

    // Guard protected routes from unauthenticated users
    if (!isAuthenticated && !inAuthGroup && !isSplash) {
      router.replace('/(auth)/login');
    } 
    // Guard auth routes from authenticated users
    else if (isAuthenticated && inAuthGroup) {
      if (!user) refreshUser();
      syncThemeWithBackend();
      router.replace('/(tabs)/dashboard');
    }
    // Also sync on initial mount if already authenticated
    else if (isAuthenticated && isSplash) {
      if (!user) refreshUser();
      syncThemeWithBackend();
    }
    // NOTE: isSplash routing is entirely handled by the index.tsx animated splash screen
  }, [isAuthenticated, isLoading, user, segments, router]);

  return null;
}

function RootAppContent() {
  const { currentTheme, isDarkMode } = useAppTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor(currentTheme.colors.background, true);
      RNStatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    }
  }, [currentTheme.colors.background, isDarkMode]);

  return (
    <PaperProvider theme={currentTheme}>
      <RootNavigationGuard />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', animationDuration: 300, gestureEnabled: true, gestureDirection: 'horizontal' }}>
        {/* Splash Screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Guest Routes Stack */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Protected Routes Stack (Main Application Flow) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Global Protected Modal/Settings Screen */}
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: 'Settings',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            animationDuration: 250,
          }}
        />

        {/* Islamic Companion Feature Modules */}
        <Stack.Screen name="quran" options={{ headerShown: false }} />
        <Stack.Screen name="asma-ul-husna" options={{ headerShown: false }} />
        <Stack.Screen name="hijri-calendar" options={{ headerShown: false }} />
        <Stack.Screen name="qibla" options={{ headerShown: false }} />
        <Stack.Screen name="duas" options={{ headerShown: false }} />
        <Stack.Screen name="hadith" options={{ headerShown: false }} />
        <Stack.Screen name="islamic-events" options={{ headerShown: false }} />
        <Stack.Screen name="islamic-companion" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {Platform.OS === 'android' ? (
        <RNStatusBar
          backgroundColor={currentTheme.colors.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent
        />
      ) : null}
    </PaperProvider>
  );
}

export default function RootLayout() {
  const authState = useAuthProviderState();

  return (
    <AuthContext.Provider value={authState}>
      <ThemeProvider>
        <LocationProvider>
          <GoalsProvider>
            <PrayerTimesProvider>
              <RootAppContent />
            </PrayerTimesProvider>
          </GoalsProvider>
        </LocationProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
