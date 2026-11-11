import { api } from '@/lib/axios';
import type { ScheduleScheme } from '../types/schedule-scheme.type';

export const scheduleSchemeService = {
  getAll: async (search?: string, status?: string, page = 1, perPage = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/work-schedule-schemes?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
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