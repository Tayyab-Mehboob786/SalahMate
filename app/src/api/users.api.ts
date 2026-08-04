import apiClient from './axios';
import { API_ENDPOINTS } from '@/constants/api';

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatar: string;
  };
}

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },
  updateProfile: async (data: { fullName?: string; country?: string; city?: string; timezone?: string }) => {
    const response = await apiClient.patch(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    return response.data;
  },
  updateTheme: async (theme: 'LIGHT' | 'DARK' | 'SYSTEM') => {
    const response = await apiClient.patch(API_ENDPOINTS.USER.UPDATE_THEME, { theme });
    return response.data;
  },
  uploadAvatar: async (imageUri: string): Promise<UpdateAvatarResponse> => {
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData();
    // @ts-ignore - React Native FormData specific format
    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    });

    const response = await apiClient.patch(API_ENDPOINTS.USER.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
