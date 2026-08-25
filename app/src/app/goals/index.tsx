import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenContainer, GlassButton, GoalSkeleton, AppIcon } from '@/components';
import { GoalProgressCard } from '@/components/goals/GoalProgressCard';
import { useGoals } from '@/context/GoalsContext';
import { usePullToRefresh } from '@/hooks';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function GoalsDashboard() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { goals, getTodaysTarget, isLoading: ctxLoading, refreshGoals } = useGoals();
  const { refreshControl } = usePullToRefresh(refreshGoals);

  const activeGoals = goals.filter(g => g.lifecycleStatus === 'ACTIVE');
  const completedGoals = goals.filter(g => g.lifecycleStatus === 'COMPLETED');
  const expiredGoals = goals.filter(g => g.lifecycleStatus === 'EXPIRED');

  return (
    <ScreenContainer 
      backgroundImage={require('../../../assets/backgrounds/asma-mosque.png')} 
      withGlassGradient={false}
      style={{ backgroundColor: 'transparent' }}
    >
      <View style={styles.overlay} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <AppIcon name="chevron-left" size={28} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Islamic Goals</Text>
          <Text style={styles.headerSubtitle}>Track your spiritual journey</Text>
        </View>
        <Pressable onPress={() => router.push('/goals/create')} style={styles.iconBtn}>
          <AppIcon name="plus-circle" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {ctxLoading ? (
          <GoalSkeleton />
        ) : goals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="flag-checkered" 
              size={64} 
              color="rgba(255,255,255,0.7)" 
              style={{ marginBottom: spacing.md }}
            />
            <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '700', textAlign: 'center' }}>
              No Goals Yet
            </Text>
            <Text variant="bodyMedium" style={{ color: '#CBD5E1', textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }}>
              Start your journey by setting a meaningful Islamic goal for yourself.
            </Text>
            <GlassButton 
              label="Create Your First Goal"
              variant="white"
              onPress={() => router.push('/goals/create')}
            />
          </View>
        ) : (
          <>
            {activeGoals.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
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
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: '#4ADE80' }]}>
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

            {expiredGoals.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: '#94A3B8' }]}>
                  EXPIRED GOALS
                </Text>
                {expiredGoals.map(goal => (
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
                variant="white-outlined"
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 20, 15, 0.40)', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60, // accommodate safe area roughly
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
    fontSize: 13,
  },
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
