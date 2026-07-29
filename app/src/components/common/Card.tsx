/**
 * SalahMate Card Component
 *
 * Container component wrapping React Native Paper's `Card` (`mode="elevated" | "outlined" | "contained"`).
 * Standardizes prayer tracking widgets, dashboard summaries, and structured content display.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness (`surface` and `outline` colors)
 * - Accessibility (`accessibilityRole="button"` when interactive, or `"summary"` for static containers)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import type { CardProps as PaperCardProps } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface CardProps extends Omit<PaperCardProps, 'theme' | 'children' | 'mode'> {
  /** Optional header title for the card */
  title?: string;
  /** Optional secondary subtitle text */
  subtitle?: string;
  /** Optional component rendered on the left side of the title (e.g. Avatar or Icon) */
  left?: (props: { size: number }) => React.ReactNode;
  /** Card body content */
  children?: React.ReactNode;
  /** Optional footer action buttons */
  actions?: React.ReactNode;
  /** Visual presentation mode */
  mode?: 'elevated' | 'outlined' | 'contained';
  /** Card shadow elevation tier (only applicable when `mode="elevated"`) */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Tap interaction callback */
  onPress?: () => void;
  /** Custom container styling */
  style?: StyleProp<ViewStyle>;
  /** Custom internal card content container styling */
  contentStyle?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  left,
  children,
  actions,
  mode = 'elevated',
  elevation = 1,
  onPress,
  style,
  contentStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const theme = useTheme<SalahMateTheme>();

  const paperProps = mode === 'elevated' ? { mode: 'elevated' as const, elevation } : { mode };

  return (
    <PaperCard
      {...paperProps}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor:
            mode === 'contained' ? theme.colors.surfaceVariant : theme.colors.surface,
          borderColor: theme.colors.outline,
          borderRadius: theme.roundness * 3, // Standard 12px MD3 card rounding
        },
        style,
      ]}
      contentStyle={[styles.content, contentStyle]}
      accessible
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={accessibilityLabel ?? title ?? 'Card Container'}
      accessibilityHint={accessibilityHint}
      {...rest}
    >
      {title || subtitle || left ? (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          left={left}
          titleStyle={{ color: theme.colors.onSurface, fontWeight: '700' }}
          subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        />
      ) : null}

      {children ? <PaperCard.Content style={styles.body}>{children}</PaperCard.Content> : null}

      {actions ? <PaperCard.Actions style={styles.actions}>{actions}</PaperCard.Actions> : null}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    paddingVertical: spacing.xs,
  },
  body: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  actions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});
