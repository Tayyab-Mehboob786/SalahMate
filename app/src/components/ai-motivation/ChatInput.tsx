import { AppIcon } from '../common/AppIcon';
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
      <View style={[styles.container, { backgroundColor: 'transparent', borderTopColor: 'rgba(255,255,255,0.1)' }]}>
        <View style={[styles.inputWrapper, { backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.15)' }]}>
          <TextInput
            style={[styles.input, { color: '#FFFFFF' }]}
            placeholder="Ask SalahMate AI..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Pressable 
            style={[
              styles.sendButton, 
              { backgroundColor: text.trim().length > 0 && !isTyping ? '#8EDCB8' : 'rgba(255,255,255,0.1)' }
            ]}
            onPress={handleSend}
            disabled={text.trim().length === 0 || isTyping}
          >
            <AppIcon 
              name="send" 
              size={18} 
              color={text.trim().length > 0 && !isTyping ? '#000000' : 'rgba(255,255,255,0.3)'} 
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
