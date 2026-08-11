import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

interface PageIndicatorProps {
  pageNumber: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({ pageNumber }) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text variant="labelMedium" style={[styles.text, { color: theme.colors.onSurface }]}>
        {pageNumber}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -15, // To overlap border slightly
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  text: {
    fontWeight: 'bold',
  },
});
