import apiClient from './api-client';
import { PersonalInfo, ApiResponse } from '../types';

export const profileService = {
  /**
   * Get profile by user ID
   */
  getProfile: async (userId: string): Promise<PersonalInfo> => {
    const response = await apiClient.get<ApiResponse<PersonalInfo>>(`/profiles/${userId}`);
    return response.data.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (userId: string, data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
    const response = await apiClient.put<ApiResponse<PersonalInfo>>(
      `/profiles/${userId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Create profile
   */
  createProfile: async (data: Omit<PersonalInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonalInfo> => {
    const response = await apiClient.post<ApiResponse<PersonalInfo>>('/profiles', data);
    return response.data.data;
  },
};
