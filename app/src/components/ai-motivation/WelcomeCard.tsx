import { AppIcon } from '../common/AppIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  const theme = useTheme<SalahMateTheme>();
  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <View style={[styles.card, { padding: spacing.lg, backgroundColor: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderRadius: 16 }]}>
      <Text variant="bodyLarge" style={[styles.greeting, { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }]}>
        {firstName ? `Assalamu Alaikum, ${firstName}` : 'Assalamu Alaikum'}
      </Text>
      
      <Text variant="bodyMedium" style={[styles.description, { color: 'rgba(255,255,255,0.8)' }]}>
        I'm your Islamic Prayer & Spiritual Companion. I can help you with:
      </Text>

      <View style={styles.list}>
        {['Prayer motivation', 'Salah consistency', 'Islamic reminders', 'Spiritual growth', 'Islamic knowledge'].map((item, index) => (
          <View key={index} style={styles.listItem}>
            <AppIcon name="circle-small" size={16} color="#8EDCB8" />
            <Text variant="bodyMedium" style={{ color: '#FFFFFF' }}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <Text variant="bodyMedium" style={[styles.footer, { color: '#8EDCB8', fontWeight: '600' }]}>
        How can I help you today?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.md,
  },
  list: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  footer: {
    marginTop: spacing.sm,
  },
});
