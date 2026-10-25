import { api } from '@/lib/axios';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';

export const fiveTwoWorkHourService = {
  getAll: async (): Promise<FiveTwoWorkHourEmployee[]> => {
    const response = await api.get('/schedules');
    return response.data.data;
  },

  getById: async (id: number | string): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.get(`/schedules/${id}`);
    return response.data.data;
  },

  create: async (data: FiveTwoWorkHourFormValues): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.post('/schedules', data);
    return response.data.data;
  },

  update: async (id: number | string, data: FiveTwoWorkHourFormValues): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await api.delete(`/schedules/${id}`);
    return true;
  },
};