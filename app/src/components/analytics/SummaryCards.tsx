import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { spacing } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface SummaryCardsProps {
  overallCompletion: number;
  currentStreak: number;
  perfectDays: number;
}

export function SummaryCards({ overallCompletion, currentStreak, perfectDays }: SummaryCardsProps) {
  
  return (
    <View style={styles.container}>
      {/* Completion Card */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardInner}>
          <View style={[styles.iconWrapper, { shadowColor: '#FF3B30' }]}>
            <Text style={styles.icon}>🎯</Text>
            <View style={[styles.iconGlow, { backgroundColor: '#FF3B30' }]} />
          </View>
          <Text style={styles.valueText}>{overallCompletion}%</Text>
          <Text style={styles.labelText}>completion</Text>
        </View>
        <LinearGradient 
          colors={['transparent', 'rgba(0, 229, 255, 0.5)']} 
          style={styles.cardBottomGlow} 
        />
        <View style={styles.cardBottomLine} />
      </View>

      {/* Streak Card */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardInner}>
          <View style={[styles.iconWrapper, { shadowColor: '#FF9500' }]}>
            <Text style={styles.icon}>🔥</Text>
            <View style={[styles.iconGlow, { backgroundColor: '#FF9500' }]} />
          </View>
          <Text style={styles.valueText}>{currentStreak} Days</Text>
          <Text style={styles.labelText}>streak</Text>
        </View>
        <LinearGradient 
          colors={['transparent', 'rgba(0, 229, 255, 0.5)']} 
          style={styles.cardBottomGlow} 
        />
        <View style={styles.cardBottomLine} />
      </View>

      {/* Perfect Card */}
      <View style={styles.cardWrapper}>
        <View style={styles.cardInner}>
          <View style={[styles.iconWrapper, { shadowColor: '#FFCC00' }]}>
            <Text style={styles.icon}>✨</Text>
            <View style={[styles.iconGlow, { backgroundColor: '#FFCC00' }]} />
          </View>
          <Text style={styles.valueText}>{perfectDays} Days</Text>
          <Text style={styles.labelText}>perfect</Text>
        </View>
        <LinearGradient 
          colors={['transparent', 'rgba(0, 229, 255, 0.5)']} 
          style={styles.cardBottomGlow} 
        />
        <View style={styles.cardBottomLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    height: 120,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    zIndex: 2,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  icon: {
    fontSize: 24,
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
    zIndex: 1,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  labelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  cardBottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 1,
  },
  cardBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    zIndex: 3,
  }
});
