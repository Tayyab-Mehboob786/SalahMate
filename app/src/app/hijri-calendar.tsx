/**
 * SalahMate — Hijri Calendar Module (`/hijri-calendar`)
 *
 * Interactive lunar calendar placeholder displaying current Hijri date alongside
 * Gregorian alignment, full Islamic months navigation, highlighted current day,
 * and upcoming sacred events.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

const ISLAMIC_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi’ al-Awwal',
  'Rabi’ al-Thani',
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  'Sha’ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi’dah',
  'Dhu al-Hijjah',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HijriCalendarScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0); // Muharram

  // Simulated 30 days for Muharram 1448 AH
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const todayDate = 3; // 3 Muharram

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Hijri Calendar" subtitle="1448 AH · Lunar Islamic Dates" showBack />

      <View style={styles.content}>
        {/* Current Date Hero Banner */}
        <GlassCard borderRadius={24} contentStyle={styles.heroBanner}>
          <View style={styles.bannerHeader}>
            <View style={[styles.badge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <AppIcon name="calendar-star" size="sm" variant="primary" />
              <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                CURRENT ISLAMIC DATE
              </Text>
            </View>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              July 17, 2026 CE
            </Text>
          </View>

          <Text variant="headlineMedium" style={[styles.hijriTitle, { color: theme.colors.onSurface }]}>
            3 {ISLAMIC_MONTHS[selectedMonthIndex]} 1448 AH
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            Friday · Jumu&apos;ah Mubarak
          </Text>
        </GlassCard>

        {/* Islamic Months Horizontal Selector */}
        <View style={styles.monthSelector}>
          {ISLAMIC_MONTHS.slice(0, 6).map((month, index) => {
            const isSelected = selectedMonthIndex === index;
            return (
              <Pressable
                key={month}
                style={[
                  styles.monthChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedMonthIndex(index)}
              >
                <Text
                  variant="labelMedium"
                  style={{
                    color: isSelected ? theme.colors.textOnPrimary : theme.colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  }}
                >
                  {month}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Monthly Calendar Layout */}
        <GlassCard borderRadius={24} contentStyle={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {ISLAMIC_MONTHS[selectedMonthIndex]} 1448 AH
            </Text>
            <View style={styles.navIcons}>
              <AppIcon name="chevron-left" size="lg" variant="secondary" />
              <AppIcon name="chevron-right" size="lg" variant="secondary" />
            </View>
          </View>

          {/* Days of Week */}
          <View style={styles.weekHeader}>
            {WEEK_DAYS.map((day) => (
              <Text key={day} variant="labelMedium" style={[styles.weekDayText, { color: theme.colors.primary }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.grid}>
            {/* 3 placeholder empty slots for month start offset */}
            {[0, 1, 2].map((slot) => (
              <View key={`empty-${slot}`} style={styles.dayCell} />
            ))}
            {daysInMonth.map((day) => {
              const isToday = selectedMonthIndex === 0 && day === todayDate;
              return (
                <View
                  key={`day-${day}`}
                  style={[
                    styles.dayCell,
                    isToday && [styles.todayCell, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.shadow }],
                  ]}
                >
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: isToday ? theme.colors.textOnPrimary : theme.colors.textPrimary,
                      fontWeight: isToday ? '800' : '600',
                    }}
                  >
                    {day}
                  </Text>
                  {isToday ? <View style={[styles.dotIndicator, { backgroundColor: theme.colors.textOnPrimary }]} /> : null}
                </View>
              );
            })}
          </View>
        </GlassCard>

        {/* Upcoming Islamic Events Card */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          SACRED EVENTS IN {ISLAMIC_MONTHS[selectedMonthIndex].toUpperCase()}
        </Text>
        <GlassCard borderRadius={20} contentStyle={styles.eventsCard}>
          <View style={styles.eventRow}>
            <View style={[styles.eventDateBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <Text variant="titleMedium" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '800' }}>
                10
              </Text>
              <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874' }}>
                MUH
              </Text>
            </View>
            <View style={styles.eventDetails}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Day of Ashura
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Commemorating the liberation of Prophet Musa (AS) · Highly recommended fasting day.
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  heroBanner: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hijriTitle: {
    fontWeight: '800',
  },
  monthSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  calendarCard: {
    padding: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: '14.2%',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 14,
  },
  todayCell: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dotIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginLeft: spacing.xs,
  },
  eventsCard: {
    padding: spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  eventDateBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    flex: 1,
  },
});
