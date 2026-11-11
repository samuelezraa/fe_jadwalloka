import { api } from '@/lib/axios';
import type { MySchedule } from '../types/my-schedule.type';

export const myScheduleService = {
  getMyScheduleList: async (
    period: string,
    page: number = 1,
    perPage: number = 10,
    search: string = '',
    departmentId: string = '',
    subDepartment: string = '',
    grade: string = ''
  ): Promise<{ data: MySchedule[]; meta: any }> => {
    const response = await api.get<{
      success: boolean;
      data: MySchedule[];
      meta: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      };
    }>('/schedule/jadwalku', {
      params: {
        period,
        page,
        per_page: perPage,
        search,
        department_id: departmentId,
        sub_department: subDepartment,
        grade,
      },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  exportMySchedule: async (period: string, selectedIds: string[]) => {
    const response = await api.post(
      '/schedule/jadwalku/export',
      { period, ids: selectedIds },
      { responseType: 'blob' }
    );
    return response.data;
  },
};