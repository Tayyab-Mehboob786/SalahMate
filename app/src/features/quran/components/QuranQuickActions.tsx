import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ActionItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuranQuickActionsProps {
  onNavigateSurahs: () => void;
  onNavigateJuz: () => void;
  onNavigateBookmarks: () => void;
  onNavigateSearch: () => void;
}

export const QuranQuickActions: React.FC<QuranQuickActionsProps> = ({
  onNavigateSurahs,
  onNavigateJuz,
  onNavigateBookmarks,
  onNavigateSearch,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const actions: ActionItem[] = [
    { id: 'surahs', title: 'Surahs', icon: 'book-open-page-variant', color: '#19698C', onPress: onNavigateSurahs },
    { id: 'juz', title: 'Juz', icon: 'mosque', color: '#8B5A2B', onPress: onNavigateJuz },
    { id: 'bookmarks', title: 'Bookmarks', icon: 'bookmark-multiple', color: '#D4AF37', onPress: onNavigateBookmarks },
    { id: 'search', title: 'Search', icon: 'text-search', color: '#4A90E2', onPress: onNavigateSearch },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <View key={action.id} style={styles.gridItem}>
          <Pressable onPress={action.onPress}>
            {({ pressed }) => (
              <GlassCard
                style={[
                  styles.card,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                  <AppIcon name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text variant="labelLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
                  {action.title}
                </Text>
              </GlassCard>
            )}
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
  card: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    borderRadius: 20,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontWeight: '700',
  },
});
