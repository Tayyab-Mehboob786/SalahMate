import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import type { SalahMateTheme } from '@/theme';

export interface TimelinePrayerItem {
  name: string;
  time: string;
  status: 'completed' | 'current' | 'pending' | 'missed' | 'qada';
}

interface PrayerTimelineProps {
  prayers: TimelinePrayerItem[];
}

export const PrayerTimeline: React.FC<PrayerTimelineProps> = ({ prayers }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      {prayers.map((prayer, index) => {
        const isCompleted = prayer.status === 'completed';
        const isQada = prayer.status === 'qada';
        const isMissed = prayer.status === 'missed';
        const isCurrent = prayer.status === 'current';
        
        return (
          <View key={prayer.name} style={styles.itemWrapper}>
            {/* Left Connector (for all except first) */}
            {index > 0 && <View style={styles.leftConnector} />}
            
            {/* Right Connector (for all except last) */}
            {index < prayers.length - 1 && <View style={styles.rightConnector} />}

            {/* The Item */}
            <View style={styles.itemContainer}>
              <View
                style={[
                  styles.iconBox,
                  isCurrent && styles.iconBoxCurrent,
                  isCompleted && styles.iconBoxCompleted,
                  isQada && styles.iconBoxQada,
                  isMissed && styles.iconBoxMissed,
                  !isCurrent && !isCompleted && !isQada && !isMissed && styles.iconBoxPending,
                ]}
              >
                {isCompleted ? (
                  <AppIcon name="check" size={20} color="#FFF" />
                ) : isQada ? (
                  <AppIcon name="clock-outline" size={20} color="#FFF" />
                ) : isMissed ? (
                  <AppIcon name="close" size={20} color="#FFF" />
                ) : isCurrent ? (
                  <AppIcon name="mosque" size={24} color="#2ECC71" />
                ) : (
                  <AppIcon name="mosque" size={20} color="rgba(255,255,255,0.7)" />
                )}
              </View>
              <Text 
                style={[
                  styles.nameText,
                  isCurrent && { fontWeight: '800', color: '#FFF' },
                  (isCompleted || isQada || isMissed) && { color: '#FFF' }
                ]}
              >
                {prayer.name}
              </Text>
              <Text 
                style={[
                  styles.timeText,
                  isCurrent && { color: '#FFF', fontWeight: '700' },
                  isMissed && { color: '#F87171' },
                  isQada && { color: '#FBBF24' },
                ]}
              >
                {isCurrent ? 'Current' : isMissed ? 'Missed' : isQada ? 'Qaza' : prayer.status === 'pending' ? 'Pending' : prayer.time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  leftConnector: {
    position: 'absolute',
    left: 0,
    right: '50%',
    top: 24, 
    height: 1,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    zIndex: 1,
  },
  rightConnector: {
    position: 'absolute',
    left: '50%',
    right: 0,
    top: 24, 
    height: 1,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    zIndex: 1,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4, 
  },
  iconBoxCompleted: {
    backgroundColor: '#10B981', // Green Tick
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconBoxQada: {
    backgroundColor: '#F59E0B', // Amber/Yellow Clock
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconBoxMissed: {
    backgroundColor: '#EF4444', // Red Cross
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconBoxCurrent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2ECC71',
    width: 48,
    height: 48,
    marginTop: 0, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconBoxPending: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
});
