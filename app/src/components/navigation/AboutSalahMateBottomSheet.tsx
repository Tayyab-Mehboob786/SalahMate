import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { GlassBottomSheet } from '@/components/glass';
import { spacing } from '@/theme';

interface AboutSalahMateBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

export const AboutSalahMateBottomSheet: React.FC<AboutSalahMateBottomSheetProps> = ({
  visible,
  onDismiss
}) => {
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
        <View style={styles.headerContainer}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(142, 220, 184, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(142, 220, 184, 0.3)' }}>
            <AppIcon name="information-outline" size={24} color="#8EDCB8" />
          </View>
          <Text variant="titleLarge" style={[styles.mainTitle, { color: '#FFFFFF', textAlign: 'center' }]}>
            About SalahMate
          </Text>
          <Text variant="bodyMedium" style={[styles.subTitle, { color: 'rgba(255,255,255,0.7)', textAlign: 'center' }]}>
            SalahMate v1.0.0 (Build 2026.07)
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 24, textAlign: 'center' }}>
            Your premium Islamic Prayer Companion crafted with Barakah.{"\n\n"}Developed by Tayyab Mehboob{"\n"}Supervised by Mam Onaiza Maqbool
          </Text>
        </View>

        <View style={styles.footerSection}>
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { opacity: 0.8 }
            ]}
          >
            <Text style={styles.actionButtonText}>Close</Text>
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
  footerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
