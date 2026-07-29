/**
 * SalahMate Profile Screen (`/(tabs)/profile`)
 *
 * Apple Health & Headspace inspired user profile card, badges summary,
 * icon-enhanced preferences list, and clean navigation shortcuts.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/auth/useAuth';
import { GlassAvatar, GlassButton, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const theme = useTheme<SalahMateTheme>();

  const userName = user?.name ?? 'Tayyab';
  const userEmail = user?.email ?? 'tayyab@salahmate.app';
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="User Profile" subtitle="Spiritual Journey & Preferences" showBack />

      <View style={styles.content}>
        {/* Hero User Card */}
        <GlassCard borderRadius={24} contentStyle={styles.profileCardContent}>
          <GlassAvatar initials={initials} size={84} style={styles.avatar} />
          <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>
            {userName}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {userEmail}
          </Text>
          <View style={[styles.memberBadge, { backgroundColor: theme.colors.primaryContainer }]}>
            <AppIcon name="shield-check" size="sm" variant="primary" />
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              PRO SPIRITUAL GUARDIAN
            </Text>
          </View>
        </GlassCard>

        {/* Quick Stats Summary */}
        <View style={styles.statsRow}>
          <GlassCard borderRadius={16} style={styles.statCol} contentStyle={styles.statContent}>
            <AppIcon name="fire" size="lg" variant="achievement" />
            <Text variant="titleLarge" style={[styles.statVal, { color: theme.colors.onSurface }]}>
              14 Days
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Current Streak
            </Text>
          </GlassCard>

          <GlassCard borderRadius={16} style={styles.statCol} contentStyle={styles.statContent}>
            <AppIcon name="trophy" size="lg" variant="primary" />
            <Text variant="titleLarge" style={[styles.statVal, { color: theme.colors.onSurface }]}>
              8 Badges
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Achievements
            </Text>
          </GlassCard>
        </View>

        {/* Prayer Preferences */}
        <GlassCard borderRadius={20}>
          <View style={styles.cardHeaderRow}>
            <Text variant="titleSmall" style={[styles.cardHeader, { color: theme.colors.onSurface }]}>
              PRAYER CALCULATION SETTINGS
            </Text>
            <AppIcon name="cog-outline" size="md" variant="secondary" />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelBox}>
              <AppIcon name="calculator-variant" size="md" variant="primary" />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Calculation
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.settingValue, { color: theme.colors.onSurface }]}
            >
              Muslim World League
            </Text>
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelBox}>
              <AppIcon name="weather-partly-cloudy" size="md" variant="primary" />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Asr Juristic Method
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.settingValue, { color: theme.colors.onSurface }]}
            >
              Shafi&apos;i / Maliki
            </Text>
          </View>

          <View style={styles.settingRowLast}>
            <View style={styles.settingLabelBox}>
              <AppIcon name="earth" size="md" variant="primary" />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                High Latitude Rule
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.settingValue, { color: theme.colors.onSurface }]}
            >
              Middle of Night
            </Text>
          </View>
        </GlassCard>

        {/* Actions */}
        <View style={styles.actionSection}>
          <GlassButton
            label="Full Application Settings"
            variant="primary"
            icon={<AppIcon name="tune" size="md" variant="onPrimary" />}
            onPress={() => router.push('/settings')}
          />
          <GlassButton
            label="Sign Out of Account"
            variant="outlined"
            icon={<AppIcon name="logout" size="md" variant="error" />}
            onPress={handleLogout}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  profileCardContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  name: {
    fontWeight: '800',
    marginBottom: 4,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCol: {
    flex: 1,
    marginVertical: 0,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 4,
  },
  statVal: {
    fontWeight: '800',
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardHeader: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    fontWeight: '600',
  },
  actionSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
});
