import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ScreenContainer, GlassCard, AppIcon } from '@/components';
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
    <ScreenContainer scrollable={false}>
      <QuranAppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <View style={styles.heroContainer}>
            <GlassCard contentStyle={styles.heroCard}>

              {/* Quran Logo */}
              <View style={styles.logoContainer}>
                <AppIcon name="book-open-page-variant" size={64} color={theme.colors.primary} />
              </View>

              {/* Title & Subtitle */}
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                Begin Your Quran Journey
              </Text>

              <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Start your Quran journey...
              </Text>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleStartReading}
                  accessibilityLabel="Start Reading"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
                    Browse Surahs
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.secondaryButton,
                    { borderColor: theme.colors.outline, backgroundColor: 'transparent' }
                  ]}
                  onPress={handleBrowseJuz}
                  accessibilityLabel="Browse Juz"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, { color: theme.colors.onSurface }]}>
                    Browse Juz
                  </Text>
                </Pressable>
              </View>

            </GlassCard>
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
  heroCard: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    minWidth: 130,
    maxWidth: 160,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    flex: 1,
    minWidth: 120,
    maxWidth: 145,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  }
});
