/**
 * SalahMate Modal Component
 *
 * Overlay dialog component wrapping React Native Paper's `Portal` and `Modal`.
 * Standardizes confirmations, settings overlays, and detail popups with MD3 surface elevation.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`, `Portal`)
 * - Light and Dark theme responsiveness (`surface` container adaptation)
 * - Accessibility (`accessibilityViewIsModal={true}`, `accessibilityRole="dialog"`)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Modal as PaperModal, Portal, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface ModalProps {
  /** Whether the modal is currently open and visible */
  visible: boolean;
  /** Handler invoked when the user taps outside or presses back (`ESC`) */
  onDismiss: () => void;
  /** Optional dialog heading title */
  title?: string;
  /** Dialog body content */
  children: React.ReactNode;
  /** Optional bottom action buttons container */
  actions?: React.ReactNode;
  /** Whether tapping the backdrop closes the modal (defaults to `true`) */
  dismissable?: boolean;
  /** Custom inner container styles */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Accessibility label describing the dialog */
  accessibilityLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onDismiss,
  title,
  children,
  actions,
  dismissable = true,
  contentContainerStyle,
  accessibilityLabel,
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        dismissable={dismissable}
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.roundness * 4, // 16px bottom sheet / modal rounding
            borderColor: theme.colors.outlineVariant,
          },
          contentContainerStyle,
        ]}
      >
        <View
          accessible
          accessibilityViewIsModal
          accessibilityRole="alert"
          accessibilityLabel={accessibilityLabel ?? title ?? 'Application Modal'}
        >
          {title ? (
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
              {title}
            </Text>
          ) : null}

          <View style={styles.body}>{children}</View>

          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      </PaperModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    elevation: 5,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  body: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
