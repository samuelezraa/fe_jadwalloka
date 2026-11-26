import { api } from '@/lib/axios';
import type { LoginResponse } from '../types/auth.type';

export interface AuthUrlParams {
  idkaryawan: string;
  password: string;
  id_departemen?: string;
  departemen?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },

  loginByUrl: async (params: AuthUrlParams): Promise<LoginResponse> => {
    const response = await api.get('/auth', { params });
    return response.data;
  },
};