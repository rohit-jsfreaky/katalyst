import { api } from '../utils/api.util';
import type { ApiResponse, User } from '../types/api.types';

export const authApi = {
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get<User>('/auth/me');
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post('/auth/logout');
  },

  // Google OAuth login URL
  getGoogleAuthUrl: (): string => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${API_BASE_URL}/auth/google`;
  },
};

