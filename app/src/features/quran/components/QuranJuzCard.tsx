import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components';
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
          <View style={styles.card}>
            <View style={styles.contentRow}>
              {/* Number Badge */}
              <View style={styles.numberBadge}>
                <Text variant="titleMedium" style={{ color: '#8EDCB8', fontWeight: '700' }}>
                  {juz.juzNumber}
                </Text>
              </View>

              {/* Details */}
              <View style={styles.details}>
                <Text variant="titleMedium" style={styles.nameSimple}>
                  Juz {juz.juzNumber}
                </Text>
                <Text variant="bodySmall" style={styles.surahRange}>
                  {juz.surahRange}
                </Text>
              </View>

              {/* Arabic Name */}
              <View style={styles.arabicContainer}>
                <Text variant="titleLarge" style={styles.nameArabic}>
                  {juz.arabicName}
                </Text>
              </View>
            </View>

            {/* Footer Metadata */}
            <View style={styles.footer}>
              <View style={styles.metaBadge}>
                <AppIcon name="book-open-page-variant-outline" size={14} color="rgba(255,255,255,0.7)" />
                <Text variant="labelSmall" style={styles.metaText}>
                  Pages {juz.pageStart}–{juz.pageEnd}
                </Text>
              </View>
            </View>
          </View>
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
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
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
    color: '#FFFFFF',
  },
  surahRange: {
    color: 'rgba(255,255,255,0.7)',
  },
  arabicContainer: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  nameArabic: {
    fontFamily: 'sans-serif',
    fontWeight: '500',
    color: '#F5D061',
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  }
});
