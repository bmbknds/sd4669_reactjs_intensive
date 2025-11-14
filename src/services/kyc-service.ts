import apiClient from './api-client';
import { KYCData, ApiResponse } from '../types';

export const kycService = {
  /**
   * Get KYC data by user ID
   */
  getKYCByUserId: async (userId: string): Promise<KYCData> => {
    const response = await apiClient.get<ApiResponse<KYCData>>(`/kyc/user/${userId}`);
    return response.data.data;
  },

  /**
   * Submit KYC data
   */
  submitKYC: async (data: Omit<KYCData, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<KYCData> => {
    const response = await apiClient.post<ApiResponse<KYCData>>('/kyc', data);
    return response.data.data;
  },

  /**
   * Update KYC data
   */
  updateKYC: async (kycId: string, data: Partial<KYCData>): Promise<KYCData> => {
    const response = await apiClient.put<ApiResponse<KYCData>>(`/kyc/${kycId}`, data);
    return response.data.data;
  },

  /**
   * Upload document
   */
  uploadDocument: async (file: File, fieldName: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);

    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      '/kyc/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.url;
  },
};
