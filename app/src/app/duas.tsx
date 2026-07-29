/**
 * SalahMate — Daily Duas Module (`/duas`)
 *
 * Curated Islamic supplication library organized into daily living categories:
 * Morning, Evening, Travel, Eating, and Sleeping, featuring Arabic text,
 * English translation, transliteration, and instant search capabilities.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface DuaItem {
  id: string;
  category: 'Morning' | 'Evening' | 'Travel' | 'Eating' | 'Sleeping';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

const CATEGORIES: ('All' | 'Morning' | 'Evening' | 'Travel' | 'Eating' | 'Sleeping')[] = [
  'All',
  'Morning',
  'Evening',
  'Travel',
  'Eating',
  'Sleeping',
];

const SAMPLE_DUAS: DuaItem[] = [
  {
    id: 'm-1',
    category: 'Morning',
    title: 'Supplication for Morning Barakah',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaykan-nushur.',
    translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
    reference: 'Jami` at-Tirmidhi 3391',
  },
  {
    id: 'e-1',
    category: 'Evening',
    title: 'Supplication for Evening Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A’udhu bi kalimatillahit-tammati min sharri ma khalaq.',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    reference: 'Sahih Muslim 2708',
  },
  {
    id: 't-1',
    category: 'Travel',
    title: 'Supplication Before Commencing a Journey',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.',
    translation: 'Glory to Him Who has subjected this to us, and we could never have had it by our efforts, and to our Lord we shall surely return.',
    reference: 'Surah Az-Zukhruf (43:13-14)',
  },
  {
    id: 'eat-1',
    category: 'Eating',
    title: 'Dua Before and After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdu lillahil-ladhi at’amana wa saqana wa ja’alana muslimin.',
    translation: 'All praise is due to Allah who has fed us, provided us with drink, and made us among those who submit.',
    reference: 'Sunan Abi Dawud 3850',
  },
  {
    id: 's-1',
    category: 'Sleeping',
    title: 'Bedtime Remembrance & Protection',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya.',
    translation: 'In Your Name, O Allah, I die and I live (sleep and wake).',
    reference: 'Sahih al-Bukhari 6324',
  },
];

export default function DuasScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Morning' | 'Evening' | 'Travel' | 'Eating' | 'Sleeping'>('All');

  const filteredDuas = SAMPLE_DUAS.filter((dua) => {
    const matchesCategory = activeCategory === 'All' || dua.category === activeCategory;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.arabic.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Daily Duas" subtitle="Authentic Supplications & Dhikr" showBack />

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
            placeholder="Search Dua, topic, or translation..."
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

        {/* Categories Selector */}
        <View style={styles.categorySelector}>
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  variant="labelMedium"
                  style={{
                    color: isSelected ? theme.colors.textOnPrimary : theme.colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Duas Cards List */}
        <View style={styles.duasList}>
          {filteredDuas.map((dua) => (
            <GlassCard key={dua.id} borderRadius={22} contentStyle={styles.duaCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.catBadge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
                  <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                    {dua.category.toUpperCase()}
                  </Text>
                </View>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {dua.reference}
                </Text>
              </View>

              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: 4 }}>
                {dua.title}
              </Text>

              <Text variant="headlineSmall" style={[styles.arabicText, { color: theme.colors.primary }]}>
                {dua.arabic}
              </Text>

              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
                {dua.transliteration}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {dua.translation}
              </Text>
            </GlassCard>
          ))}
        </View>
      </View>
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
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  duasList: {
    gap: spacing.md,
  },
  duaCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  arabicText: {
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 36,
    marginVertical: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
});
