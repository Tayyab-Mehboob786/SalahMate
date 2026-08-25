import { AppIcon } from '../common/AppIcon';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/auth/useAuth';
import { GlassBottomSheet } from '@/components/glass';
import { WelcomeCard } from './WelcomeCard';
import { SuggestionChips } from './SuggestionChips';
import { ChatBubble, ChatMessage } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { spacing } from '@/theme';
import { useAI } from '@/features/ai/hooks/useAI';

interface AiChatBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

const DEFAULT_SUGGESTIONS = [
  { id: '1', text: 'Help me wake up for Fajr', icon: 'weather-sunset-up' as string },
  { id: '2', text: 'How can I improve my Salah?', icon: 'mosque' as string },
  { id: '3', text: 'Recommend a Dua for today', icon: 'book-open-page-variant' as string },
  { id: '4', text: 'Motivate me to pray consistently', icon: 'lightbulb-on-outline' as string },
  { id: '5', text: 'Explain the importance of Salah', icon: 'hands-pray' as string },
  { id: '6', text: 'Give me today\'s Islamic reminder', icon: 'star-crescent' as string },
];

export const AiChatBottomSheet: React.FC<AiChatBottomSheetProps> = ({ visible, onDismiss }) => {
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, isTyping, sendMessage, clearChat } = useAI();

  // Reset chat when opened
  useEffect(() => {
    if (visible) {
      clearChat();
    }
  }, [visible, clearChat]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  return (
    <GlassBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title="SalahMate AI"
      style={[styles.bottomSheet, { backgroundColor: 'rgba(0,0,0,0.75)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 }]}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <WelcomeCard userName={user?.name || ''} />
            <SuggestionChips suggestions={DEFAULT_SUGGESTIONS} onSelect={handleSendMessage} />
          </View>
        ) : (
          <View style={styles.chatHistory}>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg as ChatMessage} />
            ))}
            {isTyping && (
              <ChatBubble 
                message={{
                  id: 'typing',
                  text: '...',
                  sender: 'ai',
                  timestamp: new Date(),
                }} 
              />
            )}
          </View>
        )}
      </ScrollView>
      
      <ChatInput onSend={handleSendMessage} isTyping={isTyping} />
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    paddingHorizontal: 0, // Reset padding from GlassBottomSheet content area so input can touch edges
    paddingBottom: 0,
    maxHeight: '90%', // Increased max height for better chat experience
  },
  scrollContainer: {
    flexShrink: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
  },
  chatHistory: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
});
