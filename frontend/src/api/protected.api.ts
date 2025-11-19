import { api } from '../utils/api.util';
import type   { ApiResponse } from '../types/api.types';

export const protectedApi = {
  getProtectedData: async (): Promise<ApiResponse<void>> => {
    return api.get('/protected/data');
  },
};

