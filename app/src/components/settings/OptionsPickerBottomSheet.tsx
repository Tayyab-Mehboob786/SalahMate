import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassBottomSheet } from '@/components/glass';
import { AppIcon } from '../common';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface PickerOption<T> {
  label: string;
  value: T;
  description?: string;
}

interface OptionsPickerBottomSheetProps<T> {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  options: PickerOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function OptionsPickerBottomSheet<T>({
  visible,
  onDismiss,
  title,
  options,
  selectedValue,
  onSelect,
}: OptionsPickerBottomSheetProps<T>) {
  const theme = useTheme<SalahMateTheme>();

  return (
    <GlassBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title={title}
      style={styles.bottomSheet}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {options.map((option, index) => {
          const isSelected = option.value === selectedValue;
          return (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.optionRow,
                { borderBottomColor: theme.colors.border },
                index === options.length - 1 && { borderBottomWidth: 0 },
                pressed && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
              ]}
              onPress={() => {
                onSelect(option.value);
                onDismiss();
              }}
            >
              <View style={styles.optionContent}>
                <Text
                  variant="bodyLarge"
                  style={{
                    color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                    fontWeight: isSelected ? '700' : '500',
                  }}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    {option.description}
                  </Text>
                )}
              </View>
              {isSelected && (
                <AppIcon name="check-circle" size={24} variant="primary" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </GlassBottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    paddingHorizontal: 0,
    maxHeight: '80%',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
});
