import { api } from '@/lib/axios';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

export const departemenService = {
  getAll: async (search?: string, status?: string, page = 1, perPage = 25, withSub = true) => {
    const params: Record<string, string | number | boolean> = {
      page,
      per_page: perPage,
    };

    if (search?.trim()) params.search = search.trim();
    if (status !== undefined && status !== '') params.status = status;
    if (!withSub) params.with_sub = 0;

    const response = await api.get('/departments', { params });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getById: async (id: number): Promise<Departemen> => {
    const response = await api.get(`/departments/${id}`);
    return response.data.data;
  },

  create: async (data: DepartemenFormValues): Promise<Departemen> => {
    const response = await api.post('/departments', data);
    return response.data.data;
  },

  update: async (id: number, data: DepartemenFormValues): Promise<Departemen> => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};