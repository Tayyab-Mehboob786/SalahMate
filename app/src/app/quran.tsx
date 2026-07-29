/**
 * SalahMate — Holy Quran Companion Module (`/quran`)
 *
 * Comprehensive UI placeholder featuring Surah search, reading progress tracking,
 * recently read bookmarks, favorite verses, and a structured Surah directory.
 */

import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ProgressRing, ScreenContainer, QuranSkeleton } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface SurahItem {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  verses: number;
  type: 'Makki' | 'Madani';
}

const SAMPLE_SURAHS: SurahItem[] = [
  { number: 1, name: 'Al-Fatiha', arabicName: 'الفاتحة', translation: 'The Opening', verses: 7, type: 'Makki' },
  { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', translation: 'The Cow', verses: 286, type: 'Madani' },
  { number: 36, name: 'Yasin', arabicName: 'يس', translation: 'Ya-Sin', verses: 83, type: 'Makki' },
  { number: 55, name: 'Ar-Rahman', arabicName: 'الرحمن', translation: 'The Beneficent', verses: 78, type: 'Madani' },
  { number: 67, name: 'Al-Mulk', arabicName: 'الملك', translation: 'The Sovereignty', verses: 30, type: 'Makki' },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', translation: 'The Sincerity', verses: 4, type: 'Makki' },
  { number: 113, name: 'Al-Falaq', arabicName: 'الفلق', translation: 'The Daybreak', verses: 5, type: 'Makki' },
  { number: 114, name: 'An-Nas', arabicName: 'الناس', translation: 'Mankind', verses: 6, type: 'Makki' },
];

export default function QuranScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'surahs' | 'favorites'>('surahs');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSurahs = SAMPLE_SURAHS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery)
  );

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Holy Quran" subtitle="114 Surahs & Daily Reflections" showBack />

      {isLoading ? (
        <QuranSkeleton />
      ) : (
      <View style={styles.content}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <AppIcon name="magnify" size={22} variant="secondary" />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search Surah, translation, or Ayah..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <AppIcon name="close-circle" size="md" variant="secondary" />
            </Pressable>
          ) : null}
        </View>

        {/* Continue Reading Card */}
        <GlassCard borderRadius={24} contentStyle={styles.continueCard}>
          <View style={styles.continueHeader}>
            <View style={styles.badgeBox}>
              <AppIcon name="book-open-page-variant" size="sm" variant="primary" />
              <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                CONTINUE READING
              </Text>
            </View>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Juz 29 · Page 562
            </Text>
          </View>

          <View style={styles.continueBody}>
            <View style={styles.continueInfo}>
              <Text variant="headlineSmall" style={[styles.surahTitle, { color: theme.colors.onSurface }]}>
                Surah Al-Mulk
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.xs }}>
                Ayah 14 of 30 · The Sovereignty
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: '46%' }]} />
              </View>
            </View>
            <ProgressRing progress={0.46} size={76} strokeWidth={8} valueText="46%" labelText="Completed" />
          </View>
        </GlassCard>

        {/* Recently Read & Favorites Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[
              styles.tabBtn,
              activeTab === 'surahs' && { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8' },
            ]}
            onPress={() => setActiveTab('surahs')}
          >
            <Text
              variant="labelLarge"
              style={{
                color: activeTab === 'surahs' ? (theme.dark ? '#7FC8E8' : '#145874') : theme.colors.onSurfaceVariant,
                fontWeight: '700',
              }}
            >
              All Surahs (114)
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabBtn,
              activeTab === 'favorites' && { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8' },
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text
              variant="labelLarge"
              style={{
                color: activeTab === 'favorites' ? (theme.dark ? '#7FC8E8' : '#145874') : theme.colors.onSurfaceVariant,
                fontWeight: '700',
              }}
            >
              Favorites (12)
            </Text>
          </Pressable>
        </View>

        {activeTab === 'surahs' ? (
          <View style={styles.surahList}>
            {filteredSurahs.map((surah) => (
              <GlassCard key={surah.number} borderRadius={18} contentStyle={styles.surahRow}>
                <View style={styles.surahLeft}>
                  <View style={[styles.surahNumBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
                    <Text variant="labelMedium" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                      {surah.number}
                    </Text>
                  </View>
                  <View>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                      {surah.name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {surah.translation} · {surah.verses} Verses ({surah.type})
                    </Text>
                  </View>
                </View>
                <View style={styles.surahRight}>
                  <Text variant="headlineSmall" style={[styles.arabicText, { color: theme.colors.primary }]}>
                    {surah.arabicName}
                  </Text>
                </View>
              </GlassCard>
            ))}
          </View>
        ) : (
          <GlassCard borderRadius={20} contentStyle={styles.favoritesEmpty}>
            <AppIcon name="book-heart-outline" size={48} variant="primary" />
            <Text variant="titleMedium" style={[styles.favTitle, { color: theme.colors.onSurface }]}>
              Saved Quranic Verses
            </Text>
            <Text variant="bodyMedium" style={[styles.favDesc, { color: theme.colors.onSurfaceVariant }]}>
              Tap the bookmark icon while reading any Ayah to save your favorite spiritual reflections right here.
            </Text>
          </GlassCard>
        )}

        {/* Recently Read Footer Section */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          RECENTLY READ
        </Text>
        <GlassCard borderRadius={18} contentStyle={styles.recentCard}>
          <AppIcon name="history" size="lg" variant="primary" />
          <View style={styles.recentInfo}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              Surah Ar-Rahman (Ayah 1 - 25)
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Read yesterday afternoon · 12 minutes session
            </Text>
          </View>
          <AppIcon name="chevron-right" size="lg" variant="secondary" />
        </GlassCard>
      </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  continueCard: {
    padding: spacing.xl,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 166, 154, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  continueBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  surahTitle: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  surahList: {
    gap: spacing.sm,
  },
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  surahNumBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahRight: {
    paddingLeft: spacing.md,
  },
  arabicText: {
    fontFamily: 'sans-serif',
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  favoritesEmpty: {
    padding: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  favTitle: {
    fontWeight: '700',
  },
  favDesc: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
