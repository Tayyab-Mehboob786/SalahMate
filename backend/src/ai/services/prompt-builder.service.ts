import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptBuilderService {
  buildPrompt(message: string, context: Record<string, any>, history: any[]): string {
    // This transforms the context and user message into an LLM-friendly prompt.
    // E.g. "You are an Islamic assistant. The user's name is ${context.userName}..."
    // Since we are using a dummy provider for now, we just pass the raw message.
    
    return message;
  }
}
