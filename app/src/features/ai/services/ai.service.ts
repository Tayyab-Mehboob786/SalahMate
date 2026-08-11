import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { AiContext } from '../types/ai-context';
import { ChatResponse } from '../types/ai-message';

export const aiService = {
  chat: async (
    message: string, 
    conversationId?: string, 
    context?: AiContext
  ): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>(
      `/ai/chat`,
      {
        message,
        conversationId,
        context,
      }
    );
    return response.data;
  },
  getInsight: async (lat?: number, lng?: number): Promise<{ insight: string }> => {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('lat', lat.toString());
    if (lng !== undefined) query.append('lng', lng.toString());

    const response = await apiClient.get<{ insight: string }>(
      `/ai/insight?${query.toString()}`
    );
    return response.data;
  }
};
