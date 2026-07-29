import { AppIcon } from '@/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface WelcomeCardProps {
  userName: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName }) => {
  const theme = useTheme<SalahMateTheme>();
  const firstName = userName.split(' ')[0] || 'Friend';

  return (
    <GlassCard style={[styles.card, { padding: spacing.lg }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <AppIcon name="robot" size={24} color={theme.colors.onPrimaryContainer} />
        </View>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}>
          SalahMate AI
        </Text>
      </View>

      <Text variant="bodyLarge" style={[styles.greeting, { color: theme.colors.onSurface }]}>
        Assalamu Alaikum, {firstName} 👋
      </Text>
      
      <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        I'm your Islamic Prayer & Spiritual Companion. I can help you with:
      </Text>

      <View style={styles.list}>
        {['Prayer motivation', 'Salah consistency', 'Daily duas', 'Islamic reminders', 'Spiritual growth', 'Islamic knowledge'].map((item, index) => (
          <View key={index} style={styles.listItem}>
            <AppIcon name="circle-small" size={16} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <Text variant="bodyMedium" style={[styles.footer, { color: theme.colors.primary, fontWeight: '600' }]}>
        How can I help you today?
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: '700',
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
