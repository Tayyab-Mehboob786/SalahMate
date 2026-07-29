import { AppIcon } from '@/components';
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  isTyping?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isTyping }) => {
  const theme = useTheme<SalahMateTheme>();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0 && !isTyping) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="Ask SalahMate AI..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Pressable 
            style={[
              styles.sendButton, 
              { backgroundColor: text.trim().length > 0 && !isTyping ? theme.colors.primary : theme.colors.surfaceDisabled }
            ]}
            onPress={handleSend}
            disabled={text.trim().length === 0 || isTyping}
          >
            <AppIcon 
              name="send" 
              size={18} 
              color={text.trim().length > 0 && !isTyping ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled} 
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});
