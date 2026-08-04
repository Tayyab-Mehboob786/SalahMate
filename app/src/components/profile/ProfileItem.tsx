import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ProfileItemProps {
  icon: string;
  label: string;
  value: string;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value }) => {
  const theme = useTheme<SalahMateTheme>();
  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.left}>
        <AppIcon name={icon as any} size="md" variant="primary" />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {label}
        </Text>
      </View>
      <Text variant="bodyMedium" style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    fontWeight: '600',
  },
});
