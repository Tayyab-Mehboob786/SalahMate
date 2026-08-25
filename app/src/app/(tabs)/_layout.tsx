import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { AppIcon } from '@/components';
import { useTheme } from 'react-native-paper';
import { DrawerProvider } from '@/context/DrawerContext';
import { LeftNavigationDrawer } from '@/components/navigation/LeftNavigationDrawer';
import { BlurView } from 'expo-blur';
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
            tabBarActiveTintColor: '#16A085', // Teal active color
            tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
            tabBarBackground: () => (
              <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
            ),
            tabBarStyle: {
              position: 'absolute',
              bottom: Platform.OS === 'ios' ? 32 : 24,
              left: 20,
              right: 20,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
              elevation: 0, // Remove android shadow to prefer blur
              paddingBottom: 0,
              overflow: 'hidden',
            },
            tabBarItemStyle: {
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarLabelStyle: {
              fontWeight: '600',
              fontSize: 10,
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
                <View style={styles.tabIconContainer}>
                  <AppIcon
                    name={focused ? 'home' : 'home'}
                    size={size ?? 22}
                    color={color as string}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
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
                <View style={styles.tabIconContainer}>
                  <AppIcon
                    name={'format-list-checks'}
                    size={size ?? 22}
                    color={color as string}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
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
                <View style={styles.tabIconContainer}>
                  <AppIcon
                    name={'clock-time-four'}
                    size={size ?? 22}
                    color={color as string}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
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
                <View style={styles.tabIconContainer}>
                  <AppIcon
                    name={'chart-bar'}
                    size={size ?? 22}
                    color={color as string}
                  />
                  {focused && <View style={styles.activeIndicator} />}
                </View>
              ),
            }}
          />

          {/* Profile Screen (Hidden) */}
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
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -18,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#16A085',
  },
});
