/**
 * SalahMate Login Screen (`/(auth)/login`)
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, ActivityIndicator } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { ScreenContainer, AppIcon } from '@/components';
import { useAuth } from '@/hooks/auth/useAuth';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { BlurView } from 'expo-blur';

export default function LoginScreen() {
  const router = useRouter();
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const logoSize = Math.min(screenWidth * 0.35, 120);

  return (
    <ScreenContainer
      scrollable
      keyboardShouldPersistTaps="handled"
      withGlassGradient={false} // Disable dark overlay
      backgroundImage={require('../../../assets/backgrounds/auth-login-mosque.png')}
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
                  Welcome Back
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

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
                  <AppIcon name="account-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputBox, passwordError ? styles.inputBoxError : null]}>
                  <AppIcon name="lock-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
                  <RNTextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
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

              {/* Forgot Password */}
              <View style={styles.forgotContainer}>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={styles.forgotText}>Forgot Password</Text>
                </Pressable>
              </View>

              {/* Sign In Button */}
              <Pressable
                style={({ pressed }) => [styles.signInButton, pressed && { opacity: 0.8 }]}
                onPress={validateAndSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </Pressable>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don't have an account?{' '}
                </Text>
                <Pressable onPress={() => router.push('/(auth)/signup')}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </Pressable>
              </View>

            </Animated.View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 40,
    backgroundColor: 'rgba(4, 91, 75, 0.3)', // Soft teal tint
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 222, 128, 0.4)', // emerald border
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
  },
  inputBoxError: {
    borderColor: '#FF6B6B',
  },
  inputIcon: {
    marginRight: 12,
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  signInButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#045B4B', // Dark teal/emerald
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#045B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  signupText: {
    color: '#4ADE80', // bright emerald
    fontSize: 14,
    fontWeight: '600',
  },
});
