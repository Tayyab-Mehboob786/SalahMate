/**
 * SalahMate SectionHeader Component
 *
 * Structural divider component separating distinct sections on dashboards and lists.
 * Supports optional right-side action triggers (e.g., "See All" or "Edit").
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness
 * - Accessibility (`accessibilityRole="header"`, clear action labeling)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface SectionHeaderProps {
  /** Main section heading text */
  title: string;
  /** Optional supporting subtitle beneath the title */
  subtitle?: string;
  /** Text for the optional right-aligned action link */
  actionLabel?: string;
  /** Handler invoked when the action link is tapped */
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer} accessible accessibilityRole="header">
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodySmall"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Button
          mode="text"
          onPress={onActionPress}
          compact
          textColor={theme.colors.primary}
          style={styles.actionButton}
          contentStyle={styles.actionContent}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} for ${title}`}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
  },
  actionButton: {
    marginLeft: spacing.sm,
  },
  actionContent: {
    minHeight: spacing.xl, // Ensures clean tap target while maintaining compact alignment
  },
});
