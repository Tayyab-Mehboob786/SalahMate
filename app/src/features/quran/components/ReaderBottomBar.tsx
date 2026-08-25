import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ReaderBottomBarProps {
  pageNumber: number;
  juzNumber: number;
  surahName: string;
  onPrevPress: () => void;
  onNextPress: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const ReaderBottomBar: React.FC<ReaderBottomBarProps> = ({
  pageNumber,
  juzNumber,
  surahName,
  onPrevPress,
  onNextPress,
  canGoPrev,
  canGoNext,
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      
      {/* Next Button (Left side physically for RTL flow) */}
      <Pressable 
        style={[styles.navButton, !canGoNext && { opacity: 0.3 }]} 
        onPress={onNextPress} 
        disabled={!canGoNext}
      >
        <AppIcon name="chevron-left" size={28} color="#FFFFFF" />
        <View style={styles.navLabels}>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Next</Text>
          {canGoNext && <Text variant="labelMedium" style={{ color: '#FFFFFF' }}>Page {pageNumber + 1}</Text>}
        </View>
      </Pressable>

      {/* Center Info */}
      <View style={styles.centerInfo}>
        <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          {surahName}
        </Text>
        <Text variant="labelMedium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Page {pageNumber} • Juz {juzNumber}
        </Text>
      </View>

      {/* Prev Button (Right side physically for RTL flow) */}
      <Pressable 
        style={[styles.navButton, !canGoPrev && { opacity: 0.3 }, { alignItems: 'flex-end' }]} 
        onPress={onPrevPress} 
        disabled={!canGoPrev}
      >
        <AppIcon name="chevron-right" size={28} color="#FFFFFF" />
        <View style={[styles.navLabels, { alignItems: 'flex-end' }]}>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.7)' }}>Previous</Text>
          {canGoPrev && <Text variant="labelMedium" style={{ color: '#FFFFFF' }}>Page {pageNumber - 1}</Text>}
        </View>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 24, // Safe area padding
  },
  navButton: {
    padding: spacing.sm,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 70,
  },
  navLabels: {
    marginTop: 4,
  },
  centerInfo: {
    alignItems: 'center',
  },
});
