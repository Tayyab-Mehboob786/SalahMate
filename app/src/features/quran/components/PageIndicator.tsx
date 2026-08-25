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
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.text}>
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
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10,
  },
  text: {
    fontWeight: 'bold',
    color: '#8EDCB8',
  },
});
