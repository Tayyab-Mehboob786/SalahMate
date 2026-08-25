import { AppIcon } from '@/components/common/AppIcon';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { useGoals, Goal } from '@/context/GoalsContext';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export const DashboardGoalWidget: React.FC = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const { goals, activeGoal: ctxActiveGoal, getTodaysTarget, isLoading } = useGoals();

  const activeGoal = (ctxActiveGoal && ctxActiveGoal.lifecycleStatus === 'ACTIVE')
    ? ctxActiveGoal
    : goals.find(g => g.lifecycleStatus === 'ACTIVE');

  const navigateToGoals = () => {
    if (activeGoal) {
      router.push((`/goals/${activeGoal.id}`) as any);
    } else {
      router.push('/goals/create');
    }
  };

  if (isLoading && !activeGoal) {
    return null; // Or render quiet skeleton if appropriate
  }

  if (!activeGoal) {
    return (
      <GlassCard borderRadius={22} style={styles.card}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            🎯 My Current Goal
          </Text>
        </View>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
          You haven't created an Islamic Goal yet.
        </Text>
        <GlassButton 
          label="Create Goal" 
          variant="primary" 
          onPress={navigateToGoals}
        />
      </GlassCard>
    );
  }

  const progressPercentage = activeGoal.progress?.progressPercentage ?? (
    activeGoal.totalUnits > 0 
      ? Math.min(100, Math.round(((activeGoal.completedUnits || 0) / activeGoal.totalUnits) * 100))
      : 0
  );

  const start = new Date(activeGoal.startDate);
  const end = new Date(activeGoal.targetDate);
  const today = new Date();
  
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  const daysPassed = Math.max(0, Math.ceil((today.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  const daysRemaining = Math.max(0, totalDays - daysPassed);

  const todaysTarget = getTodaysTarget(activeGoal);

  // Status calculation logic
  const expectedProgress = Math.min(100, (daysPassed / totalDays) * 100);
  const isOnTrack = progressPercentage >= expectedProgress;
  const statusText = isOnTrack ? 'On Track ✅' : 'Needs Focus ⚠️';
  const statusColor = isOnTrack ? theme.colors.success : theme.colors.error;

  return (
    <GlassCard borderRadius={22} style={styles.card} onPress={navigateToGoals}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          🎯 My Current Goal
        </Text>
      </View>

      <Text variant="bodyLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
        {activeGoal.title}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.sm }}>
        Day {Math.min(daysPassed + 1, totalDays)} of {totalDays}
      </Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { backgroundColor: theme.colors.primary, width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text variant="labelSmall" style={{ color: theme.colors.primary, marginLeft: spacing.sm, fontWeight: '700' }}>
          {progressPercentage}%
        </Text>
      </View>

      <View style={[styles.metricsContainer, { borderTopColor: theme.colors.border }]}>
        <View style={styles.metricItem}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Today's Target</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            {todaysTarget > 0 ? `Complete ${todaysTarget} ${activeGoal.unitLabel}` : 'Done!'}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Remaining</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            {daysRemaining} Days
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Status</Text>
          <Text variant="bodySmall" style={{ color: statusColor, fontWeight: '600' }}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.footerAction}>
        <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          View Details 
        </Text>
        <AppIcon name="arrow-right" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  metricItem: {
    flex: 1,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  }
});
