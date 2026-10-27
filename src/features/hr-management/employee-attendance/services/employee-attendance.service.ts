import { api } from '@/lib/axios';
import type { 
  HrManagementItem, 
  AttendanceDetailResponse, 
  DetailKehadiranHarian 
} from '../types/employee-attendance.type';

export const employeeAttendanceService = {
  // Mengambil daftar rekapitulasi absensi berdasarkan kode periode
  getAll: async (period?: string): Promise<HrManagementItem[]> => {
    const response = await api.get('/employee-attendances', {
      params: { period },
    });
    return response.data.data;
  },

  // Mengambil rincian absensi harian karyawan berdasarkan ID
  getById: async (id: string): Promise<AttendanceDetailResponse> => {
    const response = await api.get(`/employee-attendances/${id}`);
    return response.data;
  },

  // Menyimpan pembaruan absensi harian karyawan
  update: async (id: string, jadwalList: DetailKehadiranHarian[]): Promise<void> => {
    await api.put(`/employee-attendances/${id}`, { jadwalList });
  },
};