import { api } from '@/lib/axios';
import type { CustomWorkHour } from '../types/custom-work-hour.type';

export const customWorkHourService = {
  getAll: async (): Promise<CustomWorkHour[]> => {
    const response = await api.get('/custom-work-hours');
    return response.data.data || response.data;
  },

  getById: async (id: string | number): Promise<CustomWorkHour> => {
    const response = await api.get(`/custom-work-hours/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<CustomWorkHour, 'id'>): Promise<CustomWorkHour> => {
    const response = await api.post('/custom-work-hours', data);
    return response.data.data;
  },

  update: async (id: string | number, data: Partial<CustomWorkHour>): Promise<CustomWorkHour> => {
    const response = await api.put(`/custom-work-hours/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number): Promise<boolean> => {
    await api.delete(`/custom-work-hours/${id}`);
    return true;
  },
};