import { api } from '@/lib/axios';
import type { AnnualEvent } from '../types/annual-event.type';

export const annualEventService = {
  getAll: async (
    search?: string,
    status?: string,
    category?: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    perPage = 10
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== undefined && status !== '') params.append('status', status);
    if (category !== undefined && category !== '') params.append('category', category);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/annual-events?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getById: async (id: string | number): Promise<AnnualEvent> => {
    const response = await api.get(`/annual-events/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<AnnualEvent, 'id'>): Promise<AnnualEvent> => {
    const response = await api.post('/annual-events', data);
    return response.data.data;
  },

  update: async (id: string | number, data: Partial<AnnualEvent>): Promise<AnnualEvent> => {
    const response = await api.put(`/annual-events/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number): Promise<boolean> => {
    await api.delete(`/annual-events/${id}`);
    return true;
  },
};