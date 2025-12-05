import apiClient from './api-client';
import axios from 'axios';
import { Client, ApiResponse } from '../types';

export const clientService = {
  /**
   * Get all clients (Officer only)
   */
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Client[]>>('/clients', {
        // Treat 304 as non-error but handle below
        validateStatus: (status) => !!status && status < 500,
      });

      // If server returns 304 or empty, fallback
      const status = response.status;
      const payload = response.data?.data;
      if (status === 304 || !Array.isArray(payload) || payload.length === 0) {
        throw new Error('Empty or 304');
      }
      return payload;
    } catch {
      // Fallback: DummyJSON users
      const { data } = await axios.get('https://dummyjson.com/users?limit=30', {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const users = data?.users || [];
      const mapped: Client[] = users.map((u: any) => ({
        id: String(u.id),
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        kycStatus: 'pending',
        lastUpdated: new Date().toISOString(),
      }));
      return mapped;
    }
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
