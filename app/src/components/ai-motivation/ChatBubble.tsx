import { AppIcon } from '../common/AppIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const theme = useTheme<SalahMateTheme>();
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isUser) {
    return (
      <Animated.View entering={FadeInUp.duration(300)} style={[styles.container, styles.userContainer]}>
        <View style={[styles.userBubble, { backgroundColor: '#8EDCB8' }]}>
          <Text variant="bodyMedium" style={{ color: '#000000', fontWeight: '500' }}>
            {message.text}
          </Text>
          <Text variant="labelSmall" style={[styles.timestamp, { color: 'rgba(0,0,0,0.6)' }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // AI Message
  return (
    <Animated.View entering={FadeInUp.duration(300)} style={[styles.container, styles.aiContainer]}>
      <View style={[styles.aiAvatar, { backgroundColor: '#8EDCB8' }]}>
        <AppIcon name="robot" size={18} color="#000000" />
      </View>
      <View style={styles.aiBubbleWrapper}>
        <View style={[styles.aiBubble, { padding: spacing.md, backgroundColor: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 }]}>
          <Text variant="bodyMedium" style={{ color: '#FFFFFF' }}>
            {message.text}
          </Text>
          <Text variant="labelSmall" style={[styles.timestamp, { color: 'rgba(255,255,255,0.6)' }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    flexDirection: 'row',
    width: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
    paddingLeft: spacing.xl * 2,
  },
  aiContainer: {
    justifyContent: 'flex-start',
    paddingRight: spacing.xl * 2,
  },
  userBubble: {
    padding: spacing.md,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '100%',
  },
  aiBubbleWrapper: {
    flex: 1,
  },
  aiBubble: {
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    fontSize: 10,
  },
});
