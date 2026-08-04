import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ScreenContainer, GlassHeader } from '@/components';
import { useAnalytics } from '@/hooks/analytics/useAnalytics';
import { PeriodFilter } from '@/components/analytics/PeriodFilter';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { PrayerPerformanceChart } from '@/components/analytics/PrayerPerformanceChart';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { WeeklyCompletionChart } from '@/components/analytics/WeeklyCompletionChart';
import { AnalyticsSkeleton } from '@/components/analytics/AnalyticsSkeleton';
import { usePullToRefresh } from '@/hooks';
import { spacing, type SalahMateTheme } from '@/theme';
import { useFocusEffect } from 'expo-router';

export default function AnalyticsScreen() {
  const theme = useTheme<SalahMateTheme>();
  const { data, isLoading, isError, period, setPeriod, refetch } = useAnalytics();
  const { refreshControl } = usePullToRefresh(refetch);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <ScreenContainer scrollable={false} withGlassGradient>
      <GlassHeader title="Spiritual Analytics" subtitle="Consistency & Performance" />

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
