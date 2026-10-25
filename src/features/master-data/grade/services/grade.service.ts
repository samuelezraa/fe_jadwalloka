import { api } from '@/lib/axios';
import type { Grade } from '../types/grade.type';

export const gradeService = {
  getAll: async (): Promise<Grade[]> => {
    const response = await api.get('/grades');
    return response.data.data;
  },

  getById: async (id: string | number): Promise<Grade> => {
    const response = await api.get(`/grades/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Grade, 'id'>): Promise<Grade> => {
    const response = await api.post('/grades', data);
    return response.data.data;
  },

  update: async (id: string | number, data: Partial<Grade>): Promise<Grade> => {
    const response = await api.put(`/grades/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number): Promise<boolean> => {
    await api.delete(`/grades/${id}`);
    return true;
  },
};