import { useState, useCallback } from 'react';
import { AiMessage } from '../types/ai-message';
import { AiContext } from '../types/ai-context';
import { aiService } from '../services/ai.service';
import { useAuth } from '@/hooks/auth/useAuth';
import { useLocation } from '@/context/LocationContext';

export function useAI() {
  const { user } = useAuth();
  const { location } = useLocation();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string, externalContext?: Partial<AiContext>) => {
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      const context: AiContext = {
        userName: user?.name,
        lat: location?.latitude,
        lng: location?.longitude,
        ...externalContext,
      };

      const response = await aiService.chat(text, conversationId, context);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: 'ai',
        timestamp: new Date(response.timestamp),
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // Optionally handle suggestions here, though the UI currently handles defaults
      // For now we'll just ignore the dynamic suggestions as requested 
      // or we can pass them up if the component asks for them.
      
    } catch (err) {
      console.error('Error sending message to AI:', err);
      const errorMsg: AiMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setError('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  }, [conversationId, user]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat,
  };
}
