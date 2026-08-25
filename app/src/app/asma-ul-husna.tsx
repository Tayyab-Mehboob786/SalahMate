import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AppIcon, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ASMA_UL_HUSNA, AsmaUlHusna } from '../data/asma-ul-husna';

export default function AsmaUlHusnaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = ASMA_UL_HUSNA.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.arabic.includes(searchQuery) ||
      n.id.toString() === searchQuery
  );

  const renderItem = ({ item }: { item: AsmaUlHusna }) => (
    <BlurView intensity={25} tint="light" style={styles.nameCard}>
      <View style={styles.cardContent}>
        <View style={styles.leftColumn}>
          <View style={styles.titleRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.id}</Text>
            </View>
            <Text style={styles.transliterationText}>{item.transliteration}</Text>
          </View>
          <Text style={styles.meaningText}>{item.englishMeaning}</Text>
          {item.description && <Text style={styles.reflectionText}>{item.description}</Text>}
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.arabicText}>{item.arabic}</Text>
        </View>
      </View>
    </BlurView>
  );

  return (
    <ScreenContainer 
      backgroundImage={require('../../assets/backgrounds/asma-mosque.png')} 
      withGlassGradient={false}
      style={{ backgroundColor: 'transparent' }}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <AppIcon name="chevron-left" size={32} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerTitles}>
            <Text variant="titleLarge" style={styles.headerTitle}>Asma-ul-Husna</Text>
            <Text variant="labelMedium" style={styles.headerSubtitle}>99 Beautiful Names of Allah</Text>
          </View>
          <View style={styles.iconBtn} />
        </View>

        <FlatList
          data={filteredNames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Search Bar */}
              <BlurView intensity={30} tint="light" style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={24} color="rgba(255,255,255,0.8)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Name, meaning, or..."
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <Pressable onPress={() => setSearchQuery('')}>
                    <MaterialCommunityIcons name="close-circle" size={20} color="rgba(255,255,255,0.8)" />
                  </Pressable>
                ) : null}
              </BlurView>

              {/* Hero Card */}
              <BlurView intensity={25} tint="light" style={styles.heroCard}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>
                    To Allah belong the best names, so invoke Him by them.
                  </Text>
                  <Text style={styles.heroSubtitle}>
                    Surah Al-A'raf (7:180) • Reflect upon these divine attributes in your daily Salah.
                  </Text>
                </View>
              </BlurView>
            </>
          }
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 20, 15, 0.40)', // Warm, subtle dark overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  heroCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroTextContainer: {
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  nameCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  transliterationText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    flexShrink: 1,
  },
  meaningText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
  },
  reflectionText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  rightColumn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: '45%',
  },
  arabicText: {
    color: '#047857', // Deep Emerald / Teal
    fontSize: 34,
    lineHeight: 52, // Fixed cutting off issue
    paddingTop: 8, // Added padding to compensate for diacritics
    fontWeight: '800',
    textAlign: 'right',
  },
});
