import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MushafPageData } from '../types/reader.types';
import { SurahHeader } from './SurahHeader';
import { PageIndicator } from './PageIndicator';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface MushafPageProps {
  data: MushafPageData;
  width: number;
}

export const MushafPage: React.FC<MushafPageProps> = ({ data, width }) => {
  const theme = useTheme<SalahMateTheme>();

  // Determine paper background color based on theme
  const paperColor = theme.dark ? '#1E1E1E' : '#FDFBF7';
  const textColor = theme.dark ? '#E0E0E0' : '#2C2C2C';

  // Group Ayahs by Surah to insert headers correctly
  const renderContent = () => {
    let content: React.ReactNode[] = [];
    let currentSurahId = -1;

    data.ayahs.forEach((ayah, index) => {
      // Insert Surah Header and Bismillah if surah changes
      if (ayah.surahId !== currentSurahId) {
        currentSurahId = ayah.surahId;
        const surahInfo = data.surahs.find((s) => s.id === currentSurahId);

        if (surahInfo) {
          content.push(<SurahHeader key={`header-${surahInfo.id}`} surah={surahInfo} />);
          
          // Render Bismillah (Except for Tawbah which is ID 9)
          if (surahInfo.id !== 9 && surahInfo.id !== 1) { // Fatihah (1) has Bismillah as Ayah 1 usually
            content.push(
              <Text key={`bismillah-${surahInfo.id}`} style={[styles.bismillah, { color: textColor }]}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </Text>
            );
          }
        }
      }

      // Append Ayah with its number marker
      content.push(
        <View key={`ayah-${ayah.id}`} style={styles.ayahContainer}>
          <Text style={[styles.ayahText, { color: textColor }]}>
            {ayah.textArabic} <Text style={[styles.ayahNumber, { color: theme.colors.primary }]}>﴿{ayah.ayahNumber}﴾</Text>
          </Text>
        </View>
      );
    });

    return content;
  };

  return (
    <View style={[styles.pageContainer, { width, backgroundColor: paperColor }]}>
      {/* Decorative Border Frame */}
      <View style={[styles.frame, { borderColor: theme.dark ? '#333333' : '#E8E2D2' }]}>
        <PageIndicator pageNumber={data.pageNumber} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            {renderContent()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  frame: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    margin: spacing.xs,
    padding: spacing.md,
    position: 'relative',
  },
  scrollContent: {
    paddingVertical: spacing.md,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'stretch',
  },
  ayahContainer: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Because text is RTL naturally or we set text alignment
  },
  bismillah: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    marginVertical: spacing.md,
    width: '100%',
  },
  ayahText: {
    fontSize: 28, // Large typography for easy reading
    fontFamily: 'sans-serif', // Fallback to system font, Uthmani added later
    lineHeight: 48, // Allows natural spacing within the block
    writingDirection: 'rtl',
    textAlign: 'right', // Forces RTL visual flow
  },
  ayahNumber: {
    fontSize: 22,
  },
});
