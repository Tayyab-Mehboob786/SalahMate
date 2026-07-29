import { AppIcon } from '@/components';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassBottomSheet, GlassCard, GlassButton } from '@/components/glass';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface SpiritualInsightsBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  onOpenChat: () => void;
}

export const SpiritualInsightsBottomSheet: React.FC<SpiritualInsightsBottomSheetProps> = ({ 
  visible, 
  onDismiss,
  onOpenChat 
}) => {
  const theme = useTheme<SalahMateTheme>();

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
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <Text variant="titleLarge" style={[styles.mainTitle, { color: theme.colors.onSurface, textAlign: 'center' }]}>
            🤖 Daily Spiritual Companion
          </Text>
          <Text variant="bodyMedium" style={[styles.subTitle, { color: theme.colors.onSurfaceVariant, textAlign: 'center' }]}>
            A moment of reflection for your day.
          </Text>
        </View>
        {/* Section 1: Today's Spiritual Insight */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.centeredSectionHeader}>
            <AppIcon name="robot-outline" size={20} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Today's Spiritual Insight
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 22 }}>
            "You have completed your Fajr prayer consistently this week.{'\n\n'}May Allah continue to strengthen your consistency.{'\n\n'}Today's focus is Asr.{'\n\n'}Try to perform it at the earliest time today.{'\n\n'}Every sincere prayer brings you closer to Allah."
          </Text>
        </GlassCard>

        {/* Section 2: Sunnah Reminder (previously Section 5) */}
        <GlassCard borderRadius={16} style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon name="star-crescent" size={20} color={theme.colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Sunnah Reminder
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            Smile at someone today. It is an act of charity.
          </Text>
        </GlassCard>

        {/* Bottom Actions */}
        <View style={styles.footerSection}>
          <GlassButton 
            label="Ask SalahMate AI" 
            variant="primary" 
            icon={<AppIcon name="robot" size={20} color={theme.colors.textOnPrimary} />}
            onPress={onOpenChat}
            style={{ width: '100%' }}
          />
        </View>

      </ScrollView>
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    paddingHorizontal: 0, 
    paddingBottom: 0,
    maxHeight: '85%', 
  },
  scrollContainer: {
    // Removed flex: 1 to prevent it from collapsing when parent has no fixed height.
    // ScrollView defaults to flexShrink: 1 anyway.
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
    paddingTop: spacing.sm,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  mainTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  subTitle: {
    fontWeight: '500',
  },
  sectionCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  centeredSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  footerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  }
});
