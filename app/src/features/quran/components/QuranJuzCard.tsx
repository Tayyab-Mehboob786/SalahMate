import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export { JuzItem } from '../utils/mushaf.utils';
import { JuzItem } from '../utils/mushaf.utils';

interface QuranJuzCardProps {
  juz: JuzItem;
  onPress: () => void;
}

export const QuranJuzCard: React.FC<QuranJuzCardProps> = ({ juz, onPress }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.container, pressed && { transform: [{ scale: 0.97 }] }]}>
          <GlassCard style={styles.card}>
            <View style={styles.contentRow}>
              {/* Number Badge */}
              <View style={[styles.numberBadge, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {juz.juzNumber}
                </Text>
              </View>

              {/* Details */}
              <View style={styles.details}>
                <Text variant="titleMedium" style={[styles.nameSimple, { color: theme.colors.onSurface }]}>
                  Juz {juz.juzNumber}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {juz.surahRange}
                </Text>
              </View>

              {/* Arabic Name */}
              <View style={styles.arabicContainer}>
                <Text variant="titleLarge" style={[styles.nameArabic, { color: theme.colors.primary }]}>
                  {juz.arabicName}
                </Text>
              </View>
            </View>

            {/* Footer Metadata */}
            <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
              <View style={styles.metaBadge}>
                <AppIcon name="book-open-page-variant-outline" size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Pages {juz.pageStart}–{juz.pageEnd}
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
  },
  nameSimple: {
    fontWeight: '700',
    marginBottom: 2,
  },
  arabicContainer: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  nameArabic: {
    fontFamily: 'sans-serif',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});
