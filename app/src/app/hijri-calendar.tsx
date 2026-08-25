import React, { useMemo, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AppIcon, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { useHijriCalendar } from '@/hooks/hijri/useHijriCalendar';
import { BlurView } from 'expo-blur';

const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', 'Rabi’ al-Awwal', 'Rabi’ al-Thani',
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha’ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi’dah', 'Dhu al-Hijjah',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HijriCalendarScreen() {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const { monthData, loading, error, currentHijriMonth, currentHijriYear, todayHijriStr, nextMonth, prevMonth, setMonth } = useHijriCalendar();

  const scrollViewRef = useRef<ScrollView>(null);

  const firstDayOffset = useMemo(() => {
    if (!monthData || monthData.length === 0) return 0;
    const firstDay = monthData[0].gregorian.weekday.en.toLowerCase();
    const map: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
    };
    return map[firstDay] || 0;
  }, [monthData]);

  const monthName = currentHijriMonth ? ISLAMIC_MONTHS[currentHijriMonth - 1] : ISLAMIC_MONTHS[0];
  const yearStr = currentHijriYear ? `${currentHijriYear} AH` : '1448 AH';

  const todayObj = monthData.find(d => d.hijri.date === todayHijriStr);
  const displayGregorian = todayObj ? `${todayObj.gregorian.weekday.en}, ${todayObj.gregorian.day} ${todayObj.gregorian.month.en} ${todayObj.gregorian.year} CE` : '';
  const displayHijri = todayObj ? `${parseInt(todayObj.hijri.day, 10)} ${todayObj.hijri.month.en}` : '';

  useEffect(() => {
    // Scroll to the active month chip
    if (currentHijriMonth && scrollViewRef.current) {
      // Rough estimation of scroll position to center the active pill
      const pillWidth = 100; // approximate
      const screenWidth = Dimensions.get('window').width;
      const x = (currentHijriMonth - 1) * pillWidth - (screenWidth / 2) + (pillWidth / 2);
      scrollViewRef.current.scrollTo({ x: Math.max(0, x), animated: true });
    }
  }, [currentHijriMonth]);

  return (
    <ScreenContainer 
      scrollable={true} 
      backgroundImage={require('../../assets/backgrounds/hijri-mosque.png')} 
      withGlassGradient={false}
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Atmospheric Overlay */}
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <AppIcon name="arrow-left" size={28} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text variant="titleLarge" style={styles.headerTitle}>Hijri Calendar</Text>
          <Text variant="labelMedium" style={styles.headerSubtitle}>{yearStr} • Lunar Islamic Dates</Text>
        </View>
        <View style={styles.iconBtn}>
          <AppIcon name="calendar-month-outline" size={26} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        {/* Current Date Card */}
        <BlurView intensity={20} tint="dark" style={styles.glassCard}>
          <Text variant="labelSmall" style={styles.cardSuperTitle}>CURRENT ISLAMIC DATE</Text>
          <Text style={styles.mainHijriDate}>{displayHijri || `${monthName}`}</Text>
          <Text variant="titleMedium" style={styles.goldYear}>{yearStr}</Text>
          <View style={styles.gregorianRow}>
            <AppIcon name="calendar-blank-outline" size={16} color="#A0A0A0" />
            <Text variant="bodySmall" style={styles.gregorianText}>{displayGregorian || 'Loading...'}</Text>
          </View>
        </BlurView>

        {/* Month Selector */}
        <View style={styles.monthSelectorContainer}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthSelectorScroll}
          >
            {ISLAMIC_MONTHS.map((month, index) => {
              const monthNum = index + 1;
              const isSelected = currentHijriMonth === monthNum;
              return (
                <Pressable
                  key={month}
                  onPress={() => setMonth(monthNum)}
                  style={[styles.monthPill, isSelected && styles.monthPillSelected]}
                >
                  <Text style={[styles.monthPillText, isSelected && styles.monthPillTextSelected]}>
                    {month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Calendar Grid Card */}
        <BlurView intensity={20} tint="dark" style={[styles.glassCard, styles.calendarCard]}>
          <View style={styles.calendarHeader}>
            <Pressable onPress={prevMonth} style={styles.iconBtnSmall}>
              <AppIcon name="chevron-left" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.calendarMonthTitle}>
              {monthName}{'\n'}
              <Text style={{ fontSize: 16 }}>{yearStr}</Text>
            </Text>
            <Pressable onPress={nextMonth} style={styles.iconBtnSmall}>
              <AppIcon name="chevron-right" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.weekHeader}>
            {WEEK_DAYS.map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E6B967" />
            </View>
          ) : (
            <View style={styles.grid}>
              {Array.from({ length: firstDayOffset }).map((_, slot) => (
                <View key={`empty-${slot}`} style={styles.dayCell} />
              ))}
              
              {monthData.map(dayData => {
                const day = parseInt(dayData.hijri.day, 10);
                const isToday = dayData.hijri.date === todayHijriStr;
                const hasEvent = dayData.hijri.holidays.length > 0;

                return (
                  <View key={`day-${dayData.hijri.date}`} style={styles.dayCell}>
                    <View style={[styles.dayCircle, isToday && styles.todayCircle]}>
                      <Text style={[
                        styles.dayText, 
                        isToday && styles.todayText,
                        !isToday && hasEvent && styles.eventText
                      ]}>
                        {day}
                      </Text>
                    </View>
                    {hasEvent && <View style={[styles.eventDot, isToday && styles.eventDotToday]} />}
                  </View>
                );
              })}
            </View>
          )}
        </BlurView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 20, 15, 0.70)', // Subtle atmospheric dark overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#E6B967',
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  glassCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  cardSuperTitle: {
    color: '#E6B967',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  mainHijriDate: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 8,
  },
  goldYear: {
    color: '#E6B967',
    fontWeight: '700',
    marginBottom: 16,
  },
  gregorianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gregorianText: {
    color: '#A0A0A0',
  },
  
  monthSelectorContainer: {
    marginHorizontal: -20,
  },
  monthSelectorScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  monthPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  monthPillSelected: {
    backgroundColor: 'rgba(4, 120, 87, 0.25)',
    borderColor: '#059669',
  },
  monthPillText: {
    color: '#A0A0A0',
    fontSize: 15,
    fontWeight: '500',
  },
  monthPillTextSelected: {
    color: '#E6B967',
    fontWeight: '700',
  },

  calendarCard: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  iconBtnSmall: {
    width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
  },
  calendarMonthTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  weekHeader: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#D4D4D4',
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: '14.28%',
    height: 48,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 8, // slight squircle matching the Stitch UI
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: '#059669',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventText: {
    color: '#E6B967',
    fontWeight: '700',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6B967',
    marginTop: 3,
  },
  eventDotToday: {
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
