import { AppIcon } from '@/components/common/AppIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { Goal } from '@/context/GoalsContext';


interface GoalProgressCardProps {
  goal: Goal;
  todaysTarget: number;
  onPress?: () => void;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, todaysTarget, onPress }) => {
  const theme = useTheme<SalahMateTheme>();

  const progressPercentage = goal.totalUnits > 0 
    ? Math.min(100, Math.round((goal.completedUnits / goal.totalUnits) * 100))
    : 0;

  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'Quran': return 'book-open-page-variant';
      case 'Prayer': return 'hands-pray';
      case 'Adhkar': return 'weather-sunset-up';
      case 'Learning': return 'school-outline';
      default: return 'flag-checkered';
    }
  };

  return (
    <GlassCard borderRadius={16} style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryContainer }]}>
            <AppIcon 
              name={getIconForCategory(goal.category) as any} 
              size={20} 
              color={theme.colors.primary} 
            />
          </View>
          <View>
            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              {goal.title}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {goal.category}
            </Text>
          </View>
        </View>
        {goal.isCompleted && (
          <AppIcon name="check-decagram" size={24} color={theme.colors.success} />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            {progressPercentage}%
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {goal.completedUnits} / {goal.totalUnits} {goal.unitLabel}
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                backgroundColor: goal.isCompleted ? theme.colors.success : theme.colors.primary,
                width: `${progressPercentage}%` 
              }
            ]} 
          />
        </View>
      </View>

      {/* Footer Info */}
      {!goal.isCompleted && (
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <View style={styles.footerItem}>
            <AppIcon name="calendar-clock" size={16} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
              Today's Target: {todaysTarget} {goal.unitLabel}
            </Text>
          </View>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
