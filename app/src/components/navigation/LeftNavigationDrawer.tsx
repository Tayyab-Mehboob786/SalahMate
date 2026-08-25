import { AppIcon } from '@/components/common/AppIcon';
/**
 * SalahMate Left Navigation Drawer (`src/components/navigation/LeftNavigationDrawer.tsx`)
 */

import React, { useEffect, useState } from 'react';
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
import { BlurView } from 'expo-blur';
import { AboutSalahMateBottomSheet } from './AboutSalahMateBottomSheet';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.8, 310);

export const LeftNavigationDrawer: React.FC = () => {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const insets = useSafeAreaInsets();
  const { isOpen, closeDrawer } = useDrawer();
  const { user, logout } = useAuth();
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  const userName = user?.fullName || 'User';
  const userEmail = user?.email || 'user@example.com';
  const initials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          Alert.alert('Notifications', 'Prayer reminder alerts are currently active for all 5 obligatory prayers and Adhan.');
          break;
        case 'about':
          setIsAboutVisible(true);
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
          { backgroundColor: 'rgba(0, 0, 0, 0.65)' },
          animatedBackdropStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Slide-out Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerPanel,
          { width: DRAWER_WIDTH },
          animatedDrawerStyle,
        ]}
      >
        <BlurView intensity={20} tint="dark" style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />
        
        <View style={{ flex: 1, paddingTop: Math.max(insets.top, 24) + spacing.xl, paddingBottom: Math.max(insets.bottom, 24) }}>
          <View style={[styles.profileHeader, { borderBottomColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <GlassAvatar 
              initials={initials} 
              size={64} 
              style={styles.avatar} 
              textColor="#FFFFFF"
              backgroundColor="rgba(255, 255, 255, 0.15)"
              borderColor="rgba(255, 255, 255, 0.3)"
            />
            <Text variant="titleMedium" style={[styles.userName, { color: '#FFFFFF' }]}>
              {userName}
            </Text>
            <Text variant="bodySmall" style={[styles.userEmail, { color: 'rgba(255, 255, 255, 0.7)' }]}>
              {userEmail}
            </Text>
            <View style={[styles.proBadge, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
              <AppIcon name="shield-check" size={14} color="#FFFFFF" />
              <Text variant="labelSmall" style={{ color: '#FFFFFF', fontWeight: '700' }}>
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
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/profile')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="account-circle-outline" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Profile</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/settings')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="cog-outline" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Settings</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Text variant="labelSmall" style={[styles.sectionHeader, { color: '#4ADE80' }]}>
              ISLAMIC COMPANION
            </Text>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/goals')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="flag-checkered" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Islamic Goals</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/quran')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="book-open-page-variant" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Holy Quran</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/qibla')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="compass-outline" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Qibla Compass</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/asma-ul-husna')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="star-four-points" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Asma-ul-Husna</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleNavigation('/hijri-calendar')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="calendar-month" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Hijri Calendar</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>



            <View style={[styles.divider, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />

            {/* Preferences & Support Section */}
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleAction('notifications')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="bell-outline" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>Notifications</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
              onPress={() => handleAction('about')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="information-outline" size={24} color="#FFFFFF" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FFFFFF' }]}>About</Text>
              </View>
              <AppIcon name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>

            <View style={[styles.divider, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}
              onPress={() => handleAction('logout')}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconBox}>
                  <AppIcon name="logout" size={24} color="#FF6B6B" />
                </View>
                <Text variant="bodyLarge" style={[styles.menuLabel, { color: '#FF6B6B' }]}>Logout</Text>
              </View>
            </Pressable>
          </ScrollView>

          {/* Drawer Footer */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
              SalahMate v1.0.0 · Crafted with Barakah
            </Text>
          </View>
        </View>
      </Animated.View>
      <AboutSalahMateBottomSheet visible={isAboutVisible} onDismiss={() => setIsAboutVisible(false)} />
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
    borderColor: 'rgba(74, 222, 128, 0.4)', // matches the emerald green border from settings
    elevation: 16,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
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
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontWeight: '500',
    fontSize: 16,
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
