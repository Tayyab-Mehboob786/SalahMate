import { AppIcon } from '../common/AppIcon';
import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface Suggestion {
  id: string;
  text: string;
  icon: string;
}

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

const Chip: React.FC<{ suggestion: Suggestion; onSelect: (text: string) => void; index: number }> = ({ suggestion, onSelect, index }) => {
  const theme = useTheme<SalahMateTheme>();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(300)}>
      <Pressable
        onPress={() => onSelect(suggestion.text)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View 
          style={[
            styles.chip, 
            animatedStyle, 
            { 
              backgroundColor: theme.colors.surfaceVariant,
              borderColor: theme.colors.outlineVariant,
            }
          ]}
        >
          <AppIcon name={suggestion.icon as any} size={16} color={theme.colors.primary} style={styles.icon} />
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {suggestion.text}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
        Suggested Questions
      </Text>
      <View style={styles.chipsWrapper}>
        {suggestions.map((suggestion, index) => (
          <Chip key={suggestion.id} suggestion={suggestion} onSelect={onSelect} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: '600',
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: {
    marginRight: spacing.xs,
  },
});
