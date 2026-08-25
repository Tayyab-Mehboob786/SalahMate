import { AppIcon } from '../common/AppIcon';
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassBottomSheet } from '@/components/glass';
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
      style={[styles.bottomSheet, { backgroundColor: 'rgba(0,0,0,0.75)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 }]}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(142, 220, 184, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(142, 220, 184, 0.3)' }}>
            <AppIcon name="robot-outline" size={24} color="#8EDCB8" />
          </View>
          <Text variant="titleLarge" style={[styles.mainTitle, { color: '#FFFFFF', textAlign: 'center' }]}>
            Daily Spiritual Companion
          </Text>
          <Text variant="bodyMedium" style={[styles.subTitle, { color: 'rgba(255,255,255,0.7)', textAlign: 'center' }]}>
            A moment of reflection for your day.
          </Text>
        </View>
        {/* Section 1: Today's Spiritual Insight */}
        <View style={styles.sectionCard}>
          <View style={styles.centeredSectionHeader}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: '#FFFFFF', marginLeft: 0 }]}>
              Today's Spiritual Insight
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 24, textAlign: 'center' }}>
            "You have completed your Fajr prayer consistently this week.{'\n\n'}May Allah continue to strengthen your consistency.{'\n\n'}Today's focus is Asr.{'\n\n'}Try to perform it at the earliest time today.{'\n\n'}Every sincere prayer brings you closer to Allah."
          </Text>
        </View>

        {/* Section 2: Sunnah Reminder (previously Section 5) */}
        <View style={styles.sectionCard}>
          <View style={styles.centeredSectionHeader}>
            <AppIcon name="leaf" size={20} color="#8EDCB8" />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
              Sunnah Reminder
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
            Smile at someone today. It is an act of charity.
          </Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footerSection}>
          <Pressable 
            onPress={onOpenChat}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { opacity: 0.8 }
            ]}
          >
            <AppIcon name="robot" size={20} color="#000000" />
            <Text style={styles.actionButtonText}>Ask SalahMate AI</Text>
          </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
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
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EDCB8',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
  },
  actionButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: spacing.sm,
  }
});
