/**
 * SalahMate Prayer Tracking Screen (`/(tabs)/tracking`)
 *
 * Premium Apple Health & Headspace inspired prayer tracking experience.
 * Features dedicated prayer cards with prayer-specific icons (`MaterialCommunityIcons`),
 * prayer color accents, exact timings, and tactile checkmark interactions.
 */

import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { usePullToRefresh } from '@/hooks';
import { PrayerSkeleton } from '@/components/skeletons/PrayerSkeleton';
import {
  GlassCard,
  GlassHeader,
  GlassStatisticCard,
  ProgressRing,
  ScreenContainer,
  PrayerDetailsBottomSheet,
} from '@/components';
import type { PrayerDetailsData } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import type { PrayerLogStatus, PrayerName } from '@/types/prayer.types';

interface PrayerItem {
  name: PrayerName;
  time: string;
  status: PrayerLogStatus;
  rakats: number;
  rakatsBreakdown: string;
  preferredTime: string;
  importance: string;
  reference: string;
  icon: string;
  colorKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
}

const INITIAL_PRAYERS: PrayerItem[] = [
  {
    name: 'Fajr',
    time: '5:12 AM',
    status: 'Completed',
    rakats: 4,
    rakatsBreakdown: '2 Sunnah + 2 Fard',
    preferredTime: 'From dawn until sunrise.',
    importance: "Fajr is one of the most rewarding prayers and marks the beginning of a Muslim's day. It requires sacrifice to wake up, demonstrating strong faith.",
    reference: "Indeed, the recitation of dawn is ever witnessed.\n(Quran 17:78)",
    icon: 'weather-sunset-up',
    colorKey: 'fajr',
  },
  {
    name: 'Dhuhr',
    time: '12:45 PM',
    status: 'Completed',
    rakats: 12,
    rakatsBreakdown: '4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl',
    preferredTime: 'Just after the sun passes its zenith until mid-afternoon.',
    importance: "Dhuhr offers a spiritual break in the middle of a busy day, helping a believer reconnect with Allah amidst worldly distractions.",
    reference: "Establish prayer at the decline of the sun...\n(Quran 17:78)",
    icon: 'weather-sunny',
    colorKey: 'dhuhr',
  },
  {
    name: 'Asr',
    time: '4:15 PM',
    status: 'Completed',
    rakats: 8,
    rakatsBreakdown: '4 Sunnah + 4 Fard',
    preferredTime: 'From mid-afternoon until the sun begins to set.',
    importance: "The Asr prayer is specifically emphasized in the Quran as the 'middle prayer' and requires extra vigilance to maintain.",
    reference: "Maintain with care the [obligatory] prayers and [in particular] the middle prayer...\n(Quran 2:238)",
    icon: 'weather-partly-cloudy',
    colorKey: 'asr',
  },
  {
    name: 'Maghrib',
    time: '6:55 PM',
    status: 'Completed',
    rakats: 7,
    rakatsBreakdown: '3 Fard + 2 Sunnah + 2 Nafl',
    preferredTime: 'Immediately after sunset.',
    importance: "Maghrib marks the end of the fasting day and the beginning of the Islamic night. It is recommended to pray it promptly after sunset.",
    reference: "When the night approaches from here, and the day retreats from there, and the sun sets, then the fasting person breaks his fast.\n(Sahih al-Bukhari)",
    icon: 'weather-sunset-down',
    colorKey: 'maghrib',
  },
  {
    name: 'Isha',
    time: '8:18 PM',
    status: 'Unlogged',
    rakats: 17,
    rakatsBreakdown: '4 Sunnah + 4 Fard + 2 Sunnah + 3 Witr + 4 Nafl',
    preferredTime: 'From the disappearance of the evening twilight until midnight.',
    importance: "Isha is the final prayer of the day. Completing it in congregation brings immense reward and seals the day with remembrance.",
    reference: "Whoever offers Isha prayer in congregation, it is as if he spent half the night in worship.\n(Sahih Muslim)",
    icon: 'weather-night',
    colorKey: 'isha',
  },
];

export default function TrackingScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [prayers, setPrayers] = useState<PrayerItem[]>(INITIAL_PRAYERS);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshControl } = usePullToRefresh();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const completedCount = prayers.filter((p) => p.status === 'Completed').length;
  const totalCount = prayers.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  const togglePrayerStatus = (targetName: PrayerName) => {
    setPrayers((prev) =>
      prev.map((item) => {
        if (item.name !== targetName) {
          return item;
        }
        const nextStatus: PrayerLogStatus = item.status === 'Completed' ? 'Unlogged' : 'Completed';
        return { ...item, status: nextStatus };
      }),
    );
  };

  return (
    <>
      <ScreenContainer scrollable withPadding withGlassGradient refreshControl={refreshControl}>
      <GlassHeader title="Prayer Tracker" subtitle="Daily Spiritual Log" />

        {isLoading ? (
          <PrayerSkeleton />
        ) : (
          <View style={styles.content}>
            {/* Daily Progress Hero */}
            <GlassCard borderRadius={24} contentStyle={styles.heroCardContent}>
              <View style={styles.heroRow}>
                <ProgressRing
                  progress={completedCount / totalCount}
                  size={100}
                  strokeWidth={10}
                  valueText={`${completedCount}/${totalCount}`}
                  labelText="Prayers"
                />
                <View style={styles.heroInfo}>
                  <View style={styles.streakBadge}>
                    <AppIcon name="fire" size={18} variant="achievement" />
                    <Text
                      variant="labelLarge"
                      style={[styles.streakText, { color: theme.colors.tertiary }]}
                    >
                      14 Day Streak
                    </Text>
                  </View>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    {completionPercent === 100 ? 'Mashallah! All Done' : `${completionPercent}% Complete Today`}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                    Keep building your consistency one prayer at a time.
                  </Text>
                </View>
              </View>
            </GlassCard>

            <View style={styles.sectionHeaderRow}>
              <Text
                variant="titleSmall"
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                OBLIGATORY PRAYERS
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Tap to mark completed
              </Text>
            </View>

            {prayers.map((item) => {
              const isDone = item.status === 'Completed';
              const prayerAccentColor = theme.colors[item.colorKey] || theme.colors.primary;

              return (
                <GlassCard
                  key={item.name}
                  borderRadius={18}
                  onPress={() => togglePrayerStatus(item.name)}
                  style={[
                    styles.prayerCard,
                    { alignSelf: 'center', width: '92%' },
                    isDone && { borderColor: theme.colors.primary, borderWidth: 1.5 },
                  ]}
                  accessibilityLabel={`Toggle ${item.name} status`}
                  accessibilityHint={`Currently ${item.status}. Tap to switch.`}
                >
                  <View style={styles.prayerRow}>
                    <View
                      style={[
                        styles.iconBox,
                        {
                          backgroundColor: isDone ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <AppIcon
                        name={item.icon as any}
                        size={26}
                        color={isDone ? theme.colors.iconPrimary : prayerAccentColor}
                      />
                    </View>

                    <View style={styles.prayerInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                        <Text
                          variant="titleLarge"
                          style={[
                            styles.prayerName,
                            { color: theme.colors.onSurface, fontWeight: isDone ? '800' : '600' },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          {item.time}
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                        {item.rakatsBreakdown}
                      </Text>
                      <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700', marginTop: 2 }}>
                        Total: {item.rakats} Rakats
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', paddingVertical: 2 }}>
                      <Pressable onPress={() => setSelectedPrayer(item)} style={{ padding: 4, marginRight: -4, marginTop: -4 }}>
                        <AppIcon 
                          name="information-outline" 
                          size="md" 
                          variant="secondary" 
                        />
                      </Pressable>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isDone
                              ? theme.colors.primary
                              : theme.colors.surfaceVariant,
                            borderColor: isDone ? theme.colors.primary : theme.colors.outline,
                          },
                        ]}
                      >
                      <AppIcon
                        name={isDone ? 'check' : 'plus'}
                        size="sm"
                        color={isDone ? theme.colors.iconOnPrimary : theme.colors.iconSecondary}
                      />
                      <Text
                        variant="labelMedium"
                        style={[
                          styles.statusText,
                          {
                            color: isDone ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {isDone ? 'Done' : 'Log'}
                      </Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
              );
            })}
          </View>
        )}
      </ScreenContainer>

      <PrayerDetailsBottomSheet
        visible={!!selectedPrayer}
        onDismiss={() => setSelectedPrayer(null)}
        prayer={selectedPrayer}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  heroCardContent: {
    padding: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroInfo: {
    flex: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  streakText: {
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  prayerCard: {
    marginVertical: 4,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    letterSpacing: -0.3,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bullet: {
    marginHorizontal: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '700',
  },
});
