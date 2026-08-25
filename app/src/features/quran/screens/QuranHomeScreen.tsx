import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ScreenContainer, AppIcon } from '@/components';
import { QuranAppBar } from '../components';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';

export const QuranHomeScreen = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();

  const handleStartReading = () => {
    router.push({ pathname: '/quran/browse', params: { tab: 'surahs' } });
  };

  const handleBrowseJuz = () => {
    router.push({ pathname: '/quran/browse', params: { tab: 'juz' } });
  };

  return (
    <ScreenContainer 
      scrollable={false}
      backgroundImage={require('../../../../assets/backgrounds/quran-background.png')}
    >
      <QuranAppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <View style={styles.heroContainer}>
            <View style={styles.mainCard}>
              {/* Quran Logo */}
              <View style={styles.logoContainer}>
                <AppIcon name="book-open-page-variant" size={48} color="#8EDCB8" />
              </View>

              {/* Title & Subtitle */}
              <Text variant="headlineSmall" style={styles.title}>
                Begin Your Quran Journey
              </Text>

              <Text variant="bodyMedium" style={styles.subtitle}>
                Start your Quran journey today and connect with the divine words at your own pace.
              </Text>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && { opacity: 0.8 }
                  ]}
                  onPress={handleStartReading}
                  accessibilityLabel="Browse Surahs"
                  accessibilityRole="button"
                >
                  <AppIcon name="format-list-bulleted" size={24} color="#111" />
                  <Text style={styles.primaryButtonText}>
                    Browse Surahs
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && { opacity: 0.8 }
                  ]}
                  onPress={handleBrowseJuz}
                  accessibilityLabel="Browse Juz"
                  accessibilityRole="button"
                >
                  <AppIcon name="layers-outline" size={24} color="#FFF" />
                  <Text style={styles.secondaryButtonText}>
                    Browse Juz
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Bottom padding for tabs/scroll */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    justifyContent: 'center', // Vertically centers the main card in available space
  },
  heroContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  mainCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(39, 64, 52, 0.6)',
    borderWidth: 1,
    borderColor: '#43775A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8EDCB8',
    height: 56,
    borderRadius: 16,
    gap: spacing.sm,
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    height: 56,
    borderRadius: 16,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
