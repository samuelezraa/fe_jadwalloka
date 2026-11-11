import { api } from '@/lib/axios';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

export const departemenService = {
  getAll: async (search?: string, status?: string, page = 1, perPage = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/departments?${params.toString()}`);
    
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