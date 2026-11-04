import { api } from '@/lib/axios';
import type { LoginResponse } from '../types/auth.type';

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
};