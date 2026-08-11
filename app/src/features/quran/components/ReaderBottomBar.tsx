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
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      
      {/* Prev Button (Left side physically) */}
      <Pressable 
        style={[styles.navButton, !canGoPrev && { opacity: 0.3 }]} 
        onPress={onPrevPress} 
        disabled={!canGoPrev}
      >
        <AppIcon name="chevron-left" size={28} color={theme.colors.onSurface} />
        <View style={styles.navLabels}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Previous</Text>
          {canGoPrev && <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>Page {pageNumber - 1}</Text>}
        </View>
      </Pressable>

      {/* Center Info */}
      <View style={styles.centerInfo}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
          {surahName}
        </Text>
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Page {pageNumber} • Juz {juzNumber}
        </Text>
      </View>

      {/* Next Button (Right side physically) */}
      <Pressable 
        style={[styles.navButton, !canGoNext && { opacity: 0.3 }, { alignItems: 'flex-end' }]} 
        onPress={onNextPress} 
        disabled={!canGoNext}
      >
        <AppIcon name="chevron-right" size={28} color={theme.colors.onSurface} />
        <View style={[styles.navLabels, { alignItems: 'flex-end' }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Next</Text>
          {canGoNext && <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>Page {pageNumber + 1}</Text>}
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
    borderTopWidth: 1,
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
