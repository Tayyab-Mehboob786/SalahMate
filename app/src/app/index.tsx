/**
 * SalahMate Animated Splash Screen (`/`)
 *
 * Seamlessly transitions from the native splash screen into an animated React Native sequence.
 * Fades in the application title, waits for authentication initialization, and then
 * smoothly redirects to either the Sign In screen or Home Dashboard.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/hooks/auth/useAuth';
import { BrandWatermark } from '@/components';
import type { SalahMateTheme } from '@/theme';

export default function AnimatedSplashScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { isAuthenticated, isLoading } = useAuth();
  
  const textOpacity = useSharedValue(0);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  const handleAnimationComplete = () => {
    setIsAnimationDone(true);
  };

  useEffect(() => {
    // 1. Instantly hide native splash screen for a flicker-free handoff
    // The logo matches the exact center position & size of the native splash.
    SplashScreen.hideAsync().catch(() => {});

    // 2. Animate the 'SalahMate' app name fading in smoothly
    textOpacity.value = withDelay(
      300, 
      withTiming(1, { duration: 800 }, (finished) => {
        if (finished) {
          runOnJS(handleAnimationComplete)();
        }
      })
    );
  }, [textOpacity]);

  // 3. Navigation sequence logic
  // Wait until BOTH the animation is complete and the authentication initialization is complete.
  useEffect(() => {
    if (isAnimationDone && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAnimationDone, isLoading, isAuthenticated, router]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: 10 * (1 - textOpacity.value) }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BrandWatermark />
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/branding/splash_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="SalahMate Official Logo"
        />
        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            SalahMate
          </Text>
          <Text variant="labelMedium" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
            TRACK • REFLECT • GROW
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    // We do NOT use margins or padding here that might shift the logo away from absolute center.
    // This guarantees visual alignment with the native Expo Splash Screen.
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
  textContainer: {
    position: 'absolute',
    top: 320, // Positioned safely below the centered 300px logo without affecting flex layout
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '600',
    opacity: 0.8,
  },
});
