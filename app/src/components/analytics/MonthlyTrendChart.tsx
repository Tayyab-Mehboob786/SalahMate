import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { spacing } from '@/theme';

interface MonthlyTrendChartProps {
  data: { label: string; value: number }[];
}

const { width } = Dimensions.get('window');

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Completion Trend</Text>
      </View>
      
      <View style={styles.chartContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.xl, paddingLeft: spacing.sm }}
        >
          <LineChart
            data={data}
            width={Math.max(width - spacing.md * 2 - 32, data.length * 60)} 
            height={160}
            spacing={60}
            initialSpacing={20}
            endSpacing={40}
            color="#00E5FF"
            thickness={3}
            dataPointsColor="#00E5FF"
            dataPointsRadius={4}
            hideRules
            maxValue={100}
            noOfSections={5}
            yAxisLabelSuffix="%"
            yAxisTextStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            xAxisLabelTextStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            yAxisColor="rgba(255,255,255,0.3)"
            xAxisColor="rgba(255,255,255,0.3)"
            curved
            areaChart
            startFillColor="#00E5FF"
            startOpacity={0.4}
            endFillColor="#00E5FF"
            endOpacity={0.0}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'rgba(255,255,255,0.5)',
              pointerStripWidth: 2,
              pointerColor: '#00E5FF',
              radius: 6,
              pointerLabelWidth: 80,
              pointerLabelHeight: 30,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={styles.pointerLabel}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
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
    paddingTop: 10,
    paddingBottom: 16,
    alignItems: 'center',
  },
  pointerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
