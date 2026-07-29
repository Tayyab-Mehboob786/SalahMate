import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenContainer, GlassHeader, GlassButton, GoalSkeleton } from '@/components';
import { GoalProgressCard } from '@/components/goals/GoalProgressCard';
import { useGoals } from '@/context/GoalsContext';
import { usePullToRefresh } from '@/hooks';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function GoalsDashboard() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { goals, getTodaysTarget } = useGoals();
  const [isLoading, setIsLoading] = useState(true);
  const { refreshControl } = usePullToRefresh();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <ScreenContainer withGlassGradient>
      <GlassHeader 
        title="Islamic Goals" 
        subtitle="Track your spiritual journey"
        showBack
        rightSlot={
          <MaterialCommunityIcons 
            name="plus-circle" 
            size={24} 
            color={theme.colors.primary} 
            onPress={() => router.push('/goals/create')}
          />
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {isLoading ? (
          <GoalSkeleton />
        ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="flag-checkered" 
              size={64} 
              color={theme.colors.surfaceVariant} 
              style={{ marginBottom: spacing.md }}
            />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', textAlign: 'center' }}>
              No Goals Yet
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }}>
              Start your journey by setting a meaningful Islamic goal for yourself.
            </Text>
            <GlassButton 
              label="Create Your First Goal"
              onPress={() => router.push('/goals/create')}
            />
          </View>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                  ACTIVE GOALS
                </Text>
                {activeGoals.map(goal => (
                  <GoalProgressCard 
                    key={goal.id} 
                    goal={goal} 
                    todaysTarget={getTodaysTarget(goal)}
                    onPress={() => router.push((`/goals/${goal.id}`) as any)}
                  />
                ))}
              </View>
            )}

            {completedGoals.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.success }]}>
                  COMPLETED GOALS
                </Text>
                {completedGoals.map(goal => (
                  <GoalProgressCard 
                    key={goal.id} 
                    goal={goal} 
                    todaysTarget={0}
                    onPress={() => router.push((`/goals/${goal.id}`) as any)}
                  />
                ))}
              </View>
            )}

            {goals.length > 0 && (
              <GlassButton 
                label="Create New Goal"
                variant="outlined"
                style={{ marginTop: spacing.md, marginBottom: spacing['2xl'] }}
                onPress={() => router.push('/goals/create')}
              />
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
});
