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
                isSelected ? styles.selectedRow : styles.normalRow,
                pressed && { opacity: 0.8 },
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
                    color: isSelected ? '#4ADE80' : '#FFFFFF',
                    fontWeight: isSelected ? '700' : '500',
                  }}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text 
                    variant="bodySmall" 
                    style={{ 
                      color: isSelected ? 'rgba(74, 222, 128, 0.85)' : 'rgba(255,255,255,0.7)', 
                      marginTop: 2 
                    }}
                  >
                    {option.description}
                  </Text>
                )}
              </View>
              {isSelected && (
                <AppIcon name="check-circle" size={24} color="#4ADE80" />
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
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
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
    paddingHorizontal: spacing.md,
    marginVertical: 4,
    borderRadius: 14,
  },
  normalRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedRow: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  optionContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
});
