import { api } from '@/lib/axios';
import type { CustomWorkHour } from '../types/custom-work-hour.type';

export const customWorkHourService = {
  getAll: async (
    search?: string,
    status?: string,
    page = 1,
    perPage = 10
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/custom-work-hours?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
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