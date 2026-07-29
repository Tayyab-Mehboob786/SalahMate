/**
 * SalahMate — Islamic Companion Central Hub (`/islamic-companion`)
 *
 * Dedicated screen housing all 10 primary Islamic spiritual resources:
 * Holy Quran, Asma-ul-Husna, Hijri Calendar, Qibla Compass, Daily Duas,
 * Hadith of the Day, Islamic Events, Tasbeeh Counter, Islamic Articles, and Bookmarks.
 */

import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, FeatureGrid, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface CompanionModule {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly route?: string;
  readonly alertMsg?: string;
}

const COMPANION_MODULES: readonly CompanionModule[] = [
  {
    title: 'Holy Quran',
    subtitle: '114 Surahs · Progress',
    icon: 'book-open-page-variant',
    route: '/quran',
  },
  {
    title: 'Asma-ul-Husna',
    subtitle: '99 Beautiful Names',
    icon: 'star-crescent',
    route: '/asma-ul-husna',
  },
  {
    title: 'Hijri Calendar',
    subtitle: '1448 AH Dates',
    icon: 'calendar-month',
    route: '/hijri-calendar',
  },
  {
    title: 'Qibla Compass',
    subtitle: 'Kaaba Alignment',
    icon: 'compass-outline',
    route: '/qibla',
  },
  {
    title: 'Daily Duas',
    subtitle: 'Authentic Supplications',
    icon: 'hands-pray',
    route: '/duas',
  },
  {
    title: 'Hadith of the Day',
    subtitle: 'Prophetic Wisdom',
    icon: 'format-quote-close',
    route: '/hadith',
  },
  {
    title: 'Islamic Events',
    subtitle: 'Sacred Milestones',
    icon: 'calendar-star',
    route: '/islamic-events',
  },
  {
    title: 'Tasbeeh Counter',
    subtitle: 'Digital Dhikr Tracker',
    icon: 'counter',
    alertMsg: 'Digital Tasbeeh & Dhikr Counter is coming soon in the next update!',
  },
  {
    title: 'Islamic Articles',
    subtitle: 'Spiritual Guides',
    icon: 'book-open-outline',
    alertMsg: 'Spiritual guides and Islamic articles knowledge base will be available soon.',
  },
  {
    title: 'Bookmarks',
    subtitle: 'Saved Verses & Duas',
    icon: 'bookmark-multiple-outline',
    alertMsg: 'Your saved Quranic verses, Hadiths, and favorite Duas repository.',
  },
];

export default function IslamicCompanionScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();

  const handleModulePress = (mod: CompanionModule) => {
    if (mod.route) {
      router.push(mod.route as any);
    } else if (mod.alertMsg) {
      Alert.alert(mod.title, mod.alertMsg);
    }
  };

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader
        title="Islamic Companion"
        subtitle="Central Hub for All Sacred Resources"
        leftSlot={
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.6, transform: [{ scale: 0.93 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <AppIcon name="arrow-left" size="lg" variant="onSurface" />
          </Pressable>
        }
      />

      <View style={styles.content}>
        <View style={styles.introBox}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            Explore our complete suite of tools crafted to enrich your daily worship and strengthen your connection with Allah.
          </Text>
        </View>

        <FeatureGrid items={COMPANION_MODULES} onItemPress={handleModulePress} cardMinHeight={155} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  introBox: {
    paddingHorizontal: spacing.sm,
  },
});
