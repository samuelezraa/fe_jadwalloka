import { api } from '@/lib/axios';
import type { InputSchedulePeriodItem, SchedulePeriodSummary } from '../types/input-schedule.type';

export interface WeeklyWorkHourPayload {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ScheduleResponse {
  data: InputSchedulePeriodItem[];
  summary: SchedulePeriodSummary;
}

export const inputScheduleService = {
  // Mendapatkan daftar jadwal & ringkasan berdasarkan periode
  getScheduleByPeriod: async (period: string): Promise<ScheduleResponse> => {
    const response = await api.get(`/schedule/input-schedule`, {
      params: { period },
    });
    return response.data;
  },

  // Mendapatkan detail jadwal harian karyawan berdasarkan ID untuk halaman edit
  getEmployeeScheduleDetail: async (id: string) => {
    const response = await api.get(`/schedule/input-schedule/edit/${id}`);
    return response.data;
  },

  // Menyimpan / memperbarui rincian jadwal harian karyawan
  updateEmployeeSchedule: async (id: string, payload: any) => {
    const response = await api.put(`/schedule/input-schedule/edit/${id}`, payload);
    return response.data;
  },

  // Mengatur jam kerja mingguan global
  setWeeklyWorkHours: async (payload: WeeklyWorkHourPayload) => {
    const response = await api.post(`/schedule/input-schedule/weekly-hours`, payload);
    return response.data;
  },

  // Import file Excel/CSV jadwal
  importSchedule: async (file: File, period: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('period', period);
    const response = await api.post(`/schedule/input-schedule/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Export data jadwal
  exportSchedule: async (period: string) => {
    const response = await api.get(`/schedule/input-schedule/export`, {
      params: { period },
      responseType: 'blob',
    });
    return response.data;
  },
};