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
import { ScreenContainer } from '@/components';
import type { SalahMateTheme } from '@/theme';

export default function AnimatedSplashScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { isAuthenticated, isLoading } = useAuth();
  
  const textOpacity = useSharedValue(0);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setIsAnimationDone(true);
    }, 2000);
  };

  useEffect(() => {
    async function prepareSplashAndAssets() {
      try {
        const bg1 = Image.resolveAssetSource(require('../../assets/backgrounds/auth-login-mosque.png')).uri;
        const bg2 = Image.resolveAssetSource(require('../../assets/backgrounds/auth-signup-mosque.png')).uri;
        const bg3 = Image.resolveAssetSource(require('../../assets/backgrounds/home-mosque.png')).uri;
        
        await Promise.all([
          Image.prefetch(bg1),
          Image.prefetch(bg2),
          Image.prefetch(bg3),
        ]);
      } catch (e) {
        console.warn('Asset prefetch error:', e);
      } finally {
        SplashScreen.hideAsync().catch(() => {});
        textOpacity.value = withDelay(
          300, 
          withTiming(1, { duration: 800 }, (finished) => {
            if (finished) {
              runOnJS(handleAnimationComplete)();
            }
          })
        );
      }
    }
    prepareSplashAndAssets();
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
    <ScreenContainer backgroundImage={require('../../assets/backgrounds/auth-login-mosque.png')} withGlassGradient={false}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/branding/splash_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="SalahMate Official Logo"
          />
          <Animated.View style={[styles.textContainer, animatedTextStyle]}>
            <Text variant="displaySmall" style={[styles.title, { color: '#FFFFFF' }]}>
              SalahMate
            </Text>
            <Text variant="labelMedium" style={[styles.tagline, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              TRACK • REFLECT • GROW
            </Text>
          </Animated.View>
        </View>
      </View>
    </ScreenContainer>
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
