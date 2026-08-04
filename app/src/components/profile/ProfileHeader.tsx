import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassAvatar } from '@/components/glass/GlassAvatar';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { API_BASE_URL } from '@/constants/api';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ fullName, email, avatarUrl }) => {
  const theme = useTheme<SalahMateTheme>();
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const source = avatarUrl 
    ? { uri: avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE_URL}${avatarUrl}` } 
    : undefined;

  return (
    <View style={styles.container}>
      <GlassAvatar initials={initials} source={source} size={100} style={styles.avatar} />
      <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>
        {fullName}
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  name: {
    fontWeight: '700',
    marginBottom: 4,
  },
});
