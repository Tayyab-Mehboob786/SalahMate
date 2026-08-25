import React, { useRef, useEffect } from 'react';
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
  fontSize?: number;
  playingAyahId?: number | null;
  targetSurahId?: number | null;
}

export const MushafPage: React.FC<MushafPageProps> = ({ 
  data, 
  width, 
  fontSize = 24, 
  playingAyahId,
  targetSurahId 
}) => {
  const theme = useTheme<SalahMateTheme>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrolledRef = useRef(false);

  // Reset scroll ref whenever page or target surah changes
  useEffect(() => {
    scrolledRef.current = false;
  }, [data.pageNumber, targetSurahId]);

  // Determine paper background color based on theme
  const paperColor = 'transparent'; // Let the screen background image show through
  const textColor = '#F5D061'; // Gold text for a premium look

  // Group Ayahs by Surah to insert headers correctly
  const renderContent = () => {
    let content: React.ReactNode[] = [];
    let currentSurahId = -1;

    data.ayahs.forEach((ayah, index) => {
      // Insert Surah Header and Bismillah if surah changes
      if (ayah.surahId !== currentSurahId) {
        currentSurahId = ayah.surahId;
        
        // Only render header and Bismillah if this is the start of the Surah
        if (ayah.ayahNumber === 1) {
          const surahInfo = data.surahs.find((s) => s.id === currentSurahId);

          if (surahInfo) {
            const isTargetSurah = targetSurahId && surahInfo.id === targetSurahId;

            content.push(
              <View 
                key={`header-${surahInfo.id}`}
                onLayout={(e) => {
                  if (isTargetSurah && !scrolledRef.current) {
                    scrolledRef.current = true;
                    const y = e.nativeEvent.layout.y;
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: false });
                    }, 50);
                  }
                }}
              >
                <SurahHeader surah={surahInfo} />
              </View>
            );
            
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
      }

      // Append Ayah with its number marker
      const isPlaying = ayah.id === playingAyahId;
      content.push(
        <View 
          key={`ayah-${ayah.id}`} 
          style={[styles.ayahContainer, isPlaying && styles.activeAyah]}
        >
          <Text style={[styles.ayahText, { color: textColor, fontSize, lineHeight: fontSize * 1.7 }]}>
            {ayah.textArabic} <Text style={[styles.ayahNumber, { color: '#8EDCB8', fontSize: fontSize * 0.8 }]}>﴿{ayah.ayahNumber}﴾</Text>
          </Text>
          {ayah.translation && (
            <Text style={[styles.translationText, { fontSize: Math.max(14, fontSize * 0.65) }]}>
              {ayah.translation.replace(/<[^>]*>?/gm, '')}
            </Text>
          )}
        </View>
      );
    });

    return content;
  };

  return (
    <View style={[styles.pageContainer, { width, backgroundColor: paperColor }]}>
      {/* Decorative Border Frame -> Now Glass Panel */}
      <View style={styles.frame}>
        <PageIndicator pageNumber={data.pageNumber} />
        
        <ScrollView 
          ref={scrollViewRef}
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
    borderWidth: 1,
    borderRadius: 24,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 12,
  },
  activeAyah: {
    backgroundColor: 'rgba(142, 220, 184, 0.15)', // Subtle green highlight
  },
  bismillah: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    marginVertical: spacing.md,
    width: '100%',
  },
  ayahText: {
    fontFamily: 'sans-serif', // Fallback to system font, Uthmani added later
    writingDirection: 'rtl',
    textAlign: 'right', // Forces RTL visual flow
  },
  ayahNumber: {
    // sizing is handled inline
  },
  translationText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
    fontFamily: 'sans-serif',
    textAlign: 'auto',
  },
});
