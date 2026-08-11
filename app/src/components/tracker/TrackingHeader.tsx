import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { useRouter } from 'expo-router';

interface TrackingHeaderProps {
  greeting?: string;
  gregorianDate?: string;
  hijriDate?: string;
}

export function TrackingHeader({
  greeting = 'Assalamu Alaikum',
  gregorianDate = 'Mon, 15 Aug',
  hijriDate = '17 Safar, 1445 AH',
}: TrackingHeaderProps) {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={[styles.greeting, { color: theme.colors.onSurface }]}
      >
        {greeting}
      </Text>
      <View style={styles.dateContainer}>
        <Text
          variant="labelLarge"
          style={[styles.dateText, { color: theme.colors.primary }]}
        >
          {gregorianDate}
        </Text>
        <View
          style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]}
        />
        <Text
          variant="labelLarge"
          style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}
        >
          {hijriDate}
        </Text>
      </View>

      <View style={styles.historyBtnContainer}>
        <Pressable 
          onPress={() => router.push('/prayer-history' as any)} 
          style={({ pressed }) => [
            styles.historyBtn,
            { borderColor: theme.colors.outline, borderWidth: 1 },
            pressed && { backgroundColor: theme.colors.surfaceVariant }
          ]}
        >
          <AppIcon name="history" size="sm" variant="primary" />
          <Text variant="labelMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Prayer History
          </Text>
          <AppIcon name="chevron-right" size="sm" color={theme.colors.onSurfaceVariant} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  greeting: {
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateText: {
    fontWeight: '600',
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  historyBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
  },
});
