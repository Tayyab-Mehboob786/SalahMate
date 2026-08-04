import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppIcon } from '@/components';
import type { SalahMateTheme } from '@/theme';
import type { PrayerHistoryItem } from '@/api/prayers.api';

interface PrayerStatusRowProps {
  statuses: PrayerHistoryItem['statuses'];
}

export function PrayerStatusRow({ statuses }: PrayerStatusRowProps) {
  const theme = useTheme<SalahMateTheme>();

  const prayers = [
    { key: 'FAJR', icon: 'weather-sunset-up' },
    { key: 'DHUHR', icon: 'weather-sunny' },
    { key: 'ASR', icon: 'weather-partly-cloudy' },
    { key: 'MAGHRIB', icon: 'weather-sunset-down' },
    { key: 'ISHA', icon: 'weather-night' },
  ] as const;

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'COMPLETED':
        return theme.colors.primary;
      case 'MISSED':
        return theme.colors.error;
      case 'QADA':
        return theme.colors.tertiary;
      default:
        return theme.colors.outlineVariant;
    }
  };

  return (
    <View style={styles.container}>
      {prayers.map((prayer) => {
        const status = statuses[prayer.key];
        const color = getStatusColor(status);
        return (
          <View key={prayer.key} style={styles.iconContainer}>
            <AppIcon name={prayer.icon as any} size={20} color={color} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
