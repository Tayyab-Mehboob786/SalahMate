import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components';
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
          <View style={styles.card}>
            {surah.isRecent && (
              <View style={[styles.recentBadge, { backgroundColor: 'rgba(142,220,184,0.15)' }]}>
                <AppIcon name="clock-outline" size={14} color="#8EDCB8" />
                <Text style={[styles.recentText, { color: '#8EDCB8' }]}>
                  Continue Reading
                </Text>
              </View>
            )}

            <View style={styles.contentRow}>
              {/* Number Badge */}
              <View style={styles.numberBadge}>
                <Text variant="titleMedium" style={{ color: '#8EDCB8', fontWeight: '700' }}>
                  {surah.id}
                </Text>
              </View>

              {/* Name Details */}
              <View style={styles.details}>
                <Text variant="titleMedium" style={styles.nameSimple}>
                  {surah.nameSimple}
                </Text>
                <Text variant="bodySmall" style={styles.nameTranslated}>
                  {surah.nameTranslated}
                </Text>
              </View>

              {/* Arabic Name */}
              <View style={styles.arabicContainer}>
                <Text variant="headlineSmall" style={styles.nameArabic}>
                  {surah.nameArabic}
                </Text>
              </View>
            </View>

            {/* Footer Metadata */}
            <View style={styles.footer}>
              <View style={styles.metaBadge}>
                <AppIcon 
                  name={(surah.revelationPlace === 'makkah' ? 'city' : 'mosque') as any} 
                  size={14} 
                  color="rgba(255,255,255,0.7)" 
                />
                <Text variant="labelSmall" style={styles.metaText}>
                  {surah.revelationPlace === 'makkah' ? 'MAKKI' : 'MADANI'}
                </Text>
              </View>

              <Text style={styles.metaDot}>•</Text>

              <View style={styles.metaBadge}>
                <AppIcon name="format-list-bulleted" size={14} color="rgba(255,255,255,0.7)" />
                <Text variant="labelSmall" style={styles.metaText}>
                  {surah.versesCount} AYAHS
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
  nameTranslated: {
    color: 'rgba(255,255,255,0.7)',
  },
  arabicContainer: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  nameArabic: {
    fontFamily: 'sans-serif', // Placeholder for Arabic font
    fontWeight: '500',
    color: '#F5D061',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: spacing.sm,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  }
});
