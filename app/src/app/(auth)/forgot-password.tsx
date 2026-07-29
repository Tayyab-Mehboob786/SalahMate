/**
 * SalahMate Forgot Password Screen (`/(auth)/forgot-password`)
 *
 * Modern Material Design 3 password recovery screen built with our reusable form components.
 * Features full keyboard awareness, controlled email validation state readiness,
 * and dynamic feedback state when recovery instructions are sent.
 */

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();

  // Controlled UI state ready for React Hook Form / Zod integration
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const validateAndSend = () => {
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 400);
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
              icon="lock-reset"
              size={72}
              backgroundColor={
                isSent ? theme.colors.primaryContainer : theme.colors.secondaryContainer
              }
              color={isSent ? theme.colors.primary : theme.colors.secondary}
              accessibilityLabel="Password Recovery Logo"
            />
            <Text
              variant="headlineMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {isSent ? 'Check Your Email' : 'Reset Password'}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {isSent
                ? `We have sent password recovery instructions to ${email}`
                : 'Enter the email address associated with your SalahMate account and we will send you a recovery link.'}
            </Text>
          </View>

          {/* Form / Confirmation Card */}
          <Card mode="elevated" elevation={1} style={styles.formCard}>
            <View style={styles.formSection}>
              {!isSent ? (
                <>
                  <TextInput
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) {
                        setEmailError('');
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    left={<TextInput.Icon icon="email-outline" />}
                    errorMessage={emailError}
                  />

                  <View style={styles.submitContainer}>
                    <PrimaryButton
                      label="Send Recovery Link"
                      onPress={validateAndSend}
                      loading={isSubmitting}
                      fullWidth
                      icon="email-send"
                    />
                  </View>
                </>
              ) : (
                <View style={styles.confirmationBox}>
                  <Text
                    variant="titleMedium"
                    style={[styles.confirmationTitle, { color: theme.colors.primary }]}
                  >
                    Instructions Sent Successfully
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[styles.confirmationText, { color: theme.colors.onSurfaceVariant }]}
                  >
                    If an account exists with this email, you will receive a reset link shortly.
                    Check your spam folder if you do not see it within 5 minutes.
                  </Text>

                  <View style={styles.resendContainer}>
                    <SecondaryButton
                      label="Resend Email"
                      onPress={() => setIsSent(false)}
                      fullWidth
                      icon="refresh"
                    />
                  </View>
                </View>
              )}
            </View>
          </Card>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <SecondaryButton
              label="Back to Login"
              onPress={() => router.replace('/(auth)/login')}
              fullWidth
              icon="arrow-left"
              style={styles.backButton}
            />
          </View>
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
    justifyContent: 'space-around',
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
  resendContainer: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backButton: {
    marginTop: spacing.xs,
  },
});
