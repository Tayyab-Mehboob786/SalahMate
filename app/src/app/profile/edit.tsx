import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { ScreenContainer, AppIcon } from '@/components';
import { spacing } from '@/theme';
import { useAuth } from '@/hooks/auth/useAuth';
import { usersApi } from '@/api';
import { BlurView } from 'expo-blur';
import { useAvatarUpload } from '@/hooks/profile/useAvatarUpload';
import { API_BASE_URL } from '@/constants/api';
import { Image } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

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

  const handleAvatarUpdated = async (url: string) => {
    setAvatarUrl(url);
    await refreshUser();
  };

  const { pickImage, loading: isUploading } = useAvatarUpload(handleAvatarUpdated);

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

  if (!user) {
    return (
      <ScreenContainer scrollable={false} backgroundImage={require('../../../assets/backgrounds/profile-mosque.png')}>
        <View style={styles.customHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppIcon name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </ScreenContainer>
    );
  }

  const source = avatarUrl 
    ? { uri: avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE_URL}${avatarUrl}` } 
    : undefined;

  const GlassInput = ({ label, value, onChangeText, icon, error, editable = true }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <AppIcon name={icon} size={20} color={editable ? "#FFFFFF" : "rgba(255,255,255,0.5)"} style={styles.inputIcon} />
        <TextInput
          style={[styles.textInput, !editable && { color: "rgba(255,255,255,0.5)" }]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          editable={editable}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <ScreenContainer scrollable={false} backgroundImage={require('../../../assets/backgrounds/profile-mosque.png')}>
      <View style={styles.customHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <AppIcon name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ height: 24 }} />

        {/* Editable Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage} disabled={isUploading || isSaving} style={styles.avatarPressable}>
            <View style={[styles.avatarContainer, (isUploading || isSaving) && { opacity: 0.5 }]}>
              {source ? (
                <Image source={source} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View style={styles.editBadge}>
              <AppIcon name="camera" size={16} color="#FFFFFF" />
            </View>
            {isUploading && (
              <View style={styles.avatarLoadingOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
          </Pressable>
        </View>

        {/* Form Container */}
        <View style={styles.formContainerWrapper}>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.formContainer}>
            <GlassInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              icon="account-circle"
            />
            <View style={styles.divider} />
            <GlassInput
              label="Country"
              value={country}
              onChangeText={setCountry}
              error={errors.country}
              icon="web"
            />
            <View style={styles.divider} />
            <GlassInput
              label="City"
              value={city}
              onChangeText={setCity}
              error={errors.city}
              icon="city-variant"
            />
            <View style={styles.divider} />
            <GlassInput
              label="Timezone"
              value={timezone}
              onChangeText={setTimezone}
              error={errors.timezone}
              icon="clock"
            />
          </View>
        </View>

        <View style={styles.formContainerWrapper}>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.formContainer}>
            <GlassInput
              label="Email Address"
              value={email}
              icon="email"
              editable={false}
            />
            <View style={styles.divider} />
            <GlassInput
              label="Verification Status"
              value={verified ? 'Verified' : 'Unverified'}
              icon={verified ? 'check-decagram' : 'alert-circle'}
              editable={false}
            />
          </View>
        </View>

        {/* Save Button */}
        <Pressable 
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <AppIcon name="content-save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  avatarPressable: {
    position: 'relative',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'serif',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0F5B66',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 60,
  },
  formContainerWrapper: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  formContainer: {
    paddingVertical: 12,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderBottomColor: '#FF5252',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 20,
    marginVertical: 4,
  },
  saveBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5B66', // Dark cyan
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
