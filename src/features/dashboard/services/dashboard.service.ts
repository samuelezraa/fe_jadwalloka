import { api } from '@/lib/axios';
import type { DashboardStats, DashboardFilter } from '../types/dashboard.type';

export const dashboardService = {
  getStats: async (params?: DashboardFilter): Promise<DashboardStats> => {
    const response = await api.get<{ success: boolean; data: any }>('/dashboard/stats', {
      params,
    });

    const rawData = response.data.data || response.data || {};

    return {
      present: Number(rawData.present || rawData.masuk || 0),
      late: Number(rawData.late || rawData.terlambat || 0),
      sick: Number(rawData.sick || rawData.sakit || 0),
      alpha: Number(rawData.alpha || rawData.alfa || 0),
      active_employees: Number(rawData.active_employees || rawData.karyawan_aktif || rawData.karyawanAktif || 0),
      inactive_employees: Number(rawData.inactive_employees || rawData.karyawan_non_aktif || rawData.karyawanNonAktif || 0),
    };
  },
};