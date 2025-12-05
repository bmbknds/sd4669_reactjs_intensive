import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    // Add cache-busting header per request
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors with simple retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config: any = error.config;
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      globalThis.location.href = '/login';
    }
    // retry up to 2 times on network/5xx errors
    const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);
    if (shouldRetry && !config.__retryCount) {
      config.__retryCount = 1;
      await new Promise((r) => setTimeout(r, 300));
      return apiClient(config);
    } else if (shouldRetry && config.__retryCount === 1) {
      config.__retryCount = 2;
      await new Promise((r) => setTimeout(r, 600));
      return apiClient(config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
