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
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  };
}

export const inputScheduleService = {
  // 1. Ambil daftar jadwal per periode (Pagination Server-Side, Search & Filter)
  getScheduleByPeriod: async (
    period: string,
    search?: string,
    deptId?: string,
    subDeptId?: string,
    status?: string,
    page = 1,
    perPage = 10
  ): Promise<ScheduleResponse> => {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (search) params.append('search', search);
    if (deptId) params.append('department_id', deptId);
    if (subDeptId) params.append('sub_department_id', subDeptId);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/schedule/input-schedule?${params.toString()}`);
    return response.data;
  },

  // 2. Detail jadwal harian karyawan untuk halaman edit
  getEmployeeScheduleDetail: async (id: string) => {
    const response = await api.get(`/schedule/input-schedule/edit/${id}`);
    return response.data;
  },

  // 3. Simpan perbaikan rincian jadwal harian karyawan
  updateEmployeeSchedule: async (id: string, payload: { scheduleList: any[] }) => {
    const response = await api.put(`/schedule/input-schedule/edit/${id}`, payload);
    return response.data;
  },

  // 4. Ambil jam kerja mingguan global terkini dari database
  getWeeklyWorkHours: async (): Promise<WeeklyWorkHourPayload> => {
    const response = await api.get('/schedule/input-schedule/weekly-hours');
    return response.data.data;
  },

  // 5. Setting jam kerja mingguan global
  setWeeklyWorkHours: async (payload: WeeklyWorkHourPayload) => {
    const response = await api.post('/schedule/input-schedule/weekly-hours', payload);
    return response.data;
  },

  // 6. Import file Excel/CSV jadwal
  importSchedule: async (file: File, period: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('period', period);
    const response = await api.post('/schedule/input-schedule/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 7. Export file data jadwal
  exportSchedule: async (period: string) => {
    const response = await api.get('/schedule/input-schedule/export', {
      params: { period },
      responseType: 'blob',
    });
    return response.data;
  },

  // Mengunduh sample template file import jadwal kehadiran
  downloadSample: async () => {
    const response = await api.get('/schedule/input-schedule/sample', {
      responseType: 'blob',
    });
    return response.data;
  },
};