import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface SurahItem {
  id: number;
  nameArabic: string;
  nameSimple: string;
  nameTranslated: string;
  revelationPlace: 'makkah' | 'madinah';
  versesCount: number;
  juzNumber: number;
  isRecent?: boolean;
}

interface QuranSurahCardProps {
  surah: SurahItem;
  onPress: () => void;
}

export const QuranSurahCard: React.FC<QuranSurahCardProps> = ({ surah, onPress }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.container, pressed && { transform: [{ scale: 0.97 }] }]}>
          <GlassCard style={styles.card}>
            {surah.isRecent && (
              <View style={[styles.recentBadge, { backgroundColor: `${theme.colors.primary}15` }]}>
                <AppIcon name="clock-outline" size={14} color={theme.colors.primary} />
                <Text style={[styles.recentText, { color: theme.colors.primary }]}>
                  Continue Reading
                </Text>
              </View>
            )}

            <View style={styles.contentRow}>
              {/* Number Badge */}
              <View style={[styles.numberBadge, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {surah.id}
                </Text>
              </View>

              {/* Name Details */}
              <View style={styles.details}>
                <Text variant="titleMedium" style={[styles.nameSimple, { color: theme.colors.onSurface }]}>
                  {surah.nameSimple}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {surah.nameTranslated}
                </Text>
              </View>

              {/* Arabic Name */}
              <View style={styles.arabicContainer}>
                <Text variant="headlineSmall" style={[styles.nameArabic, { color: theme.colors.primary }]}>
                  {surah.nameArabic}
                </Text>
              </View>
            </View>

            {/* Footer Metadata */}
            <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
              <View style={styles.metaBadge}>
                <AppIcon 
                  name={(surah.revelationPlace === 'makkah' ? 'city' : 'mosque') as any} 
                  size={14} 
                  color={theme.colors.onSurfaceVariant} 
                />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {surah.revelationPlace === 'makkah' ? 'Makki' : 'Madani'}
                </Text>
              </View>

              <View style={styles.metaBadge}>
                <AppIcon name="book-open-outline" size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {surah.versesCount} Ayahs
                </Text>
              </View>

              <View style={styles.metaBadge}>
                <AppIcon name="bookmark-outline" size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Juz {surah.juzNumber}
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
  recentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  recentText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    fontFamily: 'sans-serif', // Placeholder for Arabic font
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.lg,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  }
});
