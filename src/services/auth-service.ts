import apiClient from './api-client';
import { LoginCredentials, AuthResponse, ApiResponse } from '../types';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<AuthResponse>>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh token
   */
  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data.token;
  },
};
