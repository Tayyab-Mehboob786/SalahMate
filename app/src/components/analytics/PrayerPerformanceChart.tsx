import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { spacing } from '@/theme';

interface PrayerPerformanceChartProps {
  data: { prayer: string; percentage: number }[];
}

const { width } = Dimensions.get('window');

export function PrayerPerformanceChart({ data }: PrayerPerformanceChartProps) {
  
  if (!data || data.length === 0) return null;

  const barData = data.map(item => ({
    value: item.percentage,
    label: item.prayer,
    frontColor: '#00E5FF',
    topLabelComponent: () => (
      <Text style={{ color: '#FFFFFF', fontSize: 11, marginBottom: 4, fontWeight: '600' }}>
        {item.percentage}%
      </Text>
    ),
  }));

  // Calculate dynamic spacing to center 5 bars across the card width
  const cardWidth = width - spacing.md * 2 - 40;
  const barWidth = 24;
  const totalBarWidth = barWidth * 5;
  const dynamicSpacing = (cardWidth - totalBarWidth) / 6;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Prayer Performance</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          width={cardWidth}
          height={160}
          barWidth={barWidth}
          spacing={dynamicSpacing}
          initialSpacing={dynamicSpacing}
          endSpacing={dynamicSpacing}
          roundedTop
          roundedBottom
          hideRules
          maxValue={100}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor="rgba(255,255,255,0.15)"
          hideYAxisText
          xAxisLabelTextStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', textAlign: 'center' }}
          disablePress
          isAnimated
          animationDuration={800}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  header: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingRight: 10,
    paddingLeft: 10,
  },
});
