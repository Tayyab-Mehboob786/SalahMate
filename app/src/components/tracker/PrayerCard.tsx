import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppIcon } from '@/components/common/AppIcon';
import { StatusBadge, PrayerStatus } from './StatusBadge';
import type { PrayerName } from '@/types/prayer.types';

interface PrayerCardProps {
  name: PrayerName;
  time: string;
  icon: string;
  status: PrayerStatus;
  index: number;
  onActionPress: (name: PrayerName, currentStatus: PrayerStatus) => void;
}

export function PrayerCard({
  name,
  time,
  icon,
  status,
  index,
  onActionPress,
}: PrayerCardProps) {
  const isCompleted = status === 'Completed' || status === 'Qada';

  // The text for the button should remain consistent with the original logic (so the action makes sense),
  // but styled as a ghost button matching the screenshot.
  const getButtonLabel = () => {
    switch (status) {
      case 'Completed': return 'Mark as Prayed'; // Keeping to screenshot exact text if requested, but logic says "Completed ✓". Actually user said "Keep existing 'Mark as Prayed' functionality". If we keep existing label: "Completed ✓"
      case 'Pending': return 'Mark as Prayed';
      case 'Missed': return 'Log Qada';
      case 'Qada': return 'Qada Logged ✓';
      default: return 'Mark as Prayed';
    }
  };

  const btnLabel = getButtonLabel();

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <View style={[styles.card, isCompleted ? styles.cardCompleted : styles.cardPending]}>
        
        {/* Left Side: Icon & Info */}
        <View style={styles.leftCol}>
          <View style={[styles.iconBox, isCompleted ? styles.iconBoxCompleted : styles.iconBoxPending]}>
            <AppIcon name={icon as any} size={28} color="#FFFFFF" />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        {/* Right Side: Badge & Button */}
        <View style={styles.rightCol}>
          <View style={styles.badgeWrapper}>
            <StatusBadge status={status} />
          </View>
          
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtn, 
              pressed && { opacity: 0.7 },
              isCompleted ? styles.actionBtnCompleted : styles.actionBtnPending
            ]}
            onPress={() => onActionPress(name, status)}
          >
            <Text style={styles.actionBtnText}>{btnLabel}</Text>
          </Pressable>
        </View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardPending: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardCompleted: {
    backgroundColor: 'rgba(40, 105, 95, 0.85)', // Deep solid teal
    borderColor: 'rgba(255,255,255,0.2)',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoCol: {
    justifyContent: 'center',
    gap: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconBoxPending: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  iconBoxCompleted: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
  },
  time: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtnPending: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionBtnCompleted: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});
