import { AppIcon } from '@/components/common/AppIcon';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { spacing } from '@/theme';

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Quran' | 'Prayer' | 'Adhkar' | 'Learning' | 'Custom';
  icon: string;
  prayerTarget?: 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA';
  defaultTotalUnits?: number;
  defaultUnitLabel?: string;
  defaultDurationDays?: number;
}

interface GoalTemplateCardProps {
  template: GoalTemplate;
  onPress: (template: GoalTemplate) => void;
}

export const GoalTemplateCard: React.FC<GoalTemplateCardProps> = ({ template, onPress }) => {

  return (
    <Pressable onPress={() => onPress(template)} style={({ pressed }: { pressed: boolean }) => [styles.cardWrapper, pressed && { opacity: 0.8 }]}>
      <BlurView intensity={25} tint="light" style={styles.card}>
        <View style={styles.content}>
          <View style={styles.iconBox}>
            <AppIcon 
              name={template.icon as any} 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {template.title}
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              {template.description}
            </Text>
          </View>
          <AppIcon name="chevron-right" size={24} color="#CBD5E1" />
        </View>
      </BlurView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    padding: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#FFFFFF',
  },
  description: {
    color: '#E2E8F0',
  },
});
