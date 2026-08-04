import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';

interface MotivationMessageProps {
  message: string;
  color?: string;
}

export function MotivationMessage({ message, color }: MotivationMessageProps) {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      <Text
        variant="labelMedium"
        style={[
          styles.text,
          { color: color || theme.colors.primary },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
