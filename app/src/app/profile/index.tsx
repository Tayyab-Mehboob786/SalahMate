import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { ScreenContainer, PrimaryButton, Card, GlassHeader } from '@/components';
import { ProfileHeader, ProfileInfoCard, ProfileItem } from '@/components/profile';
import { spacing } from '@/theme';
import { useAuth } from '@/hooks/auth/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setIsRefreshing(false);
  };

  if (!user) {
    return (
      <ScreenContainer scrollable withPadding>
        <GlassHeader title="Profile" showBack />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  const joinedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown';

  const displayTheme = user.theme 
    ? user.theme.charAt(0).toUpperCase() + user.theme.slice(1).toLowerCase()
    : 'System';

  return (
    <ScreenContainer scrollable withPadding>
      <GlassHeader title="Profile" showBack />
      
      <View style={styles.container}>
        <ProfileHeader 
          fullName={user.fullName} 
          email={user.email} 
          avatarUrl={user.avatar} 
        />

        <ProfileInfoCard 
          fullName={user.fullName}
          email={user.email}
          country={user.country}
          city={user.city}
          timezone={user.timezone}
        />

        <Card mode="elevated" elevation={1} style={styles.card}>
          <View style={styles.cardContent}>
            <ProfileItem icon="theme-light-dark" label="Theme" value={displayTheme} />
          </View>
        </Card>

        <Card mode="elevated" elevation={1} style={styles.card}>
          <View style={styles.cardContent}>
            <ProfileItem icon="calendar-check" label="Joined" value={joinedDate} />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            label="Edit Profile" 
            icon="pencil" 
            fullWidth 
            onPress={() => router.push('/profile/edit' as any)} 
          />
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
  card: {
    marginBottom: spacing.md,
  },
  cardContent: {
    padding: spacing.sm,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
