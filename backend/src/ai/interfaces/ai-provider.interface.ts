export interface AIProvider {
  generateResponse(prompt: string, context: Record<string, any>): Promise<{
    reply: string;
    suggestions: string[];
  }>;
  generateInsight(context: Record<string, any>): Promise<string>;
}
