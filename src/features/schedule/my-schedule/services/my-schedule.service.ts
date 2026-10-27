import { api } from '@/lib/axios';
import type { MySchedule } from '../types/my-schedule.type';

export const myScheduleService = {
  getMyScheduleList: async (period: string): Promise<MySchedule[]> => {
    const response = await api.get<{ success: boolean; data: MySchedule[] }>('/schedule/jadwalku', {
      params: { period },
    });
    return response.data.data;
  },

  exportMySchedule: async (period: string, selectedIds: string[]) => {
    const response = await api.post('/schedule/jadwalku/export', { 
      period, 
      ids: selectedIds 
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};