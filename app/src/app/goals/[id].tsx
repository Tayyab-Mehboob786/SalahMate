import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppIcon, ScreenContainer, GlassHeader, GlassButton, GlassCard } from '@/components';
import { useGoals, Goal } from '@/context/GoalsContext';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { goals, updateGoalProgress, getTodaysTarget, deleteGoal } = useGoals();

  const goal = goals.find(g => g.id === id);
  const [logAmount, setLogAmount] = useState('');

  if (!goal) {
    return (
      <ScreenContainer>
        <GlassHeader title="Goal Not Found" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyState}>
          <Text variant="titleMedium">This goal no longer exists.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const todaysTarget = getTodaysTarget(goal);
  const progressPercentage = goal.totalUnits > 0 
    ? Math.min(100, Math.round((goal.completedUnits / goal.totalUnits) * 100))
    : 0;
  
  const handleLogProgress = () => {
    const amount = parseInt(logAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    
    const newTotal = Math.min(goal.totalUnits, goal.completedUnits + amount);
    updateGoalProgress(goal.id, newTotal);
    setLogAmount('');
    
    if (newTotal >= goal.totalUnits) {
      Alert.alert("Alhamdulillah!", "You have successfully completed this goal. May Allah accept your efforts.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteGoal(goal.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ScreenContainer withGlassGradient>
      <GlassHeader 
        title="Goal Details" 
        showBack 
        rightSlot={
          <Pressable onPress={handleDelete}>
            <AppIcon 
              name="trash-can-outline" 
              size="lg" 
              variant="error" 
            />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Summary */}
        <View style={styles.headerSection}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
            {goal.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {goal.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <GlassCard borderRadius={20} style={styles.card}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: spacing.md }}>
            Overall Progress
          </Text>
          <View style={styles.progressHeader}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>
              {progressPercentage}%
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
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
        </GlassCard>

        {/* Today's Task & Logging */}
        {!goal.isCompleted && (
          <GlassCard borderRadius={20} style={styles.card}>
            <View style={styles.targetRow}>
              <View>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  Today's Target
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {todaysTarget > 0 ? `Complete ${todaysTarget} ${goal.unitLabel}` : 'You are ahead of schedule!'}
                </Text>
              </View>
              <AppIcon name="target" size="xl" variant="primary" />
            </View>

            <View style={styles.logSection}>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.border }]}
                value={logAmount}
                onChangeText={setLogAmount}
                keyboardType="numeric"
                placeholder={`Number of ${goal.unitLabel}...`}
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
              <GlassButton 
                label="Log Progress" 
                onPress={handleLogProgress}
                disabled={!logAmount}
                style={{ flex: 1, marginLeft: spacing.sm }}
              />
            </View>
          </GlassCard>
        )}

        {/* AI Readiness Placeholder */}
        <GlassCard borderRadius={20} style={[styles.card, { borderColor: theme.colors.primary, borderWidth: 1 }]}>
          <View style={styles.aiHeader}>
            <AppIcon name="robot-outline" size="lg" variant="primary" />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: spacing.sm, fontWeight: '700' }}>
              SalahMate AI Coaching
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.sm, lineHeight: 22 }}>
            "You're making steady progress, Alhamdulillah! Keep consistent with your daily target of {todaysTarget} {goal.unitLabel}, and you will finish right on time. May Allah make it easy for you."
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.primary, marginTop: spacing.md, opacity: 0.8 }}>
            * This is a placeholder. Future updates will generate personalized, adaptive motivation based on your real-time progress.
          </Text>
        </GlassCard>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 16,
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
