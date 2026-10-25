import { api } from '@/lib/axios';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

// In-memory cache agar perpindahan menu terasa instan (0 ms)
let departemenCache: Departemen[] | null = null;

export const departemenService = {
  getAll: async (forceRefresh = false): Promise<Departemen[]> => {
    if (departemenCache && !forceRefresh) {
      return departemenCache;
    }
    const response = await api.get('/departments');
    departemenCache = response.data.data;
    return response.data.data;
  },

  getById: async (id: number): Promise<Departemen> => {
    const response = await api.get(`/departments/${id}`);
    return response.data.data;
  },

  create: async (data: DepartemenFormValues): Promise<Departemen> => {
    const response = await api.post('/departments', data);
    departemenCache = null; // Invalidate cache
    return response.data.data;
  },

  update: async (id: number, data: DepartemenFormValues): Promise<Departemen> => {
    const response = await api.put(`/departments/${id}`, data);
    departemenCache = null; // Invalidate cache
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
    departemenCache = null; // Invalidate cache
  },
};