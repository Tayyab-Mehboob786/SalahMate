import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

export type PrayerStatus = 'Completed' | 'Pending' | 'Missed' | 'Qada';

interface StatusBadgeProps {
  status: PrayerStatus;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'Completed':
        return {
          text: '✓ PRAYED',
          bgColor: '#DCFCE7', // Light green
          textColor: '#15803D', // Dark green
        };
      case 'Qada':
        return {
          text: '⏱ QAZA',
          bgColor: '#FEF3C7', // Light yellow / amber
          textColor: '#B45309', // Dark yellow / amber
        };
      case 'Missed':
        return {
          text: '✕ MISSED',
          bgColor: '#FEE2E2', // Light red
          textColor: '#B91C1C', // Dark red
        };
      case 'Pending':
        return {
          text: 'PENDING',
          bgColor: 'rgba(255, 255, 255, 0.2)',
          textColor: '#FFFFFF',
        };
      default:
        return {
          text: 'UNKNOWN',
          bgColor: '#E0E0E0',
          textColor: '#424242',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }, style]}>
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
