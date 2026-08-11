import { AppIcon } from '../common/AppIcon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '@/components/glass';
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
        <View style={[styles.userBubble, { backgroundColor: theme.colors.primary }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
            {message.text}
          </Text>
          <Text variant="labelSmall" style={[styles.timestamp, { color: theme.colors.onPrimary, opacity: 0.7 }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // AI Message
  return (
    <Animated.View entering={FadeInUp.duration(300)} style={[styles.container, styles.aiContainer]}>
      <View style={[styles.aiAvatar, { backgroundColor: theme.colors.primary }]}>
        <AppIcon name="robot" size={18} color={theme.colors.onPrimary} />
      </View>
      <View style={styles.aiBubbleWrapper}>
        <GlassCard style={[styles.aiBubble, { padding: spacing.md }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {message.text}
          </Text>
          <Text variant="labelSmall" style={[styles.timestamp, { color: theme.colors.onSurfaceVariant }]}>
            {formatTime(message.timestamp)}
          </Text>
        </GlassCard>
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
