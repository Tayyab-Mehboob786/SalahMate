/**
 * SalahMate Guest Routes Group Layout (`/(auth)`)
 *
 * Stack navigator grouping all authentication-related guest screens.
 * Protected by `RootNavigationGuard` — if an authenticated user lands here,
 * they are automatically redirected to `/(tabs)/dashboard`.
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Create Account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
