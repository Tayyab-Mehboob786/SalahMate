import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export const DailyVerseCard = () => {
  const theme = useTheme<SalahMateTheme>();

  // Mocked data for Phase 13.2
  const mockVerse = {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    surah: "Al-Baqarah",
    ayah: 186,
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Verse of the Day
      </Text>
      
      <GlassCard style={styles.card}>
        <Text style={[styles.arabic, { color: theme.colors.onSurface }]}>
          {mockVerse.arabic}
        </Text>
        
        <Text style={[styles.translation, { color: theme.colors.onSurfaceVariant }]}>
          "{mockVerse.translation}"
        </Text>

        <View style={styles.footer}>
          <Text variant="labelMedium" style={[styles.reference, { color: theme.colors.primary }]}>
            {mockVerse.surah} • Ayah {mockVerse.ayah}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.iconButton}>
              <AppIcon name="bookmark-outline" size={20} color={theme.colors.onSurfaceVariant} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <AppIcon name="share-variant-outline" size={20} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.xl,
  },
  arabic: {
    fontSize: 26,
    lineHeight: 46,
    textAlign: 'center',
    fontFamily: 'sans-serif', // Would normally use custom arabic font like 'Uthmanic'
    marginBottom: spacing.lg,
  },
  translation: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: spacing.md,
  },
  reference: {
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    padding: 4,
  }
});
