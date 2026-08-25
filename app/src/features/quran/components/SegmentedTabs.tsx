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
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            style={[
              styles.tab,
              isActive && styles.activeTab
            ]}
          >
            <Text 
              variant="labelMedium" 
              style={[
                styles.tabText,
                { color: isActive ? '#8EDCB8' : 'rgba(255,255,255,0.7)' },
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(15, 76, 54, 0.8)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  }
});
