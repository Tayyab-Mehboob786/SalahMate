import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { ScreenContainer, GlassHeader, Card } from '@/components';
import { ProfileInput, ReadOnlyField, SaveButton, EditableAvatar } from '@/components/profile';
import { spacing } from '@/theme';
import { useAuth } from '@/hooks/auth/useAuth';
import { usersApi } from '@/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const theme = useTheme();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [country, setCountry] = useState(user?.country || '');
  const [city, setCity] = useState(user?.city || '');
  const [timezone, setTimezone] = useState(user?.timezone || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setCountry(user.country || '');
      setCity(user.city || '');
      setTimezone(user.timezone || '');
      setAvatarUrl(user.avatar || null);
    }
  }, [user]);

  const email = user?.email || '';
  const verified = user?.isEmailVerified ?? true;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters.';
    }
    if (!country.trim()) {
      newErrors.country = 'Country is required.';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!timezone.trim()) {
      newErrors.timezone = 'Timezone is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSaving(true);
      try {
        await usersApi.updateProfile({ fullName, country, city, timezone });
        await refreshUser();
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAvatarUpdated = async (url: string) => {
    setAvatarUrl(url);
    await refreshUser();
  };

  if (!user) {
    return (
      <ScreenContainer scrollable withPadding>
        <GlassHeader title="Edit Profile" showBack />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable withPadding>
      <GlassHeader title="Edit Profile" showBack />

      <View style={styles.container}>
        <View style={styles.avatarSection}>
          <EditableAvatar 
            initials={initials || 'U'} 
            avatarUrl={avatarUrl} 
            onAvatarUpdated={handleAvatarUpdated} 
            size={100} 
          />
        </View>

        <Card mode="elevated" elevation={1} style={styles.card}>
          <View style={styles.cardContent}>
            <ProfileInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              icon="account-outline"
            />
            <ProfileInput
              label="Country"
              value={country}
              onChangeText={setCountry}
              error={errors.country}
              icon="earth"
            />
            <ProfileInput
              label="City"
              value={city}
              onChangeText={setCity}
              error={errors.city}
              icon="city-variant-outline"
            />
            <ProfileInput
              label="Timezone"
              value={timezone}
              onChangeText={setTimezone}
              error={errors.timezone}
              icon="clock-outline"
            />
          </View>
        </Card>

        <Card mode="elevated" elevation={1} style={styles.card}>
          <View style={styles.cardContent}>
            <ReadOnlyField label="Email Address" value={email} icon="email-outline" />
            <ReadOnlyField label="Verification Status" value={verified ? 'Verified' : 'Unverified'} icon={verified ? 'check-decagram' : 'alert-circle-outline'} />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <SaveButton onPress={handleSave} loading={isSaving} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardContent: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
