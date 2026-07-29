import { AppIcon } from '@/components';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/auth/useAuth';
import { GlassBottomSheet } from '@/components/glass';
import { WelcomeCard } from './WelcomeCard';
import { SuggestionChips } from './SuggestionChips';
import { ChatBubble, ChatMessage } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { spacing } from '@/theme';

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
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Reset chat when opened
  useEffect(() => {
    if (visible) {
      setMessages([]);
      setIsTyping(false);
    }
  }, [visible]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    
    // Auto-scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question.\n\nAI integration will be implemented in an upcoming development phase.\n\nThis response is currently a demonstration of the future AI assistant.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      
      // Auto-scroll
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500); // 1.5 second simulated delay
  };

  return (
    <GlassBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title="SalahMate AI"
      style={styles.bottomSheet} // Future readiness: can increase max height if needed
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
              <ChatBubble key={msg.id} message={msg} />
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
    flex: 1,
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
