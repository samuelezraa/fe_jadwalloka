import { api } from '@/lib/axios';
import type { EmployeePresence, EmployeePresenceFilterParams } from '../types/employee-presence.type';

export const employeePresenceService = {
  getPresenceData: async (params?: EmployeePresenceFilterParams): Promise<EmployeePresence[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/reports/employee-presence', {
      params,
    });

    const rawList = response.data.data || response.data || [];

    return rawList.map((item: any, index: number) => ({
      id: item.id || String(index + 1),
      department: item.department || item.department_name || item.departemen || '-',
      totalPax: Number(item.totalPax || item.total_pax || item.total || 0),
    }));
  },
};