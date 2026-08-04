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
    <View style={styles.container}>
      {PERIODS.map((p) => {
        const isActive = p.value === period;
        return (
          <Pressable
            key={p.value}
            onPress={() => onPeriodChange(p.value)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
                  fontWeight: isActive ? '700' : '600',
                },
              ]}
            >
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 13,
  },
});
