/**
 * SalahMate Signup Screen (`/(auth)/signup`)
 *
 * Modern Material Design 3 registration screen built with our reusable form components.
 * Features full keyboard awareness, controlled form validation state readiness,
 * and clean navigation back to the login flow.
 */

import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme, Snackbar } from 'react-native-paper';
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

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { login } = useAuth();
  const { width: screenWidth } = useWindowDimensions();

  // Controlled UI state
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
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

    if (!fullName.trim()) {
      setNameError('Please enter your full name');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      isValid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      });
      setSuccessMessage('Account created successfully. Please verify your email.');
      setTimeout(() => {
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: email.trim() },
        });
      }, 1500);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 409) {
          setServerError('An account with this email already exists.');
        } else if (status === 400) {
          const messages = error.response.data?.message;
          if (Array.isArray(messages)) {
            setServerError(messages.join(', '));
          } else {
            setServerError(messages || 'Validation failed.');
          }
        } else {
          setServerError('Something went wrong. Please try again.');
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
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                Create Your Account
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              >
                Begin your journey with SalahMate.
              </Text>
            </Animated.View>
          </View>

          {/* Registration Form Card */}
          <Animated.View style={[styles.formWrapper, animatedFormStyle]}>
            <Card mode="elevated" elevation={1} style={styles.formCard}>
              <View style={styles.formSection}>
                {serverError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {serverError}
                  </Text>
                ) : null}

                <TextInput
                  label="Full Name"
                  placeholder="Enter your name"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (nameError) setNameError('');
                  }}
                  autoCapitalize="words"
                  left={<TextInput.Icon icon="account-outline" />}
                  errorMessage={nameError}
                />

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
                  label="Create Password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  left={<TextInput.Icon icon="lock-outline" />}
                  errorMessage={passwordError}
                  helperText={!passwordError ? 'Minimum 8 characters' : undefined}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  left={<TextInput.Icon icon="lock-check-outline" />}
                  errorMessage={confirmPasswordError}
                />

                <View style={styles.submitContainer}>
                  <PrimaryButton
                    label="Create Account"
                    onPress={validateAndSubmit}
                    loading={isSubmitting}
                    fullWidth
                    icon="account-check"
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
                Already have a SalahMate account?
              </Text>
              <SecondaryButton
                label="Sign In"
                onPress={() => router.replace('/(auth)/login')}
                fullWidth
                icon="login"
                style={styles.loginButton}
              />
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <Snackbar
        visible={!!successMessage}
        onDismiss={() => setSuccessMessage('')}
        duration={1500}
      >
        {successMessage}
      </Snackbar>
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
    paddingVertical: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  formWrapper: {
    width: '100%',
  },
  formCard: {
    marginVertical: spacing.sm,
  },
  formSection: {
    padding: spacing.sm,
  },
  submitContainer: {
    marginTop: spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  footerText: {
    marginBottom: spacing.xs,
  },
  loginButton: {
    marginTop: spacing.xs,
  },
});
