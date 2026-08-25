import { AppIcon } from '@/components/common/AppIcon';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { spacing } from '@/theme';
import { Goal } from '@/context/GoalsContext';


interface GoalProgressCardProps {
  goal: Goal;
  todaysTarget: number;
  onPress?: () => void;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, todaysTarget, onPress }) => {
  const progressPercentage = goal.progress?.progressPercentage ?? (
    goal.totalUnits > 0 
      ? Math.min(100, Math.round((goal.completedUnits / goal.totalUnits) * 100))
      : 0
  );
  const completedUnits = goal.progress?.completedUnits ?? (goal.completedUnits || 0);
  const isCompleted = goal.progress?.isCompleted ?? goal.isCompleted;

  const getIconForCategory = (cat: string) => {
    switch (cat ? cat.toLowerCase() : '') {
      case 'quran': return 'book-open-page-variant';
      case 'prayer': return 'hands-pray';
      case 'adhkar': return 'weather-sunset-up';
      case 'learning': return 'school-outline';
      default: return 'flag-checkered';
    }
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [styles.cardWrapper, pressed && { opacity: 0.8 }]}>
      <BlurView intensity={25} tint="light" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <AppIcon 
                name={getIconForCategory(goal.category) as any} 
                size={20} 
                color="#FFFFFF" 
              />
            </View>
            <View>
              <Text variant="titleMedium" style={styles.title}>
                {goal.title}
              </Text>
              <Text variant="bodySmall" style={styles.categoryText}>
                {goal.category}
              </Text>
            </View>
          </View>
          {isCompleted && (
            <AppIcon name="check-decagram" size={24} color="#4ADE80" />
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text variant="bodyMedium" style={styles.progressPercent}>
              {progressPercentage}%
            </Text>
            <Text variant="bodySmall" style={styles.progressRatio}>
              {completedUnits} / {goal.totalUnits} {goal.unitLabel}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: isCompleted ? '#4ADE80' : '#FFFFFF',
                  width: `${progressPercentage}%` 
                }
              ]} 
            />
          </View>
        </View>

        {/* Footer Info */}
        {!isCompleted && (
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <AppIcon name="calendar-clock" size={16} color="#CBD5E1" />
              <Text variant="bodySmall" style={styles.footerText}>
                Today's Target: {todaysTarget} {goal.unitLabel}
              </Text>
            </View>
          </View>
        )}
      </BlurView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    padding: spacing.lg,
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryText: {
    color: '#E2E8F0',
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
  progressPercent: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressRatio: {
    color: '#CBD5E1',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#CBD5E1',
    marginLeft: 6,
  }
});
