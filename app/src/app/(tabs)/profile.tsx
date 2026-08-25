import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon, ScreenContainer } from '@/components';
import { Text } from 'react-native-paper';
import { useAuth } from '@/hooks/auth/useAuth';
import { spacing } from '@/theme';
import { BlurView } from 'expo-blur';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const userName = user?.fullName || 'Tayyab Mehboob';
  const userEmail = user?.email || 'tayyabmeh91@gmail.com';
  const userCountry = user?.country || 'Pakistan';
  const userCity = user?.city || 'Islamabad';
  const userTimezone = user?.timezone || 'UTC+05:00';
  const userTheme = user?.theme || 'System Default';
  const userJoined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'August 2026';
  
  const initials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleEditProfile = () => {
    router.push('/settings');
  };

  const listItems = [
    { icon: 'account-circle', label: 'Full Name', value: userName },
    { icon: 'email', label: 'Email', value: userEmail },
    { icon: 'web', label: 'Country', value: userCountry },
    { icon: 'city-variant', label: 'City', value: userCity },
    { icon: 'clock', label: 'Timezone', value: userTimezone },
    { icon: 'palette', label: 'Theme', value: userTheme },
    { icon: 'calendar-month', label: 'Joined', value: userJoined },
  ];

  return (
    <ScreenContainer 
      scrollable={false} 
      backgroundImage={require('../../../assets/backgrounds/profile-mosque.png')}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Top Spacer for safe area / status bar */}
        <View style={{ height: 60 }} />

        {/* Identity Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.heroName}>{userName}</Text>
          <Text style={styles.heroEmail}>{userEmail}</Text>
        </View>

        {/* Profile Info Glass Container */}
        <View style={styles.infoContainerWrapper}>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.infoContainer}>
            {listItems.map((item, index) => (
              <View key={item.label}>
                <View style={styles.infoRow}>
                  <AppIcon name={item.icon as any} size={28} color="#FFFFFF" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
                  </View>
                </View>
                {index < listItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Edit Profile Button */}
        <Pressable 
          style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
          onPress={handleEditProfile}
        >
          <AppIcon name="square-edit-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </Pressable>

        {/* Bottom Padding for Nav Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'serif',
  },
  heroName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Info List
  infoContainerWrapper: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  infoContainer: {
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  infoIcon: {
    marginRight: 16,
    opacity: 1,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  // Edit Button
  editBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5B66', // Dark cyan as per screenshot
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
