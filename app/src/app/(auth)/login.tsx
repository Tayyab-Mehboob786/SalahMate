/**
 * SalahMate Login Screen (`/(auth)/login`)
 *
 * Modern Material Design 3 authentication screen built with our reusable form components.
 * Features full keyboard awareness, controlled form validation state readiness,
 * and clear navigation links for account signup and password recovery.
 */

import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Text, useTheme, Divider } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import {
  Card,
  PasswordInput,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  TextInput,
} from '@/components';
import { useAuth } from '@/hooks/auth/useAuth';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { login } = useAuth();
  const { width: screenWidth } = useWindowDimensions();

  // Controlled UI state
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState<string>(params.email || '');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 300 });
    logoScale.value = withTiming(1, { duration: 300 });

    headerOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    headerTranslateY.value = withDelay(100, withTiming(0, { duration: 300 }));

    formOpacity.value = withDelay(250, withTiming(1, { duration: 300 }));
    formTranslateY.value = withDelay(250, withTiming(0, { duration: 300 }));
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const animatedFormStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const validateAndSubmit = async () => {
    let isValid = true;
    setServerError('');

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      isValid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    setIsSubmitting(true);
    console.log('[Login] Login request started');
    try {
      const response = await authApi.login({
        email: email.trim(),
        password: password,
      });
      console.log('[Login] Login success');
      console.log('[Login] Tokens received');

      await storage.saveAccessToken(response.accessToken);
      await storage.saveRefreshToken(response.refreshToken);
      console.log('[Login] Tokens saved');

      const savedToken = await storage.getAccessToken();
      console.log('[Login] Tokens read back:', !!savedToken);

      console.log('[Login] GET /auth/me request started');
      // Temporarily inject header since no interceptors exist yet
      const apiClient = require('@/api/axios').default;
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
      
      const userProfile = await authApi.getCurrentUser();
      console.log('[Login] GET /auth/me response received', userProfile.id);

      login(userProfile); // Update AuthContext state
      console.log('[Login] AuthContext updated');

      console.log('[Login] Navigation destination: /(tabs)/dashboard');
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.error('[Login] Error:', error?.response?.data || error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setServerError('Invalid email or password.');
        } else if (status === 400) {
          const messages = error.response.data?.message;
          if (Array.isArray(messages)) {
            setServerError(messages.join(', '));
          } else {
            setServerError(messages || 'Validation failed.');
          }
        } else {
          setServerError('Something went wrong.');
        }
      } else {
        setServerError('Unable to connect to the server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoSize = screenWidth * 0.4; // 20% of screen width

  return (
    <ScreenContainer scrollable withPadding keyboardShouldPersistTaps="handled" withBrandWatermark>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>

          {/* Header Section */}
          <View style={styles.header}>
            <Animated.View style={animatedLogoStyle}>
              <Image
                source={require('../../../assets/branding/splash_logo.png')}
                style={{ width: logoSize, height: logoSize }}
                resizeMode="contain"
                accessibilityLabel="SalahMate Official Logo"
              />
            </Animated.View>

            <Animated.View style={[styles.headerTextContainer, animatedHeaderStyle]}>
              <Text
                variant="headlineMedium"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                Welcome Back
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              >
                Continue your spiritual journey with SalahMate.
              </Text>
            </Animated.View>
          </View>

          {/* Form Card */}
          <Animated.View style={[styles.formWrapper, animatedFormStyle]}>
            <Card mode="elevated" elevation={1} style={styles.formCard}>
              <View style={styles.formSection}>
                {serverError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {serverError}
                  </Text>
                ) : null}

                <TextInput
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email-outline" />}
                  errorMessage={emailError}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  left={<TextInput.Icon icon="lock-outline" />}
                  errorMessage={passwordError}
                />

                <View style={styles.forgotContainer}>
                  <Button
                    mode="text"
                    compact
                    onPress={() => router.push('/(auth)/forgot-password')}
                    textColor={theme.colors.primary}
                    contentStyle={styles.forgotButtonContent}
                  >
                    Forgot Password?
                  </Button>
                </View>

                <View style={styles.submitContainer}>
                  <PrimaryButton
                    label="Sign In"
                    onPress={validateAndSubmit}
                    loading={isSubmitting}
                    fullWidth
                    icon="login"
                  />
                </View>


              </View>
            </Card>

            {/* Footer Navigation */}
            <View style={styles.footer}>
              <Text
                variant="bodySmall"
                style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}
              >
                Don&apos;t have an account yet?
              </Text>
              <SecondaryButton
                label="Create an Account"
                onPress={() => router.push('/(auth)/signup')}
                fullWidth
                icon="account-plus"
                style={styles.signupButton}
              />
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  formWrapper: {
    width: '100%',
  },
  formCard: {
    marginVertical: spacing.md,
  },
  formSection: {
    padding: spacing.sm,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  forgotButtonContent: {
    minHeight: 36,
  },
  submitContainer: {
    marginTop: spacing.xs,
  },

  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    marginBottom: spacing.xs,
  },
  signupButton: {
    marginTop: spacing.xs,
  },
});
