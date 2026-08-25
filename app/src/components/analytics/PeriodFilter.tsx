import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing, type SalahMateTheme } from '@/theme';

interface PeriodFilterProps {
  period: '7d' | '30d' | '90d' | 'all';
  onPeriodChange: (period: '7d' | '30d' | '90d' | 'all') => void;
}

const PERIODS: { label: string; value: '7d' | '30d' | '90d' | 'all' }[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

export function PeriodFilter({ period, onPeriodChange }: PeriodFilterProps) {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        {PERIODS.map((p, index) => {
          const isActive = p.value === period;
          return (
            <React.Fragment key={p.value}>
              <Pressable
                onPress={() => onPeriodChange(p.value)}
                style={[
                  styles.tab,
                  isActive && styles.activeTab
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {p.label}
                </Text>
                {isActive && (
                  <View style={styles.activeGlowLine} />
                )}
              </Pressable>
              
              {/* Vertical divider between tabs, but not after the last one */}
              {index < PERIODS.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle glass back
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)', // Glowing cyan background tint
  },
  tabText: {
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeGlowLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  }
});
