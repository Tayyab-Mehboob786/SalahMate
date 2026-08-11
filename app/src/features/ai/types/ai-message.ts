export interface AiMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
  timestamp: string;
  conversationId: string;
}
