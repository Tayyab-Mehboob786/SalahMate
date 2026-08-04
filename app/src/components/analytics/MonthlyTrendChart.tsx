import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, type SalahMateTheme } from '@/theme';

interface MonthlyTrendChartProps {
  data: { label: string; value: number }[];
}

const { width } = Dimensions.get('window');

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const theme = useTheme<SalahMateTheme>();
  
  if (!data || data.length === 0) return null;

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
          Completion Trend
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.xl, paddingLeft: spacing.sm }}
        >
          <LineChart
            data={data}
            width={Math.max(width - spacing.md * 2 - 32, data.length * 60)} // Ensure minimum comfortable spacing per point
            height={180}
            spacing={60}
            initialSpacing={20}
            endSpacing={40}
            color={theme.colors.primary}
            thickness={3}
            dataPointsColor={theme.colors.primary}
            dataPointsRadius={4}
            hideRules
            maxValue={100}
            noOfSections={5}
            yAxisLabelSuffix="%"
            yAxisTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
            yAxisColor={theme.colors.outlineVariant}
            xAxisColor={theme.colors.outlineVariant}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: theme.colors.onSurfaceVariant,
              pointerStripWidth: 2,
              pointerColor: theme.colors.primary,
              radius: 6,
              pointerLabelWidth: 80,
              pointerLabelHeight: 30,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={[styles.pointerLabel, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text style={{ color: theme.colors.onSurface, fontSize: 12, fontWeight: '700' }}>
                      {items[0].value}%
                    </Text>
                  </View>
                );
              },
            }}
            isAnimated
            animateOnDataChange
            animationDuration={1000}
          />
        </ScrollView>
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
  },
  pointerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
