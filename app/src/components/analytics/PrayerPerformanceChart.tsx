import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, type SalahMateTheme } from '@/theme';

interface PrayerPerformanceChartProps {
  data: { prayer: string; percentage: number }[];
}

const { width } = Dimensions.get('window');

export function PrayerPerformanceChart({ data }: PrayerPerformanceChartProps) {
  const theme = useTheme<SalahMateTheme>();
  
  if (!data || data.length === 0) return null;

  // Format data for gifted-charts
  const barData = data.map(item => ({
    value: item.percentage,
    label: item.prayer,
    frontColor: getPrayerColor(item.prayer, theme),
    topLabelComponent: () => (
      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginBottom: 4 }}>
        {item.percentage}%
      </Text>
    ),
  }));

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
          Prayer Performance
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.xl, paddingLeft: spacing.sm }}
        >
          <BarChart
            data={barData}
            width={Math.max(width - spacing.md * 2 - 32, barData.length * 70)}
            height={180}
            barWidth={32}
            spacing={38}
            initialSpacing={16}
            endSpacing={16}
            roundedTop
            roundedBottom
            hideRules
            maxValue={100}
            noOfSections={5}
            yAxisLabelSuffix="%"
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.colors.onSurface, fontSize: 11, fontWeight: '600' }}
            disablePress
            isAnimated
            animationDuration={800}
          />
        </ScrollView>
      </View>
    </GlassCard>
  );
}

function getPrayerColor(prayer: string, theme: SalahMateTheme) {
  switch (prayer.toLowerCase()) {
    case 'fajr': return theme.colors.fajr || theme.colors.primary;
    case 'dhuhr': return theme.colors.dhuhr || '#F59E0B';
    case 'asr': return theme.colors.asr || '#3B82F6';
    case 'maghrib': return theme.colors.maghrib || '#F97316';
    case 'isha': return theme.colors.isha || '#6366F1';
    default: return theme.colors.primary;
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  chartContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
});
