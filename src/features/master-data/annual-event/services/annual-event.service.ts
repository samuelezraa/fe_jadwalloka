import { api } from '@/lib/axios';
import type { AnnualEvent } from '../types/annual-event.type';

export const annualEventService = {
  getAll: async (): Promise<AnnualEvent[]> => {
    const response = await api.get('/annual-events');
    return response.data.data;
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