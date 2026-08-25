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
          <AppIcon name="arrow-left" size={24} color="#8EDCB8" />
        </Pressable>
        
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Al-Quran
          </Text>
        </View>

        {/* Empty view for flex balance */}
        <View style={{ width: 40, height: 40 }} />
      </View>

      <View style={styles.quoteContainer}>
        <Text variant="titleMedium" style={styles.quote}>
          "The Book in which there is no doubt."
        </Text>
        <Text variant="labelMedium" style={styles.reference}>
          (Baqarah 2:2)
        </Text>
      </View>
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
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    color: '#F5D061',
  },
  quoteContainer: {
    marginTop: 48, // Push quote down
    alignItems: 'center',
  },
  quote: {
    fontWeight: '700',
    textAlign: 'center',
    color: '#F5D061',
    fontFamily: 'serif',
  },
  reference: {
    marginTop: spacing.xs,
    color: '#F5D061',
    opacity: 0.9,
  }
});
