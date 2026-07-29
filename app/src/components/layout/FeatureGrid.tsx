import { AppIcon } from '@/components';
/**
 * SalahMate — FeatureGrid Component (`src/components/layout/FeatureGrid.tsx`)
 *
 * Responsive two-column shortcut grid resembling Apple Health, Google Fit, and Headspace grids.
 * Guarantees exactly two cards per row with equal dimensions, high contrast typography, and zero character wrapping.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface FeatureGridItem {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly route?: string;
  readonly onPress?: () => void;
  readonly alertMsg?: string;
}

export interface FeatureGridProps {
  readonly items: readonly FeatureGridItem[];
  readonly onItemPress?: (item: FeatureGridItem) => void;
  readonly cardMinHeight?: number;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  items,
  onItemPress,
  cardMinHeight = 148,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const handlePress = (item: FeatureGridItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (onItemPress) {
      onItemPress(item);
    }
  };

  return (
    <View style={styles.gridContainer}>
      {items.map((item) => (
        <GlassCard
          key={item.title}
          borderRadius={22}
          onPress={() => handlePress(item)}
          style={[styles.gridCard, { minHeight: cardMinHeight }]}
          contentStyle={styles.cardContent}
          accessibilityLabel={`${item.title}, ${item.subtitle}`}
        >
          <View style={[styles.iconBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
            <AppIcon name={item.icon as any} size={26} color={theme.dark ? '#7FC8E8' : '#145874'} />
          </View>
          <Text
            variant="titleMedium"
            style={[styles.cardTitle, { color: theme.colors.onSurface }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.cardSubtitle, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.subtitle}
          </Text>
        </GlassCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  gridCard: {
    width: '48%',
    marginVertical: 0,
  },
  cardContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 6,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardSubtitle: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
