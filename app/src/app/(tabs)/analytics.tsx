import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ScreenContainer, AppIcon } from '@/components';
import { useAnalytics } from '@/hooks/analytics/useAnalytics';
import { PeriodFilter } from '@/components/analytics/PeriodFilter';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { PrayerPerformanceChart } from '@/components/analytics/PrayerPerformanceChart';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { WeeklyCompletionChart } from '@/components/analytics/WeeklyCompletionChart';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';
import { usePullToRefresh } from '@/hooks';
import { spacing, type SalahMateTheme } from '@/theme';
import { useFocusEffect, useRouter } from 'expo-router';

export default function AnalyticsScreen() {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const { data, isLoading, isError, period, setPeriod, refetch } = useAnalytics();
  const { refreshControl } = usePullToRefresh(refetch);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <ScreenContainer 
      scrollable={false} 
      withGlassGradient
      backgroundImage={require('../../../assets/backgrounds/analytics-mosque.png')}
    >
      {/* Custom Header */}
      <View style={styles.headerWrapper}>
        <Pressable 
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace('/')}
        >
          <AppIcon name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Spiritual Analytics</Text>
          <Text style={styles.headerSubtitle}>Consistency & Performance</Text>
        </View>
        
        {/* Empty view to balance the flex layout and keep title centered */}
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <PeriodFilter period={period} onPeriodChange={setPeriod} />

        {isLoading || !data ? (
          <AnalyticsSkeleton />
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={{ color: theme.colors.error }}>Failed to load analytics data.</Text>
          </View>
        ) : (
          <>
            <SummaryCards 
              overallCompletion={data.overallCompletion}
              currentStreak={data.currentStreak}
              perfectDays={data.perfectDays}
            />

            <MonthlyTrendChart data={data.monthlyTrend} />
            
            <PrayerPerformanceChart data={data.prayerPerformance} />

            <WeeklyCompletionChart weeklyCompletion={data.weeklyCompletion} />
            
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnPlaceholder: {
    width: 44,
    height: 44,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    paddingVertical: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
    paddingTop: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});
