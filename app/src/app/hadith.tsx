/**
 * SalahMate — Hadith of the Day Module (`/hadith`)
 *
 * Daily inspirational prophetic traditions featuring a hero Hadith card,
 * authentic narrator attribution, classical source references, interactive
 * bookmarking, and a browsable archive of prophetic wisdom.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface HadithItem {
  id: string;
  narrator: string;
  reference: string;
  text: string;
  reflection: string;
}

const FEATURED_HADITH: HadithItem = {
  id: 'h-today',
  narrator: 'Narrated by Abu Hurairah (RA)',
  reference: 'Sahih al-Bukhari 6463',
  text: '“Take advantage of five things before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.”',
  reflection: 'Every moment in our earthly life is a trust from Allah. Build consistency in your daily Salah and spiritual habits today before opportunities slip away.',
};

const HADITH_ARCHIVE: HadithItem[] = [
  {
    id: 'h-1',
    narrator: 'Narrated by Umar bin Al-Khattab (RA)',
    reference: 'Sahih al-Bukhari 1 & Sahih Muslim 1907',
    text: '“Actions are judged according to intentions, and every person will get the reward according to what they intended.”',
    reflection: 'Renew your intention (Niyyah) before every prayer to ensure your heart is purely focused on seeking the pleasure of Allah.',
  },
  {
    id: 'h-2',
    narrator: 'Narrated by Aisha (RA)',
    reference: 'Sahih al-Bukhari 6465',
    text: '“The most beloved deeds to Allah are those that are done consistently, even if they are small.”',
    reflection: 'Consistency in Salah is far superior to occasional bursts of worship. Never miss an obligatory prayer, even during busy days.',
  },
  {
    id: 'h-3',
    narrator: 'Narrated by Anas bin Malik (RA)',
    reference: 'Sahih Muslim 2699',
    text: '“Allah is more pleased with the repentance of His servant than one of you who suddenly finds their lost camel in the barren desert.”',
    reflection: 'No matter how many times you stumble, turn back to Allah immediately through Istighfar and Salah.',
  },
];

export default function HadithScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({ 'h-today': true });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Hadith of the Day" subtitle="Prophetic Traditions & Wisdom" showBack />

      <View style={styles.content}>
        {/* Featured Hadith Hero Card */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          TODAY&apos;S PROPHETIC INSPIRATION
        </Text>
        <GlassCard borderRadius={24} contentStyle={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.badge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <AppIcon name="format-quote-close" size={18} variant="primary" />
              <Text variant="labelMedium" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                FEATURED HADITH
              </Text>
            </View>
            <Pressable
              style={[
                styles.bookmarkBtn,
                { backgroundColor: bookmarkedIds[FEATURED_HADITH.id] ? (theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8') : theme.colors.surface },
              ]}
              onPress={() => toggleBookmark(FEATURED_HADITH.id)}
            >
              <AppIcon
                name={bookmarkedIds[FEATURED_HADITH.id] ? 'bookmark-check' : 'bookmark-outline'}
                size={22}
                color={bookmarkedIds[FEATURED_HADITH.id] ? theme.colors.iconPrimary : theme.colors.iconSecondary}
              />
            </Pressable>
          </View>

          <Text variant="titleMedium" style={[styles.hadithText, { color: theme.colors.onSurface }]}>
            {FEATURED_HADITH.text}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.attributionRow}>
            <View style={styles.narratorInfo}>
              <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                {FEATURED_HADITH.narrator}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {FEATURED_HADITH.reference}
              </Text>
            </View>
          </View>

          <View style={[styles.reflectionBox, { backgroundColor: theme.colors.surface }]}>
            <AppIcon name="lightbulb-on-outline" size="md" variant="primary" />
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginBottom: 2 }}>
                SPIRITUAL REFLECTION
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 18 }}>
                {FEATURED_HADITH.reflection}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Prophetic Wisdom Archive */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          RECENT DAILY HADITHS
        </Text>
        <View style={styles.archiveList}>
          {HADITH_ARCHIVE.map((hadith) => {
            const isBookmarked = bookmarkedIds[hadith.id];
            return (
              <GlassCard key={hadith.id} borderRadius={20} contentStyle={styles.archiveCard}>
                <View style={styles.archiveHeader}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
                    {hadith.reference}
                  </Text>
                  <Pressable onPress={() => toggleBookmark(hadith.id)}>
                    <AppIcon
                      name={isBookmarked ? 'bookmark-check' : 'bookmark-outline'}
                      size="md"
                      color={isBookmarked ? theme.colors.iconPrimary : theme.colors.iconSecondary}
                    />
                  </Pressable>
                </View>

                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginVertical: 6 }}>
                  {hadith.text}
                </Text>

                <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  {hadith.narrator}
                </Text>
              </GlassCard>
            );
          })}
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
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginLeft: spacing.xs,
  },
  heroCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bookmarkBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hadithText: {
    fontWeight: '700',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  attributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  narratorInfo: {
    gap: 2,
  },
  reflectionBox: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.sm,
  },
  archiveList: {
    gap: spacing.md,
  },
  archiveCard: {
    padding: spacing.md,
  },
  archiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
