/**
 * SalahMate Protected Tabs Layout (`/(tabs)`)
 *
 * Apple Health & Headspace inspired bottom navigation tabs for authenticated users.
 * Features exactly 4 core tabs (Home, Track, Timings, Analytics) with 64dp touch height
 * for maximum readability and accessibility.
 *
 * Also wraps the tab hierarchy in `DrawerProvider` and renders `LeftNavigationDrawer`
 * to handle left-side hamburger drawer navigation for all profile & settings features.
 */

import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { AppIcon } from '@/components';
import { useTheme } from 'react-native-paper';
import { DrawerProvider } from '@/context/DrawerContext';
import { LeftNavigationDrawer } from '@/components/navigation/LeftNavigationDrawer';
import type { SalahMateTheme } from '@/theme';

export default function TabsLayout() {
  const theme = useTheme<SalahMateTheme>();

  return (
    <DrawerProvider>
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
            tabBarStyle: {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              borderTopWidth: 0.5,
              elevation: 8,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: theme.dark ? 0.3 : 0.05,
              shadowRadius: 8,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 24 : 8,
              height: Platform.OS === 'ios' ? 84 : 64,
            },
            tabBarLabelStyle: {
              fontWeight: '600',
              fontSize: 11,
              letterSpacing: 0.2,
              marginTop: 2,
            },
          }}
        >
          {/* 1. Home Tab */}
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size, focused }) => (
                <AppIcon
                  name={focused ? 'home' : 'home-outline'}
                  size={size ?? 24}
                  color={color as string}
                />
              ),
            }}
          />

          {/* 2. Track Tab */}
          <Tabs.Screen
            name="tracking"
            options={{
              title: 'Prayer Tracking',
              tabBarLabel: 'Track',
              tabBarIcon: ({ color, size, focused }) => (
                <AppIcon
                  name={focused ? 'calendar-check' : 'calendar-check-outline'}
                  size={size ?? 24}
                  color={color as string}
                />
              ),
            }}
          />

          {/* 3. Timings Tab */}
          <Tabs.Screen
            name="timings"
            options={{
              title: 'Prayer Timings',
              tabBarLabel: 'Timings',
              tabBarIcon: ({ color, size, focused }) => (
                <AppIcon
                  name={focused ? 'clock-time-four' : 'clock-outline'}
                  size={size ?? 24}
                  color={color as string}
                />
              ),
            }}
          />

          {/* 4. Analytics Tab */}
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Analytics',
              tabBarLabel: 'Analytics',
              tabBarIcon: ({ color, size, focused }) => (
                <AppIcon
                  name={focused ? 'chart-arc' : 'chart-line'}
                  size={size ?? 24}
                  color={color as string}
                />
              ),
            }}
          />

          {/* Profile Screen (Hidden from bottom tab bar; accessed strictly via left navigation drawer) */}
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
              headerShown: false,
            }}
          />
        </Tabs>

        {/* Global Left Navigation Drawer overlaying Tabs */}
        <LeftNavigationDrawer />
      </View>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
