import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/common/Card';
import { ProfileItem } from './ProfileItem';
import { spacing } from '@/theme';

interface ProfileInfoCardProps {
  fullName: string;
  email: string;
  country: string;
  city: string;
  timezone: string;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ fullName, email, country, city, timezone }) => {
  return (
    <Card mode="elevated" elevation={1} style={styles.card}>
      <View style={styles.content}>
        <ProfileItem icon="account-outline" label="Full Name" value={fullName} />
        <ProfileItem icon="email-outline" label="Email" value={email} />
        <ProfileItem icon="earth" label="Country" value={country} />
        <ProfileItem icon="city-variant-outline" label="City" value={city} />
        <ProfileItem icon="clock-outline" label="Timezone" value={timezone} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  content: {
    padding: spacing.sm,
  },
});
