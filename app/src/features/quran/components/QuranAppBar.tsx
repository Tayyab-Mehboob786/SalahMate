import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const QuranAppBar = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24) }]}>
      <View style={styles.headerRow}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => router.back()}
        >
          <AppIcon name="arrow-left" size={24} color={theme.colors.onBackground} />
        </Pressable>
        
        <View style={styles.titleContainer}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
            📖 Al-Quran
          </Text>
        </View>

        {/* Empty view for flex balance */}
        <View style={styles.backButton} />
      </View>

      <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        "The Book in which there is no doubt."
      </Text>
      <Text variant="labelSmall" style={[styles.reference, { color: theme.colors.onSurfaceVariant }]}>
        (Baqarah 2:2)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  reference: {
    marginTop: 2,
    opacity: 0.7,
  }
});
