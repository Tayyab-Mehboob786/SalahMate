import { Injectable } from '@nestjs/common';
import { DummyAIProvider } from '../providers/dummy.provider';

@Injectable()
export class ResponseEngineService {
  constructor(private readonly provider: DummyAIProvider) {}

  async generate(prompt: string, context: Record<string, any>): Promise<{reply: string, suggestions: string[]}> {
    return this.provider.generateResponse(prompt, context);
  }

  async generateInsight(context: Record<string, any>): Promise<string> {
    return this.provider.generateInsight(context);
  }
}
