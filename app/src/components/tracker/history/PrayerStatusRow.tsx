import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import type { PrayerHistoryItem } from '@/api/prayers.api';

interface PrayerStatusRowProps {
  statuses: PrayerHistoryItem['statuses'];
}

export function PrayerStatusRow({ statuses }: PrayerStatusRowProps) {
  const prayers = [
    { key: 'FAJR', icon: 'weather-sunset-up' },
    { key: 'DHUHR', icon: 'weather-sunny' },
    { key: 'ASR', icon: 'weather-partly-cloudy' },
    { key: 'MAGHRIB', icon: 'weather-sunset-down' },
    { key: 'ISHA', icon: 'weather-night' },
  ] as const;

  const getStatusIconInfo = (status: string | null) => {
    switch (status) {
      case 'COMPLETED':
        return { color: '#2ECC71', icon: 'check-circle', label: 'Prayed' };
      case 'MISSED':
        return { color: '#E74C3C', icon: 'close-circle', label: 'Missed' };
      case 'QADA':
        return { color: '#F1C40F', icon: 'clock-outline', label: 'Qaza' };
      default:
        return { color: 'rgba(255,255,255,0.3)', icon: 'circle-outline', label: '--' };
    }
  };

  return (
    <View style={styles.container}>
      {prayers.map((prayer) => {
        const status = statuses[prayer.key];
        const { color, icon } = getStatusIconInfo(status);
        return (
          <View key={prayer.key} style={styles.iconContainer}>
            <AppIcon name={prayer.icon as any} size={18} color="rgba(255,255,255,0.8)" style={{ marginBottom: 4 }} />
            <AppIcon name={icon as any} size={16} color={color} />
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
