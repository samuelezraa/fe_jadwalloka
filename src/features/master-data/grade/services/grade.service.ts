import { api } from '@/lib/axios';
import type { Grade } from '../types/grade.type';

export const gradeService = {
  getAll: async (search?: string, status?: string, page = 1, perPage = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/grades?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
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