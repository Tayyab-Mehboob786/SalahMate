import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tab,
              isActive && [styles.activeTab, { backgroundColor: theme.colors.primary }]
            ]}
          >
            <Text 
              variant="labelMedium" 
              style={[
                styles.tabText,
                { color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant },
                isActive && styles.activeTabText
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 24,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  tab: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  }
});
