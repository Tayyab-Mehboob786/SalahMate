import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';

/**
 * BrandWatermark
 *
 * A subtle, non-interactive, un-animated background watermark using the official SalahMate logo.
 * Designed to provide premium branding consistency across the Splash Screen and Authentication flows.
 */
export const BrandWatermark: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const watermarkSize = screenWidth * 0.75; // 75% of screen width

  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={require('../../../assets/branding/splash_logo.png')}
        style={[
          styles.watermark,
          {
            width: watermarkSize,
            height: watermarkSize,
          },
        ]}
        resizeMode="contain"
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  watermark: {
    opacity: 0.06, // Between 4% and 8% opacity as requested
  },
});
