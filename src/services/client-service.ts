import apiClient from './api-client';
import { Client, ApiResponse } from '../types';

export const clientService = {
  /**
   * Get all clients (Officer only)
   */
  getAllClients: async (): Promise<Client[]> => {
    const response = await apiClient.get<ApiResponse<Client[]>>('/clients');
    return response.data.data;
  },

  /**
   * Get client by ID
   */
  getClientById: async (clientId: string): Promise<Client> => {
    const response = await apiClient.get<ApiResponse<Client>>(`/clients/${clientId}`);
    return response.data.data;
  },

  /**
   * Search clients
   */
  searchClients: async (query: string): Promise<Client[]> => {
    const response = await apiClient.get<ApiResponse<Client[]>>('/clients/search', {
      params: { q: query },
    });
    return response.data.data;
  },
};
