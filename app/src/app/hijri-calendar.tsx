/**
 * SalahMate — Hijri Calendar Module (`/hijri-calendar`)
 *
 * Interactive lunar calendar placeholder displaying current Hijri date alongside
 * Gregorian alignment, full Islamic months navigation, highlighted current day,
 * and upcoming sacred events.
 */

import React, { useState, useMemo } from 'react';
import { Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { useHijriCalendar } from '@/hooks/hijri/useHijriCalendar';

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
  const { monthData, loading, error, currentHijriMonth, currentHijriYear, todayHijriStr, nextMonth, prevMonth } = useHijriCalendar();

  // Selected month in the horizontal selector
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  // Sync horizontal selector with currentHijriMonth
  const activeMonthIndex = selectedMonthIndex !== null ? selectedMonthIndex : (currentHijriMonth ? currentHijriMonth - 1 : 0);

  // If user taps horizontal selector, we might want to fetch that month, 
  // but for now, we rely on Next/Prev month buttons or we can implement it.
  // Since the hook uses currentHijriMonth, let's keep horizontal selector as display only or navigate.

  const firstDayOffset = useMemo(() => {
    if (!monthData || monthData.length === 0) return 0;
    const firstDay = monthData[0].gregorian.weekday.en.toLowerCase();
    const map: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
    };
    return map[firstDay] || 0;
  }, [monthData]);

  const monthName = currentHijriMonth ? ISLAMIC_MONTHS[currentHijriMonth - 1] : ISLAMIC_MONTHS[0];
  const yearStr = currentHijriYear ? `${currentHijriYear} AH` : '1446 AH';

  // Find today in monthData
  const todayObj = monthData.find(d => d.hijri.date === todayHijriStr);
  const displayGregorian = todayObj ? `${todayObj.gregorian.day} ${todayObj.gregorian.month.en} ${todayObj.gregorian.year} CE` : '';
  const displayHijri = todayObj ? `${parseInt(todayObj.hijri.day, 10)} ${todayObj.hijri.month.en} ${todayObj.hijri.year} AH` : '';
  const displayWeekday = todayObj ? `${todayObj.gregorian.weekday.en}` : '';

  // Get all holidays in this month
  const events = monthData.filter(d => d.hijri.holidays.length > 0);

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
              {displayGregorian || 'Loading...'}
            </Text>
          </View>

          <Text variant="headlineMedium" style={[styles.hijriTitle, { color: theme.colors.onSurface }]}>
            {displayHijri || `${monthName} ${yearStr}`}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            {displayWeekday || 'Today'}
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

        <GlassCard borderRadius={24} contentStyle={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {monthName} {yearStr}
            </Text>
            <View style={styles.navIcons}>
              <Pressable onPress={prevMonth} style={{ padding: 4 }}>
                <AppIcon name="chevron-left" size="lg" variant="secondary" />
              </Pressable>
              <Pressable onPress={nextMonth} style={{ padding: 4 }}>
                <AppIcon name="chevron-right" size="lg" variant="secondary" />
              </Pressable>
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
          {loading ? (
            <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <View style={styles.grid}>
              {/* Empty slots for month start offset */}
              {Array.from({ length: firstDayOffset }).map((_, slot) => (
                <View key={`empty-${slot}`} style={styles.dayCell} />
              ))}
              {monthData.map((dayData) => {
                const day = parseInt(dayData.hijri.day, 10);
                const isToday = dayData.hijri.date === todayHijriStr;
                const hasEvent = dayData.hijri.holidays.length > 0;

                return (
                  <View
                    key={`day-${dayData.hijri.date}`}
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
                    {isToday ? <View style={[styles.dotIndicator, { backgroundColor: theme.colors.textOnPrimary }]} /> : 
                     hasEvent ? <View style={[styles.dotIndicator, { backgroundColor: theme.colors.error }]} /> : null}
                  </View>
                );
              })}
            </View>
          )}
        </GlassCard>

        {/* Upcoming Islamic Events Card */}
        {events.length > 0 && (
          <>
            <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              SACRED EVENTS IN {monthName.toUpperCase()}
            </Text>
            {events.map((evt) => (
              <GlassCard key={evt.hijri.date} borderRadius={20} contentStyle={styles.eventsCard}>
                <View style={styles.eventRow}>
                  <View style={[styles.eventDateBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
                    <Text variant="titleMedium" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '800' }}>
                      {parseInt(evt.hijri.day, 10)}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874' }}>
                      {evt.hijri.month.en.substring(0, 3).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                      {evt.hijri.holidays.join(', ')}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {evt.gregorian.day} {evt.gregorian.month.en} {evt.gregorian.year}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </>
        )}
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
