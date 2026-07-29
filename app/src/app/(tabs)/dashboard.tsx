import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/auth/useAuth';
import { usePullToRefresh } from '@/hooks';
import { useDrawer } from '@/context/DrawerContext';
import { useLocation } from '@/context/LocationContext';
import {
  AppIcon,
  GlassButton,
  GlassCard,
  GlassHeader,
  ScreenContainer,
  AiChatBottomSheet,
  DashboardGoalWidget,
  DailySummaryCard,
  SpiritualInsightsBottomSheet,
  HomeSkeleton,
} from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface MiniPrayerItem {
  readonly name: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  readonly time: string;
  readonly done: boolean;
  readonly active?: boolean;
  readonly icon: string;
}

const MINI_PRAYERS: readonly MiniPrayerItem[] = [
  { name: 'Fajr', time: '5:12 AM', done: true, active: false, icon: 'weather-sunset-up' },
  { name: 'Dhuhr', time: '1:30 PM', done: true, active: false, icon: 'weather-sunny' },
  { name: 'Asr', time: '4:15 PM', done: false, active: true, icon: 'weather-partly-cloudy' },
  { name: 'Maghrib', time: '7:45 PM', done: false, active: false, icon: 'weather-sunset-down' },
  { name: 'Isha', time: '9:15 PM', done: false, active: false, icon: 'weather-night' },
];

interface QuickAccessModule {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
}

const QUICK_ACCESS_MODULES: readonly QuickAccessModule[] = [
  { title: 'Quran', icon: 'book-open-page-variant', route: '/quran' },
  { title: 'Qibla', icon: 'compass-outline', route: '/qibla' },
  { title: 'Hijri', icon: 'calendar-month', route: '/hijri-calendar' },
  { title: 'Asma', icon: 'star-crescent', route: '/asma-ul-husna' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { openDrawer } = useDrawer();
  const { location } = useLocation();
  const theme = useTheme<SalahMateTheme>();
  const [isAiChatVisible, setIsAiChatVisible] = useState(false);
  const [isSpiritualInsightsVisible, setIsSpiritualInsightsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshControl } = usePullToRefresh();

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsSpiritualInsightsVisible(false);
    setTimeout(() => {
      setIsAiChatVisible(true);
    }, 300);
  };

  // Subtle Scroll Indicator State
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollY = useRef(0);
  const indicatorY = useSharedValue(0);

  useEffect(() => {
    indicatorY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [indicatorY]);

  useFocusEffect(
    useCallback(() => {
      if (scrollY.current < 30) {
        setHasScrolled(false);
      }
    }, [])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.current = offsetY;

    if (!hasScrolled && offsetY > 30) {
      setHasScrolled(true);
    }
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: indicatorY.value }],
  }));

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: withTiming(hasScrolled ? 0 : 56, { duration: 300 }),
    opacity: withTiming(hasScrolled ? 0 : 1, { duration: 300 }),
  }));

  const userName = user?.name ?? 'Tayyab';
  const firstName = userName.split(' ')[0];

  const gregorianDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.colors.background }]}>
      <ScreenContainer
        scrollable
        withPadding
        withGlassGradient
        withBrandWatermark
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
      >
        <GlassHeader
          title={`Assalamu Alaikum ${firstName}`}
          subtitle={
            <View style={styles.headerSubtitleBox}>
              <Text
                variant="bodySmall"
                style={[styles.gregorianText, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {gregorianDateStr}
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.hijriText, { color: theme.colors.primary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                20 Muharram 1447 AH
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <AppIcon name="map-marker" size={12} variant="error" style={{ marginRight: 2 }} />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}>
                  {location.city}, {location.country}
                </Text>
              </View>
            </View>
          }
          leftSlot={
            <Pressable
              style={({ pressed }) => [
                styles.hamburgerBtn,
                pressed && { opacity: 0.6, transform: [{ scale: 0.93 }] },
              ]}
              onPress={openDrawer}
              accessibilityRole="button"
              accessibilityLabel="Open Navigation Drawer"
            >
              <AppIcon name="menu" size="lg" variant="onSurface" />
            </Pressable>
          }
        />

        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <View style={styles.content}>

            {/* 3. AI Spiritual Insights */}
            <GlassCard borderRadius={16} contentStyle={styles.aiCompactCard} onPress={() => setIsSpiritualInsightsVisible(true)}>
              <View style={styles.aiCompactLeft}>
                <AppIcon name="robot-outline" size="md" variant="primary" />
                <View style={styles.aiCompactText}>
                  <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>AI Spiritual Insights</Text>
                </View>
              </View>
              <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                Tap to Explore →
              </Text>
            </GlassCard>

            {/* 4. Daily Summary Card (Streak + Next Prayer) */}
            <DailySummaryCard streak={18} nextPrayerName="Asr" nextPrayerTime="2:35 PM" />

            {/* 5. Current Goal */}
            <DashboardGoalWidget />

            {/* 6. Today's Prayers */}
            <View style={styles.sectionHeader}>
              <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Today's Prayers
              </Text>
            </View>
            <View style={styles.prayerRow}>
              {MINI_PRAYERS.map((prayer) => (
                <GlassCard
                  key={prayer.name}
                  borderRadius={12}
                  onPress={() => router.push('/tracking')}
                  style={[
                    styles.compactPrayerCard,
                    prayer.active && { borderColor: theme.colors.primary, borderWidth: 1 },
                  ]}
                  contentStyle={styles.compactPrayerContent}
                >
                  <AppIcon
                    name={prayer.icon as any}
                    size={18}
                    color={
                      prayer.done ? theme.colors.iconPrimary : prayer.active ? theme.colors.iconAchievement : theme.colors.iconSecondary
                    }
                  />
                  <Text
                    variant="labelSmall"
                    style={[
                      styles.compactPrayerName,
                      { color: theme.colors.onSurface, fontWeight: prayer.active ? '700' : '600' },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {prayer.name}
                  </Text>
                  <AppIcon
                    name={prayer.done ? 'check-circle' : prayer.active ? 'clock-outline' : 'circle-outline'}
                    size={12}
                    style={{ marginTop: 2 }}
                    color={
                      prayer.done ? theme.colors.iconPrimary : prayer.active ? theme.colors.iconAchievement : theme.colors.iconInactive
                    }
                  />
                </GlassCard>
              ))}
            </View>

            {/* 7. Islamic Companion */}
            <View style={styles.sectionHeader}>
              <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Islamic Companions
              </Text>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.primary, fontWeight: '600' }}
                onPress={() => router.push('/islamic-companion')}
              >
                All →
              </Text>
            </View>
            <View style={styles.companionRow}>
              {QUICK_ACCESS_MODULES.map((module) => (
                <Pressable
                  key={module.title}
                  style={({ pressed }) => [styles.companionItem, pressed && { opacity: 0.7 }]}
                  onPress={() => router.push(module.route as any)}
                >
                  <GlassCard
                    borderRadius={14}
                    style={styles.companionIconCard}
                    contentStyle={styles.companionIconContent}
                  >
                    <AppIcon name={module.icon as any} size="lg" variant="primary" />
                  </GlassCard>
                  <Text variant="labelSmall" style={[styles.companionLabel, { color: theme.colors.onSurface }]}>
                    {module.title}
                  </Text>
                </Pressable>
              ))}
            </View>



          </View>
        )}
      </ScreenContainer>

      {/* Subtle Scroll Indicator */}
      <Animated.View style={[styles.bottomIndicatorWrapper, animatedHeightStyle]}>
        <Animated.View
          style={[styles.scrollIndicator, animatedIndicatorStyle]}
          pointerEvents="none"
        >
          <View style={[styles.scrollIndicatorPill, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)' }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
              Explore More
            </Text>
            <AppIcon name="arrow-down" size="xs" variant="secondary" />
          </View>
        </Animated.View>
      </Animated.View>

      <SpiritualInsightsBottomSheet
        visible={isSpiritualInsightsVisible}
        onDismiss={() => setIsSpiritualInsightsVisible(false)}
        onOpenChat={handleOpenChat}
      />
      <AiChatBottomSheet visible={isAiChatVisible} onDismiss={() => setIsAiChatVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitleBox: {
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
    width: '100%',
  },
  gregorianText: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 11,
  },
  hijriText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 11,
  },
  content: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },

  // AI Compact Card
  aiCompactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  aiCompactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiCompactText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  aiCompactBtn: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 14,
  },

  // Compact Prayers
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  compactPrayerCard: {
    flex: 1,
  },
  compactPrayerContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    gap: 2,
  },
  compactPrayerName: {
    fontSize: 10,
    marginTop: 2,
  },

  // Companion
  companionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  companionItem: {
    alignItems: 'center',
    flex: 1,
  },
  companionIconCard: {
    width: '100%',
    aspectRatio: 1,
    padding: 0,
    marginBottom: 6,
  },
  companionIconContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  companionLabel: {
    fontWeight: '600',
    fontSize: 11,
  },



  bottomIndicatorWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
});
