import { api } from '@/lib/axios';
import type { AttendanceDetailResponse, DetailKehadiranHarian, EmployeeAttendanceApiResponse } from '../types/employee-attendance.type';

export interface AttendanceFilterParams {
  period?: string;
  page?: number;
  perPage?: number;
  search?: string;
  dept?: string;
  subDept?: string;
}

export const employeeAttendanceService = {
  getAll: async (params: AttendanceFilterParams = {}): Promise<EmployeeAttendanceApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params.period) searchParams.append('period', params.period);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('per_page', params.perPage.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.dept) searchParams.append('dept', params.dept);
    if (params.subDept) searchParams.append('sub_dept', params.subDept);

    const response = await api.get<EmployeeAttendanceApiResponse>(`/employee-attendances?${searchParams.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<AttendanceDetailResponse> => {
    const response = await api.get(`/employee-attendances/${id}`);
    return response.data;
  },

  update: async (id: string, jadwalList: DetailKehadiranHarian[]): Promise<void> => {
    await api.put(`/employee-attendances/${id}`, { jadwalList });
  },
};