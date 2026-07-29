/**
 * SalahMate — Sacred Islamic Events Module (`/islamic-events`)
 *
 * Chronological spiritual timeline highlighting major Islamic milestones and sacred
 * occasions across the lunar Hijri year, featuring countdowns and observances for
 * Ramadan, Eid-ul-Fitr, Eid-ul-Adha, Ashura, Mawlid, and the Islamic New Year.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface IslamicEvent {
  id: string;
  name: string;
  hijriDate: string;
  gregorianDate: string;
  countdownDays: number;
  icon: string;
  description: string;
  significance: string;
}

const EVENTS_TIMELINE: IslamicEvent[] = [
  {
    id: 'e-ashura',
    name: 'Day of Ashura',
    hijriDate: '10 Muharram 1448 AH',
    gregorianDate: 'July 24, 2026',
    countdownDays: 7,
    icon: 'calendar-star',
    description: 'The 10th day of Muharram commemorating the divine salvation of Prophet Musa (AS) across the Red Sea.',
    significance: 'Fasting on this day expiates the minor sins of the preceding year (Sahih Muslim).',
  },
  {
    id: 'e-mawlid',
    name: 'Mawlid an-Nabi',
    hijriDate: '12 Rabi’ al-Awwal 1448 AH',
    gregorianDate: 'September 23, 2026',
    countdownDays: 68,
    icon: 'star-crescent',
    description: 'Reflecting upon the birth, blessed life, and character of Prophet Muhammad (ﷺ).',
    significance: 'Increase Salawat (blessings upon the Prophet) and study the Seerah.',
  },
  {
    id: 'e-ramadan',
    name: 'Beginning of Ramadan',
    hijriDate: '1 Ramadan 1448 AH',
    gregorianDate: 'February 8, 2027',
    countdownDays: 206,
    icon: 'moon-waning-crescent',
    description: 'The most sacred month of the Islamic year dedicated to fasting, Quranic recitation, and night prayers (Taraweeh).',
    significance: 'The gates of Jannah are opened, and the night of Laylat al-Qadr is sought within the last ten nights.',
  },
  {
    id: 'e-fitr',
    name: 'Eid-ul-Fitr',
    hijriDate: '1 Shawwal 1448 AH',
    gregorianDate: 'March 10, 2027',
    countdownDays: 236,
    icon: 'gift-outline',
    description: 'The joyous festival of breaking the fast marking the successful completion of Ramadan.',
    significance: 'Mandatory Zakat al-Fitr before Eid prayer, community gathering, and expressing gratitude.',
  },
  {
    id: 'e-adha',
    name: 'Eid-ul-Adha & Hajj',
    hijriDate: '10 Dhu al-Hijjah 1448 AH',
    gregorianDate: 'May 17, 2027',
    countdownDays: 304,
    icon: 'sheep',
    description: 'The festival of sacrifice honoring the devotion of Prophet Ibrahim (AS) during the annual Hajj pilgrimage.',
    significance: 'Qurbani sacrifice, distributing meat to the needy, and Takbeerat al-Tashreeq.',
  },
  {
    id: 'e-newyear',
    name: 'Islamic New Year (1449 AH)',
    hijriDate: '1 Muharram 1449 AH',
    gregorianDate: 'June 6, 2027',
    countdownDays: 324,
    icon: 'calendar-month',
    description: 'Marking the beginning of the new Hijri calendar year and commemorating the Hijrah from Mecca to Medina.',
    significance: 'A time for self-reflection, renewing intentions, and setting spiritual goals for the coming year.',
  },
];

export default function IslamicEventsScreen() {
  const theme = useTheme<SalahMateTheme>();

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Sacred Events" subtitle="Hijri Timeline & Milestones" showBack />

      <View style={styles.content}>
        {/* Next Major Event Hero Card */}
        <GlassCard borderRadius={24} contentStyle={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.badge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <AppIcon name="clock-fast" size="sm" variant="primary" />
              <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                UPCOMING IN 7 DAYS
              </Text>
            </View>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              10 Muharram
            </Text>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.heroText}>
              <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                Day of Ashura
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                July 24, 2026 · Recommended fasting day
              </Text>
            </View>
            <View style={[styles.countdownBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <Text variant="headlineSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '800' }}>
                7
              </Text>
              <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                DAYS
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Sacred Timeline Header */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          1448 AH SACRED TIMELINE
        </Text>

        {/* Timeline List */}
        <View style={styles.timelineList}>
          {EVENTS_TIMELINE.map((evt, idx) => (
            <GlassCard key={evt.id} borderRadius={22} contentStyle={styles.eventCard}>
              <View style={styles.eventTop}>
                <View style={styles.iconAndTitle}>
                  <View style={[styles.iconBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
                    <AppIcon name={evt.icon as any} size="lg" variant="primary" />
                  </View>
                  <View>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                      {evt.name}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      {evt.hijriDate} ({evt.gregorianDate})
                    </Text>
                  </View>
                </View>
                <View style={[styles.daysChip, { backgroundColor: theme.colors.surface }]}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700' }}>
                    {evt.countdownDays}d left
                  </Text>
                </View>
              </View>

              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 18, marginVertical: 8 }}>
                {evt.description}
              </Text>

              <View style={[styles.significanceBox, { backgroundColor: theme.colors.surface }]}>
                <AppIcon name="star-four-points-outline" size="sm" variant="primary" />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurface, flex: 1, fontWeight: '600' }}>
                  {evt.significance}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  heroCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  countdownBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginLeft: spacing.xs,
  },
  timelineList: {
    gap: spacing.md,
  },
  eventCard: {
    padding: spacing.md,
  },
  eventTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(150, 150, 150, 0.2)',
  },
  significanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 12,
  },
});
