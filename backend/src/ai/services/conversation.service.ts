import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  messages: Message[];
}

@Injectable()
export class ConversationService {
  private conversations = new Map<string, Conversation>();

  createConversation(): string {
    const id = uuidv4();
    this.conversations.set(id, { id, messages: [] });
    return id;
  }

  appendMessage(conversationId: string, role: 'user' | 'assistant', content: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push({ role, content, timestamp: new Date() });
    }
  }

  getHistory(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId);
    return conversation ? conversation.messages : [];
  }
}
