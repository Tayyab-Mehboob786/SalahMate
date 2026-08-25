/**
 * SalahMate Signup Screen (`/(auth)/signup`)
 */

import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  TextInput as RNTextInput,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { ScreenContainer, AppIcon } from '@/components';
import { useAuth } from '@/hooks/auth/useAuth';
import { authApi } from '@/api';
import { BlurView } from 'expo-blur';

export default function SignupScreen() {
  const router = useRouter();
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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 300 });
    logoScale.value = withTiming(1, { duration: 300 });
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    headerTranslateY.value = withDelay(100, withTiming(0, { duration: 300 }));
    formOpacity.value = withDelay(250, withTiming(1, { duration: 300 }));
    formTranslateY.value = withDelay(250, withTiming(0, { duration: 300 }));
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const animatedFormStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
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

  const logoSize = Math.min(screenWidth * 0.35, 120);

  return (
    <ScreenContainer
      scrollable
      keyboardShouldPersistTaps="handled"
      withGlassGradient={false}
      backgroundImage={require('../../../assets/backgrounds/auth-signup-mosque.png')}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <BlurView intensity={35} tint="dark" style={styles.glassCard}>

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
                <Text style={styles.title}>
                  Sign Up
                </Text>
              </Animated.View>
            </View>

            {/* Form Section */}
            <Animated.View style={[styles.formWrapper, animatedFormStyle]}>
              {serverError ? (
                <Text style={styles.errorText}>
                  {serverError}
                </Text>
              ) : null}

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputBox, nameError ? styles.inputBoxError : null]}>
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (nameError) setNameError('');
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {!!nameError && <Text style={styles.fieldErrorText}>{nameError}</Text>}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {!!emailError && <Text style={styles.fieldErrorText}>{emailError}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputBox, passwordError ? styles.inputBoxError : null]}>
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <AppIcon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255, 255, 255, 0.5)" />
                  </Pressable>
                </View>
                {!!passwordError && <Text style={styles.fieldErrorText}>{passwordError}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputBox, confirmPasswordError ? styles.inputBoxError : null]}>
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <AppIcon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="rgba(255, 255, 255, 0.5)" />
                  </Pressable>
                </View>
                {!!confirmPasswordError && <Text style={styles.fieldErrorText}>{confirmPasswordError}</Text>}
              </View>

              {/* Sign Up Button */}
              <Pressable
                style={({ pressed }) => [styles.signUpButton, pressed && { opacity: 0.8 }]}
                onPress={validateAndSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </Pressable>



            </Animated.View>
          </BlurView>

          {/* Footer outside the card */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </View>

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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // light frosted tint
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingVertical: 4,
  },
  formWrapper: {
    width: '100%',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  fieldErrorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
  },
  inputBoxError: {
    borderColor: '#FF6B6B',
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#15414C', // Dark teal
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#15414C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
    marginBottom: 24,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Social Login
  socialContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.9,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  socialBtnWrapper: {
    alignItems: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  loginText: {
    color: '#7FC8E8', // Light blue/teal highlight
    fontSize: 14,
    fontWeight: '700',
  },
});
