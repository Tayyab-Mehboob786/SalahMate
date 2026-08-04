import { AppIcon } from '@/components';
/**
 * SalahMate Left Navigation Drawer (`src/components/navigation/LeftNavigationDrawer.tsx`)
 *
 * Modern left-side navigation drawer with smooth slide-out animation (`react-native-reanimated`),
 * frosted glass profile header, and clean outlined menu items for Profile, Settings, Notifications,
 * Help & Support, About, and Logout.
 */

import React, { useEffect } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/auth/useAuth';
import { useDrawer } from '@/context/DrawerContext';
import { GlassAvatar } from '@/components/glass/GlassAvatar';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

// Drawer icon styling constants for high-contrast visibility
const DRAWER_ICON = {
  lightBg: '#E8F4F8',
  lightBorder: 'rgba(25, 105, 140, 0.15)',
  darkBg: 'rgba(25, 105, 140, 0.18)',
  darkBorder: 'rgba(25, 105, 140, 0.25)',
  iconColor: '#145874',
  iconColorDark: '#7FC8E8',
  activeIconBg: '#19698C',
  activeIconColor: '#FFFFFF',
} as const;

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.8, 310);

export const LeftNavigationDrawer: React.FC = () => {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const insets = useSafeAreaInsets();
  const { isOpen, closeDrawer } = useDrawer();
  const { user, logout } = useAuth();

  const userName = user?.fullName || 'User';
  const userEmail = user?.email || 'user@example.com';
  const initials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Reanimated shared values for drawer slide and backdrop fade
  const translateX = useSharedValue(-DRAWER_WIDTH - 20);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateX.value = withTiming(-DRAWER_WIDTH - 20, {
        duration: 260,
        easing: Easing.inOut(Easing.cubic),
      });
      backdropOpacity.value = withTiming(0, {
        duration: 240,
        easing: Easing.inOut(Easing.cubic),
      });
    }
  }, [isOpen, translateX, backdropOpacity]);

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  const handleNavigation = (path: string) => {
    closeDrawer();
    setTimeout(() => {
      router.push(path as any);
    }, 150);
  };

  const handleAction = (type: 'notifications' | 'help' | 'about' | 'logout') => {
    closeDrawer();
    setTimeout(() => {
      switch (type) {
        case 'notifications':
          Alert.alert(
            'Notifications',
            'Prayer reminder alerts are currently active for all 5 obligatory prayers and Adhan.',
          );
          break;
        case 'help':
          Alert.alert(
            'Help & Support',
            'Need assistance with calculation methods or Qibla calibration? Contact our support team at support@salahmate.app',
          );
          break;
        case 'about':
          Alert.alert(
            'About SalahMate',
            'SalahMate v2.4.0 (Build 2026.07)\n\nYour premium Islamic Prayer Companion crafted with Barakah.\n\nDeveloped by Tayyab Mehboob\nSupervised By Onaiza Maqbool',
          );
          break;
        case 'logout':
          logout();
          router.replace('/(auth)/login');
          break;
      }
    }, 150);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'box-none' : 'none'}>
      {/* Backdrop Overlay */}
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: theme.dark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(45, 52, 54, 0.45)' },
          animatedBackdropStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Slide-out Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerPanel,
          {
            width: DRAWER_WIDTH,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            paddingTop: Math.max(insets.top, 24) + spacing.xl,
            paddingBottom: Math.max(insets.bottom, 24),
            shadowColor: theme.colors.shadow,
          },
          animatedDrawerStyle,
        ]}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { borderBottomColor: theme.colors.border }]}>
          <GlassAvatar initials={initials} size={64} style={styles.avatar} />
          <Text variant="titleMedium" style={[styles.userName, { color: theme.colors.onSurface }]}>
            {userName}
          </Text>
          <Text variant="bodySmall" style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
            {userEmail}
          </Text>
          <View style={[styles.proBadge, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
            <AppIcon name="shield-check" size={14} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
            <Text variant="labelSmall" style={{ color: theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor, fontWeight: '700' }}>
              SPIRITUAL GUARDIAN
            </Text>
          </View>
        </View>

        {/* Menu Items List */}
        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/profile')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="account-circle-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Profile
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/settings')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="cog-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Settings
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          {/* Islamic Companion Section */}
          <Text variant="labelSmall" style={[styles.sectionHeader, { color: theme.colors.primary }]}>
            ISLAMIC COMPANION
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/goals')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="flag-checkered" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Islamic Goals
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/islamic-companion')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="view-grid-plus-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Companion Hub (All 10)
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/quran')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="book-open-page-variant" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Holy Quran
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/qibla')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="compass-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Qibla Compass
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/asma-ul-husna')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="star-crescent" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Asma-ul-Husna
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/hijri-calendar')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="calendar-month" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Hijri Calendar
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/duas')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="hands-pray" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Daily Duas
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/hadith')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="format-quote-close" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Hadith of the Day
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleNavigation('/islamic-events')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="calendar-star" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Sacred Events
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Preferences & Support Section */}
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleAction('notifications')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="bell-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Notifications
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleAction('help')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="help-circle-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                Help & Support
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handleAction('about')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.dark ? DRAWER_ICON.darkBg : DRAWER_ICON.lightBg, borderColor: theme.dark ? DRAWER_ICON.darkBorder : DRAWER_ICON.lightBorder }]}>
                <AppIcon name="information-outline" size={22} color={theme.dark ? DRAWER_ICON.iconColorDark : DRAWER_ICON.iconColor} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.onSurface }]}>
                About
              </Text>
            </View>
            <AppIcon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.colors.errorContainer || 'rgba(239, 68, 68, 0.1)' },
            ]}
            onPress={() => handleAction('logout')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <AppIcon name="logout" size={22} color={theme.colors.error} />
              </View>
              <Text variant="bodyLarge" style={[styles.menuLabel, { color: theme.colors.error }]}>
                Logout
              </Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* Drawer Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            SalahMate v2.4.0 · Crafted with Barakah
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    borderRightWidth: 1,
    elevation: 16,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 0.5,
    alignItems: 'flex-start',
  },
  avatar: {
    marginBottom: spacing.sm,
  },
  userName: {
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 2,
  },
  userEmail: {
    marginBottom: spacing.xs,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  menuScroll: {
    flex: 1,
  },
  menuContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionHeader: {
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    minHeight: 48,
    marginVertical: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontWeight: '600',
  },
  divider: {
    height: 0.5,
    marginVertical: spacing.md,
    marginHorizontal: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
});
