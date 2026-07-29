/**
 * SalahMate EmptyState Component
 *
 * Feedback component displaying structured guidance when lists or features have no data.
 * Supports custom illustration/icon rendering alongside actionable call-to-action buttons.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness (`onSurface` and `onSurfaceVariant` text tones)
 * - Accessibility (`accessibilityRole="summary"`, distinct button labels)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

import { Avatar } from '@/components/common/Avatar';

export interface EmptyStateProps {
  /** Main heading explaining the empty condition */
  title: string;
  /** Detailed subtitle providing actionable context or instructions */
  description?: string;
  /** Optional visual element or icon name (e.g. "calendar-blank-outline" or custom node) */
  icon?: React.ReactNode | string;
  /** Label for the optional recovery action button */
  actionLabel?: string;
  /** Handler triggered when the action button is pressed */
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'calendar-check-outline',
  actionLabel,
  onActionPress,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <Avatar
          mode="icon"
          icon={icon}
          size={72}
          backgroundColor={theme.colors.primaryContainer}
          color={theme.colors.primary}
        />
      );
    }
    return icon;
  };

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${description ?? ''}`}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>

      {description ? (
        <Text
          variant="bodyMedium"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {description}
        </Text>
      ) : null}

      {actionLabel && onActionPress ? (
        <View style={styles.actionContainer}>
          <PrimaryButton label={actionLabel} onPress={onActionPress} icon="arrow-right" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  actionContainer: {
    minWidth: 160,
  },
});
