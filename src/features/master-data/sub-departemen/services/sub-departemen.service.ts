import { api } from '@/lib/axios';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';

export const subDepartemenService = {
  getAll: async (): Promise<SubDepartemen[]> => {
    const response = await api.get('/sub-departments');
    return response.data.data;
  },

  create: async (data: SubDepartemenFormValues): Promise<SubDepartemen> => {
    const response = await api.post('/sub-departments', data);
    return response.data.data;
  },

  update: async (id: number, data: SubDepartemenFormValues): Promise<SubDepartemen> => {
    const response = await api.put(`/sub-departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sub-departments/${id}`);
  },
};