import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '@/components/glass/GlassCard';
import { AppIcon } from '@/components/common/AppIcon';
import { StatusBadge, PrayerStatus } from './StatusBadge';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { SecondaryButton } from '@/components/common/SecondaryButton';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';
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
  const theme = useTheme<SalahMateTheme>();
  const isCompleted = status === 'Completed' || status === 'Qada';

  // Get accent color for the prayer icon based on the prayer name
  const getAccentColor = () => {
    switch (name.toLowerCase()) {
      case 'fajr':
        return theme.colors.fajr || theme.colors.primary;
      case 'dhuhr':
        return theme.colors.dhuhr || theme.colors.primary;
      case 'asr':
        return theme.colors.asr || theme.colors.primary;
      case 'maghrib':
        return theme.colors.maghrib || theme.colors.primary;
      case 'isha':
        return theme.colors.isha || theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  const getActionButtonConfig = () => {
    switch (status) {
      case 'Completed':
        return { label: 'Completed ✓', disabled: false, primary: true };
      case 'Pending':
        return { label: 'Mark as Prayed', disabled: false, primary: true };
      case 'Missed':
        return { label: 'Log Qada', disabled: false, primary: false };
      case 'Qada':
        return { label: 'Qada Logged ✓', disabled: false, primary: true };
      default:
        return { label: 'Mark as Prayed', disabled: false, primary: true };
    }
  };

  const getIconConfig = (): { bgColor: string; color: string } => {
    switch (status) {
      case 'Completed':
        return {
          bgColor: theme.colors.primaryContainer,
          color: theme.colors.onPrimaryContainer,
        };
      case 'Qada':
        return {
          bgColor: theme.colors.warningContainer || '#FFF3E0', // Fallback if warningContainer doesn't exist
          color: theme.colors.warning,
        };
      case 'Missed':
        return {
          bgColor: theme.colors.errorContainer,
          color: theme.colors.error,
        };
      case 'Pending':
      default:
        return {
          bgColor: theme.colors.surfaceVariant,
          color: getAccentColor(),
        };
    }
  };

  const btnConfig = getActionButtonConfig();
  const iconConfig = getIconConfig();

  // Handle Qada fallback for dark mode safely
  if (status === 'Qada' && theme.dark && !theme.colors.warningContainer) {
    iconConfig.bgColor = '#4E342E';
  }

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <GlassCard
        borderRadius={16}
        style={[
          styles.card,
          isCompleted && { borderColor: theme.colors.primary, borderWidth: 1.5 },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.leftCol}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: iconConfig.bgColor },
              ]}
            >
              <AppIcon
                name={icon as any}
                size={22}
                color={iconConfig.color}
              />
            </View>
            <View>
              <Text
                variant="titleMedium"
                style={[styles.name, { color: theme.colors.onSurface }]}
              >
                {name}
              </Text>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {time}
              </Text>
            </View>
          </View>
          
          <View style={styles.rightCol}>
            <StatusBadge status={status} style={styles.statusBadge} />
            <View style={styles.actionRow}>
              {btnConfig.primary ? (
                <PrimaryButton
                  label={btnConfig.label}
                  onPress={() => onActionPress(name, status)}
                  disabled={btnConfig.disabled}
                  style={styles.actionBtn}
                  contentStyle={styles.compactBtnContent}
                  labelStyle={styles.compactBtnLabel}
                />
              ) : (
                <SecondaryButton
                  label={btnConfig.label}
                  onPress={() => onActionPress(name, status)}
                  disabled={btnConfig.disabled}
                  style={styles.actionBtn}
                  contentStyle={styles.compactBtnContent}
                  labelStyle={styles.compactBtnLabel}
                />
              )}
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rightCol: {
    width: 130, // Fixed width for perfect alignment of badge and button
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 6,
  },
  statusBadge: {
    justifyContent: 'center',
    width: '100%',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontWeight: '800',
    letterSpacing: -0.3,
    fontSize: 15,
  },
  actionRow: {
    width: '100%',
  },
  actionBtn: {
    marginVertical: 0,
    width: '100%',
  },
  compactBtnContent: {
    minHeight: 36,
    height: 36,
    paddingHorizontal: 8,
  },
  compactBtnLabel: {
    fontSize: 12,
    marginVertical: 0,
    marginHorizontal: 0,
  },
});
