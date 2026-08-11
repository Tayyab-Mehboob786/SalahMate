import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { SurahInfo } from '../types/reader.types';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface SurahHeaderProps {
  surah: SurahInfo;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({ surah }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}>
      {/* Decorative Top Line */}
      <View style={[styles.decorativeLine, { backgroundColor: theme.colors.outlineVariant }]} />
      
      <View style={styles.content}>
        <View style={styles.leftInfo}>
          <AppIcon 
            name={(surah.revelationPlace === 'makkah' ? 'city' : 'mosque') as any} 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text variant="labelSmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            {surah.revelationPlace === 'makkah' ? 'Makki' : 'Madani'}
          </Text>
        </View>

        <View style={styles.centerInfo}>
          <Text variant="titleMedium" style={[styles.arabicName, { color: theme.colors.onSurface }]}>
            {surah.nameArabic}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {surah.nameTranslated}
          </Text>
        </View>

        <View style={styles.rightInfo}>
          <Text variant="labelSmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            {surah.versesCount} Ayahs
          </Text>
        </View>
      </View>

      {/* Decorative Bottom Line */}
      <View style={[styles.decorativeLine, { backgroundColor: theme.colors.outlineVariant }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  decorativeLine: {
    height: 3,
    width: '100%',
    opacity: 0.5,
  },
  leftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 2,
    alignItems: 'center',
  },
  rightInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  arabicName: {
    fontFamily: 'sans-serif', // Fallback, will be replaced with Uthmani later
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoText: {
    marginLeft: 4,
  },
});
