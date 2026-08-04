/**
 * SalahMate Verify Email Screen (`/(auth)/verify-email`)
 *
 * Modern Material Design 3 screen for OTP verification.
 */

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import {
  Avatar,
  Card,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  TextInput,
} from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { authApi } from '@/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const params = useLocalSearchParams<{ email: string }>();
  
  const [email] = useState<string>(params.email || '');
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const validateAndVerify = async () => {
    setServerError('');
    
    if (!otp.trim()) {
      setOtpError('Please enter the 6-digit code');
      return;
    }
    if (otp.trim().length !== 6) {
      setOtpError('Verification code must be 6 digits');
      return;
    }
    if (!email) {
      setServerError('Email address is missing. Please try signing up again.');
      return;
    }

    setOtpError('');
    setIsSubmitting(true);
    
    try {
      await authApi.verifyEmail({ email, otp: otp.trim() });
      setIsVerified(true);
      setTimeout(() => {
        router.replace({
          pathname: '/(auth)/login',
          params: { email },
        });
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 404) {
          const messages = error.response.data?.message;
          if (Array.isArray(messages)) {
            setServerError(messages.join(', '));
          } else {
            setServerError(messages || 'Invalid verification code.');
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

  return (
    <ScreenContainer scrollable withPadding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Avatar
              mode="icon"
              icon="email-check"
              size={72}
              backgroundColor={
                isVerified ? theme.colors.primaryContainer : theme.colors.secondaryContainer
              }
              color={isVerified ? theme.colors.primary : theme.colors.secondary}
              accessibilityLabel="Email Verification Logo"
            />
            <Text
              variant="headlineMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {isVerified ? 'Email Verified' : 'Verify Your Email'}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {isVerified
                ? 'Your email has been successfully verified. Redirecting to login...'
                : `We have sent a 6-digit verification code to ${email}. Please enter it below to verify your account.`}
            </Text>
          </View>

          {/* Form / Confirmation Card */}
          <Card mode="elevated" elevation={1} style={styles.formCard}>
            <View style={styles.formSection}>
              {!isVerified ? (
                <>
                  {serverError ? (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {serverError}
                    </Text>
                  ) : null}

                  <TextInput
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text.replace(/[^0-9]/g, ''));
                      if (otpError) {
                        setOtpError('');
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    left={<TextInput.Icon icon="shield-check-outline" />}
                    errorMessage={otpError}
                  />

                  <View style={styles.submitContainer}>
                    <PrimaryButton
                      label="Verify Email"
                      onPress={validateAndVerify}
                      loading={isSubmitting}
                      fullWidth
                      icon="check-circle"
                    />
                  </View>
                </>
              ) : (
                <View style={styles.confirmationBox}>
                  <Text
                    variant="titleMedium"
                    style={[styles.confirmationTitle, { color: theme.colors.primary }]}
                  >
                    Verification Successful
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[styles.confirmationText, { color: theme.colors.onSurfaceVariant }]}
                  >
                    You can now log in to your SalahMate account using your email and password.
                  </Text>
                </View>
              )}
            </View>
          </Card>

          {/* Footer Navigation */}
          {!isVerified && (
            <View style={styles.footer}>
              <SecondaryButton
                label="Back to Login"
                onPress={() => router.replace('/(auth)/login')}
                fullWidth
                icon="arrow-left"
                style={styles.backButton}
              />
            </View>
          )}
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
    paddingVertical: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  title: {
    fontWeight: '800',
    marginTop: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  formCard: {
    marginVertical: spacing.md,
  },
  formSection: {
    padding: spacing.sm,
  },
  submitContainer: {
    marginTop: spacing.md,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  confirmationBox: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  confirmationTitle: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  confirmationText: {
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backButton: {
    marginTop: spacing.xs,
  },
});
