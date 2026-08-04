import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, type SalahMateTheme } from '@/theme';

interface WeeklyCompletionChartProps {
  weeklyCompletion: number;
}

const { width } = Dimensions.get('window');

export function WeeklyCompletionChart({ weeklyCompletion }: WeeklyCompletionChartProps) {
  const theme = useTheme<SalahMateTheme>();

  // A simple donut/pie chart would be better, but user requested a Bar Chart.
  // We can show a single bar for "This Week" vs a target of 100%.
  
  const barData = [
    {
      value: weeklyCompletion,
      label: 'Current',
      frontColor: theme.colors.primary,
      topLabelComponent: () => (
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginBottom: 4 }}>
          {weeklyCompletion}%
        </Text>
      ),
    },
    {
      value: 100,
      label: 'Target',
      frontColor: theme.colors.surfaceVariant,
      topLabelComponent: () => (
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginBottom: 4 }}>
          100%
        </Text>
      ),
    }
  ];

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
          Weekly Consistency
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          width={200}
          height={160}
          barWidth={40}
          spacing={40}
          roundedTop
          roundedBottom
          hideRules
          maxValue={100}
          noOfSections={5}
          yAxisLabelSuffix="%"
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.colors.onSurface, fontSize: 12, fontWeight: '600' }}
          disablePress
          isAnimated
        />
      </View>
    </GlassCard>
  );
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
    justifyContent: 'center',
  },
});
