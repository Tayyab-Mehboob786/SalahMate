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
    <View style={styles.container}>
      {/* Decorative Top Line */}
      <View style={styles.decorativeLine} />
      
      <View style={styles.content}>
        <View style={styles.leftInfo}>
          <AppIcon 
            name={(surah.revelationPlace === 'makkah' ? 'city' : 'mosque') as any} 
            size={16} 
            color="rgba(255,255,255,0.7)"
          />
          <Text variant="labelSmall" style={[styles.infoText, { color: 'rgba(255,255,255,0.7)' }]}>
            {surah.revelationPlace === 'makkah' ? 'Makki' : 'Madani'}
          </Text>
        </View>

        <View style={styles.centerInfo}>
          <Text variant="titleMedium" style={[styles.arabicName, { color: '#F5D061' }]}>
            {surah.nameArabic}
          </Text>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {surah.nameTranslated}
          </Text>
        </View>

        <View style={styles.rightInfo}>
          <Text variant="labelSmall" style={[styles.infoText, { color: 'rgba(255,255,255,0.7)' }]}>
            {surah.versesCount} Ayahs
          </Text>
        </View>
      </View>

      {/* Decorative Bottom Line */}
      <View style={styles.decorativeLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
