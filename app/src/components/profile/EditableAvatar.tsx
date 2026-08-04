import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { GlassAvatar } from '@/components/glass/GlassAvatar';
import { useAvatarUpload } from '@/hooks/profile/useAvatarUpload';
import type { SalahMateTheme } from '@/theme';
import { API_BASE_URL } from '@/constants/api';

interface EditableAvatarProps {
  initials: string;
  avatarUrl?: string | null;
  onAvatarUpdated?: (newUrl: string) => void;
  size?: number;
}

export const EditableAvatar: React.FC<EditableAvatarProps> = ({ initials, avatarUrl, onAvatarUpdated, size = 100 }) => {
  const theme = useTheme<SalahMateTheme>();
  const { pickImage, loading } = useAvatarUpload(onAvatarUpdated);

  // Parse backend URL correctly if needed
  const source = avatarUrl 
    ? { uri: avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE_URL}${avatarUrl}` } 
    : undefined;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} disabled={loading} activeOpacity={0.8}>
        <View style={{ opacity: loading ? 0.5 : 1 }}>
          <GlassAvatar initials={initials} source={source} size={size} />
        </View>

        <View style={[styles.editBadge, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
          <AppIcon name="camera-outline" size={16} color={theme.colors.onPrimary} />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  loadingOverlay: {
    ...(StyleSheet.absoluteFill as any),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
