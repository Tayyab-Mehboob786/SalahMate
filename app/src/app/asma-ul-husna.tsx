/**
 * SalahMate — Asma-ul-Husna Module (`/asma-ul-husna`)
 *
 * Dedicated UI placeholder displaying the 99 Beautiful Names of Allah (Asma-ul-Husna)
 * with Arabic calligraphy text, English transliteration, profound spiritual meanings,
 * and live search filtering.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface NameOfAllah {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  reflection: string;
}

const SAMPLE_NAMES: NameOfAllah[] = [
  { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', meaning: 'The Most Beneficent', reflection: 'He whose endless mercy encompasses all creation.' },
  { number: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', meaning: 'The Most Merciful', reflection: 'He who bestows continuous and particular mercy upon the faithful.' },
  { number: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King & Sovereign', reflection: 'The absolute ruler of the heavens and the earth.' },
  { number: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Holy & Pure', reflection: 'Free from any imperfection, error, or shortcoming.' },
  { number: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace', reflection: 'The giver of safety, serenity, and spiritual perfection.' },
  { number: 6, arabic: 'الْمُؤْمِنُ', transliteration: 'Al-Mu’min', meaning: 'The Bestower of Faith', reflection: 'The guardian of security who grants tranquility.' },
  { number: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Protector & Watcher', reflection: 'The vigilant overseeer who watches over every soul.' },
  { number: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The Almighty & Invincible', reflection: 'The triumphant whose authority can never be overcome.' },
  { number: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compelling & Restorer', reflection: 'He who heals the brokenhearted and restores justice.' },
  { number: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme & Majestic', reflection: 'The uniquely transcendent above all worldly pride.' },
  { number: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator of All', reflection: 'The divine originator who brings existence from nothingness.' },
  { number: 12, arabic: 'الْبَارِئُ', transliteration: 'Al-Bari', meaning: 'The Maker of Order', reflection: 'He who evolves all creation in perfect proportion and harmony.' },
  { number: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Supreme Opener', reflection: 'He who opens doors of spiritual enlightenment and sustenance.' },
  { number: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Withholder', reflection: 'He who constricts and releases souls and provisions by wisdom.' },
  { number: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-Azeem', meaning: 'The Magnificent', reflection: 'The infinite being whose grandeur cannot be grasped by human intellect.' },
  { number: 56, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Most Loving', reflection: 'He who loves His righteous servants and inspires love in their hearts.' },
];

export default function AsmaUlHusnaScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = SAMPLE_NAMES.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.arabic.includes(searchQuery)
  );

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Asma-ul-Husna" subtitle="99 Beautiful Names of Allah" showBack />

      <View style={styles.content}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search Name, meaning, or transliteration..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          ) : null}
        </View>

        {/* Spiritual Hero Card */}
        <GlassCard borderRadius={24} contentStyle={styles.heroCard}>
          <MaterialCommunityIcons name="star-crescent" size={32} color={theme.colors.primary} />
          <View style={styles.heroText}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              &ldquo;To Allah belong the best names, so invoke Him by them.&rdquo;
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              Surah Al-A&apos;raf (7:180) · Reflect upon these divine attributes in your daily Salah.
            </Text>
          </View>
        </GlassCard>

        {/* Names Grid/List */}
        <View style={styles.namesList}>
          {filteredNames.map((item) => (
            <GlassCard key={item.number} borderRadius={20} contentStyle={styles.nameCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.numBadge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
                  <Text variant="labelLarge" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
                    #{item.number}
                  </Text>
                </View>
                <Text variant="headlineSmall" style={[styles.arabicText, { color: theme.colors.primary }]}>
                  {item.arabic}
                </Text>
              </View>

              <Text variant="titleLarge" style={[styles.transliteration, { color: theme.colors.onSurface }]}>
                {item.transliteration}
              </Text>
              <Text variant="titleSmall" style={[styles.meaning, { color: theme.colors.primary }]}>
                {item.meaning}
              </Text>
              <Text variant="bodySmall" style={[styles.reflection, { color: theme.colors.onSurfaceVariant }]}>
                {item.reflection}
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
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  heroText: {
    flex: 1,
  },
  namesList: {
    gap: spacing.md,
  },
  nameCard: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  numBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  arabicText: {
    fontWeight: '800',
    fontSize: 26,
  },
  transliteration: {
    fontWeight: '800',
    marginBottom: 2,
  },
  meaning: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  reflection: {
    lineHeight: 20,
  },
});
