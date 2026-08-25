import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppIcon, ScreenContainer, GlassButton } from '@/components';
import { BlurView } from 'expo-blur';
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
            <Text style={styles.headerTitle}>Goal Not Found</Text>
          </View>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.emptyState}>
          <Text variant="titleMedium" style={{ color: '#FFFFFF' }}>This goal no longer exists.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const todaysTarget = getTodaysTarget(goal);
  const progressPercentage = goal.progress?.progressPercentage ?? (
    goal.totalUnits > 0 
      ? Math.min(100, Math.round(((goal.completedUnits || 0) / goal.totalUnits) * 100))
      : 0
  );
  const completedUnits = goal.progress?.completedUnits ?? (goal.completedUnits || 0);
  const isCompleted = goal.lifecycleStatus === 'COMPLETED' || (goal.progress?.isCompleted ?? goal.isCompleted);
  const isExpired = goal.lifecycleStatus === 'EXPIRED';
  const isActive = goal.lifecycleStatus === 'ACTIVE';
  
  const handleLogProgress = async () => {
    const amount = parseInt(logAmount, 10);
    if (isNaN(amount) || amount <= 0) return;
    
    const updated = await updateGoalProgress(goal.id, amount);
    setLogAmount('');
    
    if (updated && (updated.lifecycleStatus === 'COMPLETED' || updated.progress?.isCompleted || updated.isCompleted)) {
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
          onPress: async () => {
            await deleteGoal(goal.id);
            router.back();
          }
        }
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Goal Details</Text>
        </View>
        <Pressable onPress={handleDelete} style={styles.iconBtn}>
          <AppIcon name="trash-can-outline" size={24} color="#FF6B6B" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Summary */}
        <View style={styles.headerSection}>
          <Text variant="headlineSmall" style={[styles.title, { color: '#FFFFFF' }]}>
            {goal.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.25)' : isCompleted ? 'rgba(74, 222, 128, 0.25)' : 'rgba(255,255,255,0.2)' }]}>
            <Text variant="labelSmall" style={{ color: '#FFFFFF', fontWeight: '700' }}>
              {isExpired ? 'EXPIRED' : isCompleted ? 'COMPLETED' : goal.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <BlurView intensity={25} tint="light" style={styles.card}>
          <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: spacing.md }}>
            Overall Progress
          </Text>
          <View style={styles.progressHeader}>
            <Text variant="headlineMedium" style={{ color: '#FFFFFF', fontWeight: '800' }}>
              {progressPercentage}%
            </Text>
            <Text variant="bodyMedium" style={{ color: '#CBD5E1' }}>
              {completedUnits} / {goal.totalUnits} {goal.unitLabel}
            </Text>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: isCompleted ? '#4ADE80' : isExpired ? '#F87171' : '#FFFFFF',
                  width: `${progressPercentage}%` 
                }
              ]} 
            />
          </View>
        </BlurView>

        {/* Today's Task & Logging for Active Goals */}
        {isActive && (
          <BlurView intensity={25} tint="light" style={styles.card}>
            <View style={styles.targetRow}>
              <View>
                <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  Today's Target
                </Text>
                <Text variant="bodyMedium" style={{ color: '#CBD5E1', marginTop: 4 }}>
                  {todaysTarget > 0 ? `Complete ${todaysTarget} ${goal.unitLabel}` : 'You are ahead of schedule!'}
                </Text>
              </View>
              <AppIcon name="target" size={32} color="#FFFFFF" />
            </View>

            <View style={styles.logSection}>
              <TextInput
                style={[styles.input, { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }]}
                value={logAmount}
                onChangeText={setLogAmount}
                keyboardType="numeric"
                placeholder={`Number of ${goal.unitLabel}...`}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <GlassButton 
                label="Log Progress" 
                variant="white"
                onPress={handleLogProgress}
                disabled={!logAmount}
                style={{ flex: 1, marginLeft: spacing.sm }}
              />
            </View>
          </BlurView>
        )}

        {/* Expired State Info */}
        {isExpired && (
          <BlurView intensity={25} tint="light" style={styles.card}>
            <View style={styles.targetRow}>
              <View>
                <Text variant="titleMedium" style={{ color: '#F87171', fontWeight: '700' }}>
                  Goal Expired
                </Text>
                <Text variant="bodyMedium" style={{ color: '#CBD5E1', marginTop: 4 }}>
                  Target date reached. Historical progress is preserved.
                </Text>
              </View>
              <AppIcon name="clock-alert-outline" size={32} color="#F87171" />
            </View>
          </BlurView>
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
    paddingTop: 60,
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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
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
});
