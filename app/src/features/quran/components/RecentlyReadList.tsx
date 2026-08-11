import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface RecentlyReadItem {
  id: string;
  surah: string;
  page: number;
  lastOpened: string;
}

export const RecentlyReadList = () => {
  const theme = useTheme<SalahMateTheme>();

  // Mocked recently read history
  const recentItems: RecentlyReadItem[] = [
    { id: '1', surah: 'Al-Baqarah', page: 27, lastOpened: '2 hours ago' },
    { id: '2', surah: 'Al-Kahf', page: 293, lastOpened: 'Last Friday' },
    { id: '3', surah: 'Ya-Sin', page: 440, lastOpened: '1 week ago' },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Recently Read
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentItems.map((item) => (
          <Pressable key={item.id} onPress={() => {}}>
            {({ pressed }) => (
              <GlassCard style={[styles.card, pressed && { transform: [{ scale: 0.96 }] }]}>
                <View style={styles.header}>
                  <View style={[styles.iconBox, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <AppIcon name="book-open-page-variant" size={18} color={theme.colors.primary} />
                  </View>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.lastOpened}
                  </Text>
                </View>
                
                <Text variant="titleMedium" style={[styles.surahName, { color: theme.colors.onSurface }]}>
                  {item.surah}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Page {item.page}
                </Text>
              </GlassCard>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  card: {
    padding: spacing.md,
    width: 160,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahName: {
    fontWeight: '700',
    marginBottom: 4,
  }
});
