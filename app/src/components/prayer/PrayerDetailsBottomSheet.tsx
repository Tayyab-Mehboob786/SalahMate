import { AppIcon } from '@/components';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassBottomSheet, GlassCard } from '@/components/glass';
import { spacing, icons } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface PrayerDetailsData {
  name: string;
  rakatsBreakdown: string;
  rakats: number;
  preferredTime: string;
  importance: string;
  reference: string;
  icon: string;
}

interface PrayerDetailsBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  prayer: PrayerDetailsData | null;
}

export const PrayerDetailsBottomSheet: React.FC<PrayerDetailsBottomSheetProps> = ({
  visible,
  onDismiss,
  prayer,
}) => {
  const theme = useTheme<SalahMateTheme>();

  if (!prayer) return null;

  return (
    <GlassBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      style={styles.bottomSheet}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryContainer }]}>
            <AppIcon name={prayer.icon as any} size={28} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={[styles.mainTitle, { color: theme.colors.onSurface }]}>
            {prayer.name} Prayer
          </Text>
        </View>

        {/* Rakats Breakdown */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="format-list-numbered" size={icons.medium} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Rakats Breakdown
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.sm }}>
            {prayer.rakatsBreakdown}
          </Text>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Total: {prayer.rakats} Rakats
          </Text>
        </GlassCard>

        {/* Preferred Prayer Time */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="clock-outline" size={icons.medium} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Preferred Time
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {prayer.preferredTime}
          </Text>
        </GlassCard>

        {/* Importance */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="star-circle-outline" size={icons.medium} color={theme.colors.tertiary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Importance
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
            {prayer.importance}
          </Text>
        </GlassCard>

        {/* Reference */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="book-open-page-variant-outline" size={icons.medium} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Reference
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontStyle: 'italic', lineHeight: 22 }}>
            "{prayer.reference.split('\n')[0]}"
          </Text>
          {prayer.reference.split('\n').length > 1 && (
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.sm }}>
              {prayer.reference.split('\n')[1]}
            </Text>
          )}
        </GlassCard>
      </ScrollView>
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    maxHeight: '90%',
  },
  scrollContainer: {},
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
    paddingTop: spacing.sm,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mainTitle: {
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
  },
});
