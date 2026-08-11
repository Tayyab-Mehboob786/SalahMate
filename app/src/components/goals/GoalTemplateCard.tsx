import { AppIcon } from '@/components/common/AppIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Quran' | 'Prayer' | 'Adhkar' | 'Learning' | 'Custom';
  icon: string;
  defaultTotalUnits?: number;
  defaultUnitLabel?: string;
  defaultDurationDays?: number;
}

interface GoalTemplateCardProps {
  template: GoalTemplate;
  onPress: (template: GoalTemplate) => void;
}

export const GoalTemplateCard: React.FC<GoalTemplateCardProps> = ({ template, onPress }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <GlassCard 
      borderRadius={16} 
      style={styles.card} 
      onPress={() => onPress(template)}
    >
      <View style={styles.content}>
        <View style={[styles.iconBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
          <AppIcon 
            name={template.icon as any} 
            size={24} 
            color={theme.dark ? '#7FC8E8' : '#145874'} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {template.title}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {template.description}
          </Text>
        </View>
        <AppIcon name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
});
