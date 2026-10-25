import { api } from '@/lib/axios';
import type { ScheduleScheme } from '../types/schedule-scheme.type';

export const scheduleSchemeService = {
  getAll: async (): Promise<ScheduleScheme[]> => {
    const response = await api.get('/work-schedule-schemes');
    return response.data.data;
  },

  getById: async (id: string | number): Promise<ScheduleScheme> => {
    const response = await api.get(`/work-schedule-schemes/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<ScheduleScheme, 'id'>): Promise<ScheduleScheme> => {
    const response = await api.post('/work-schedule-schemes', data);
    return response.data.data;
  },

  update: async (id: string | number, data: Partial<ScheduleScheme>): Promise<ScheduleScheme> => {
    const response = await api.put(`/work-schedule-schemes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number): Promise<boolean> => {
    await api.delete(`/work-schedule-schemes/${id}`);
    return true;
  },
};