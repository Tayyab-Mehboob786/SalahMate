import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/theme';

interface WeeklyCompletionChartProps {
  weeklyCompletion: number;
}

export function WeeklyCompletionChart({ weeklyCompletion }: WeeklyCompletionChartProps) {
  
  if (weeklyCompletion === undefined || weeklyCompletion === null) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Weekly Consistency</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.barContainer}>
          <Text style={styles.dayText}>This Week</Text>
          
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${weeklyCompletion}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.percentageText}>{weeklyCompletion}%</Text>
        </View>
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
    padding: spacing.md,
    gap: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayText: {
    width: 65,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 4,
  },
  percentageText: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },
});
