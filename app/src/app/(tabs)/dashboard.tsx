import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/auth/useAuth';
import { usePullToRefresh } from '@/hooks';
import { prayersApi, StreakData, PrayerLog } from '@/api/prayers.api';
import { useLocation } from '@/context/LocationContext';
import { aiService } from '@/features/ai/services/ai.service';
import {
  AppIcon,
  GlassCard,
  ScreenContainer,
  AiChatBottomSheet,
  SpiritualInsightsBottomSheet,
  HomeSkeleton,
  CircularProgress,
  PrayerTimeline,
  TimelinePrayerItem
} from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { useSharedPrayerTimes } from '@/context';
import { useLivePrayerTimings } from '@/hooks/prayer/useLivePrayerTimings';
import { useDrawer } from '@/context/DrawerContext';

interface QuickAccessModule {
  title: string;
  icon: string;
  route: string;
}

const QUICK_ACCESS_MODULES: readonly QuickAccessModule[] = [
  { title: 'Quran', icon: 'book-open-page-variant', route: '/quran' },
  { title: 'Qibla', icon: 'compass-outline', route: '/qibla' },
  { title: 'Hijri', icon: 'calendar-month', route: '/hijri-calendar' },
  { title: 'Asma', icon: 'star-four-points', route: '/asma-ul-husna' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { location, isDetecting, error: locationError } = useLocation();
  const theme = useTheme<SalahMateTheme>();

  const [isAiChatVisible, setIsAiChatVisible] = useState(false);
  const [isSpiritualInsightsVisible, setIsSpiritualInsightsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [insight, setInsight] = useState<string>('Loading personalized insights...');
  const [todayLogs, setTodayLogs] = useState<PrayerLog[]>([]);

  const { data: prayerTimesData, isLoading: isPrayerTimesLoading, isError: isPrayerTimesError } = useSharedPrayerTimes();
  const { prayers: uiPrayers, nextPrayer, countdown, refetchLogs } = useLivePrayerTimings();

  const { openDrawer } = useDrawer();

  const loadData = useCallback(async () => {
    try {
      const [streak, logs] = await Promise.all([
        prayersApi.getStreak(),
        prayersApi.getToday(),
        refetchLogs(),
      ]);
      setStreakData(streak);
      setTodayLogs(logs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [refetchLogs]);

  const fetchInsight = useCallback(async () => {
    try {
      const res = await aiService.getInsight(location?.latitude, location?.longitude);
      setInsight(res.insight);
    } catch (e) {
      console.log('Failed to fetch AI insight', e);
      setInsight('AI Spiritual Insights');
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      fetchInsight();
    }, [loadData, fetchInsight])
  );

  const { refreshControl } = usePullToRefresh(loadData);

  const handleOpenChat = () => {
    setIsSpiritualInsightsVisible(false);
    setTimeout(() => {
      setIsAiChatVisible(true);
    }, 300);
  };

  const userName = user?.fullName || 'User';
  const firstName = userName.split(' ')[0];
  const gregorianDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const nextPrayerName = nextPrayer?.name || 'Next Prayer';
  const nextPrayerTime = nextPrayer?.time || '--:--';
  const displayCountdown = countdown || '--h --m --s';

  const getPrayerTime = (name: string) => {
    if (isPrayerTimesError || !prayerTimesData) return '--:--';
    switch (name.toLowerCase()) {
      case 'fajr': return prayerTimesData.timings.fajr;
      case 'dhuhr': return prayerTimesData.timings.dhuhr;
      case 'asr': return prayerTimesData.timings.asr;
      case 'maghrib': return prayerTimesData.timings.maghrib;
      case 'isha': return prayerTimesData.timings.isha;
      default: return '--:--';
    }
  };

  const renderLocationText = () => {
    if (isDetecting && !location) return 'Updating your location...';
    if (locationError && !location) return 'Location permission required.';
    if (isDetecting && location) return `Refreshing location... (${location.city})`;
    if (locationError && location) return `Using last known: ${location.city}`;
    return location ? `${location.city}, ${location.country}` : 'Unknown Location';
  };

  // Calculate Timeline Prayers from live timings & status
  const timelinePrayers: TimelinePrayerItem[] = uiPrayers.map(p => {
    let status: 'completed' | 'current' | 'pending' | 'missed' | 'qada' = 'pending';
    if (p.status === 'COMPLETED') status = 'completed';
    else if (p.status === 'MISSED') status = 'missed';
    else if (p.status === 'QADA') status = 'qada';
    else if (p.isCurrent) status = 'current';

    return {
      name: p.name,
      time: p.time,
      status
    };
  });

  const completedCount = timelinePrayers.filter(p => p.status === 'completed' || p.status === 'qada').length;
  const progressPercentage = (completedCount / 5) * 100;

  return (
    <View style={styles.mainWrapper}>
      <ScreenContainer
        scrollable
        withPadding
        withGlassGradient={false} // Allow pure background
        withBrandWatermark={false}
        backgroundImage={require('../../../assets/backgrounds/home-mosque.png')}
        contentContainerStyle={{ paddingBottom: 120 }} // padding for bottom tabs
        refreshControl={refreshControl}
      >
        {isLoading || isPrayerTimesLoading ? (
          <View style={{ paddingTop: 16 }}>
            <HomeSkeleton />
          </View>
        ) : (
          <View style={[styles.content, { paddingTop: 16 }]}>

            {/* 1. Header Card */}
            <View style={[styles.transparentGlassCard, styles.headerCard]}>
              <Pressable
                style={({ pressed }) => [styles.hamburgerBtnInline, pressed && { opacity: 0.7 }]}
                onPress={openDrawer}
              >
                <View style={styles.customHamburger}>
                  <View style={styles.hamburgerLineFull} />
                  <View style={styles.hamburgerLineHalf} />
                  <View style={styles.hamburgerLineFull} />
                </View>
              </Pressable>

              <View style={styles.headerContent}>
                <Text style={styles.greetingText} adjustsFontSizeToFit numberOfLines={1}>
                  Assalamu Alaikum {firstName}
                </Text>
                <Text style={styles.dateText}>
                  {gregorianDateStr}
                </Text>
                <Text style={styles.dateText}>
                  {prayerTimesData?.hijriDate || '--'}
                </Text>
                <Text style={styles.locationText}>
                  {renderLocationText()}
                </Text>
              </View>

              <View style={styles.hamburgerPlaceholder} />
            </View>

            {/* 2. AI Insights Card */}
            <Pressable
              onPress={() => setIsSpiritualInsightsVisible(true)}
              style={({ pressed }) => [
                styles.transparentGlassCard,
                styles.aiCard,
                { borderRadius: 16 },
                pressed && { opacity: 0.8 }
              ]}
            >
              <AppIcon name="robot-outline" size={28} color="#8EDCB8" style={{ marginBottom: 6 }} />
              <Text style={[styles.aiTitle, { textAlign: 'center' }]}>AI Spiritual Insights</Text>
              <Text style={[styles.aiSubtitle, { textAlign: 'center' }]}>Tap to Explore →</Text>
            </Pressable>

            {/* 3. Daily Progress & Stats */}
            <View style={[styles.transparentGlassCard, styles.progressCard]}>
              <View style={styles.progressRow}>
                <CircularProgress
                  statuses={timelinePrayers.map(p => p.status)}
                  percentage={progressPercentage}
                  radius={36}
                  strokeWidth={6}
                  color="#2ECC71"
                  trackColor="rgba(255,255,255,0.15)"
                />
                <View style={{ flex: 1, marginLeft: spacing.md, justifyContent: 'center' }}>
                  <Text style={styles.progressTitle}>Daily Progress: {completedCount}/5 Prayers</Text>
                  <Text style={styles.progressSubtitle}>🌱 A beautiful day for devotion.</Text>
                </View>
              </View>
            </View>

            {/* Stats Pill */}
            <View style={styles.statsPill}>
              <View style={styles.statsInner}>
                <Text style={styles.statsText}>Current Streak: {streakData?.currentStreak || 0} Days</Text>
                <View style={styles.statsDivider} />
                <Text style={styles.statsText}>Best: {streakData?.longestStreak || 0}</Text>
                <View style={styles.statsDivider} />
                <Text style={styles.statsText}>Wkly: {streakData ? Math.round(streakData.weeklyConsistency) : 0}%</Text>
              </View>
            </View>

            {/* 4. Next Prayer Card */}
            <View style={styles.nextPrayerCard}>
              <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
              <Text style={styles.nextPrayerTitle}>{nextPrayerName} • {nextPrayerTime}</Text>
              <Text style={styles.nextPrayerCountdown}>Starts in {displayCountdown}</Text>
            </View>

            {/* 5. Prayer Timeline Card */}
            <View style={[styles.transparentGlassCard, styles.timelineCard, { borderRadius: 20 }]}>
              <PrayerTimeline prayers={timelinePrayers} />
            </View>

            {/* 6. Islamic Companions */}
            <Text style={styles.companionsTitle}>Islamic Companions</Text>
            <View style={styles.companionGrid}>
              {QUICK_ACCESS_MODULES.map((module) => (
                <Pressable
                  key={module.title}
                  style={({ pressed }) => [styles.companionItem, pressed && { opacity: 0.7 }]}
                  onPress={() => router.push(module.route as any)}
                >
                  <View style={[styles.transparentGlassCard, styles.companionIconCard]}>
                    <View style={styles.companionIconContent}>
                      <AppIcon name={module.icon as any} size={28} color="#FFFFFF" />
                      <Text style={styles.companionLabel}>{module.title}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

          </View>
        )}
      </ScreenContainer>

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
    backgroundColor: 'transparent',
  },
  content: {
    paddingVertical: spacing.md,
    gap: 12, // Reduced gap slightly to fit screen nicely
  },
  // Common Glass Style matching Stats Pill
  transparentGlassCard: {
    backgroundColor: 'rgba(0,0,0,0.35)', // slightly blackish shade for better contrast
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    overflow: 'hidden',
  },

  // Header Card
  headerCard: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburgerBtnInline: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHamburger: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLineFull: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  hamburgerLineHalf: {
    width: '60%',
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  hamburgerPlaceholder: {
    width: 44, // Match width of hamburger button for centering
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    zIndex: 10,
    padding: 4,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // AI Card
  aiCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  aiSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // Progress Card
  progressCard: {
    padding: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // Stats Pill
  statsPill: {
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: -4,
  },
  statsInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Next Prayer Card
  nextPrayerCard: {
    backgroundColor: '#114B4A', // Dark teal color from screenshot
    borderRadius: 18,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextPrayerLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  nextPrayerTitle: {
    fontSize: 28,
    lineHeight: 38,
    paddingVertical: 4,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  nextPrayerCountdown: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.8)',
  },

  // Timeline Card
  timelineCard: {
    padding: spacing.md,
    paddingVertical: spacing.lg,
  },

  // Companions
  companionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  companionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  companionItem: {
    flex: 1,
  },
  companionIconCard: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: 2,
  },
  companionIconContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  companionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
});
