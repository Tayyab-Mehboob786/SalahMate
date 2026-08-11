import { Injectable } from '@nestjs/common';
import { ConversationService } from './services/conversation.service';
import { ContextBuilderService } from './services/context-builder.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { ResponseEngineService } from './services/response-engine.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly contextBuilder: ContextBuilderService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly responseEngine: ResponseEngineService,
  ) {}

  async chat(userId: string, request: ChatRequestDto): Promise<ChatResponseDto> {
    // 1. Resolve or Create Conversation
    const conversationId = request.conversationId || this.conversationService.createConversation();
    
    // 2. Append User Message
    this.conversationService.appendMessage(conversationId, 'user', request.message);
    
    // 3. Build Context
    const context = await this.contextBuilder.buildContext(userId, request.context);
    
    // 4. Retrieve History
    const history = this.conversationService.getHistory(conversationId);
    
    // 5. Build Prompt
    const prompt = this.promptBuilder.buildPrompt(request.message, context, history);
    
    // 6. Generate Response via Engine
    const { reply, suggestions } = await this.responseEngine.generate(prompt, context);
    
    // 7. Append Assistant Message
    this.conversationService.appendMessage(conversationId, 'assistant', reply);
    
    return {
      reply,
      suggestions,
      timestamp: new Date().toISOString(),
      conversationId,
    };
  }

  async getInsight(userId: string, requestContext?: Record<string, any>): Promise<{ insight: string }> {
    const context = await this.contextBuilder.buildContext(userId, requestContext);
    const insight = await this.responseEngine.generateInsight(context);
    return { insight };
  }
}
