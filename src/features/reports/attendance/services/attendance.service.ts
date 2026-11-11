import { api } from '@/lib/axios';
import type { AttendanceReport } from '../types/attendance.type';

export interface AttendanceParams {
  page?: number;
  perPage?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  dept?: string;
  subDept?: string;
  grade?: string;
}

export interface AttendanceApiResponse {
  success: boolean;
  data: AttendanceReport[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export const attendanceService = {
  getAttendanceList: async (params: AttendanceParams = {}): Promise<AttendanceApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('per_page', params.perPage.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);
    if (params.dept) searchParams.append('dept', params.dept);
    if (params.subDept) searchParams.append('sub_dept', params.subDept);
    if (params.grade) searchParams.append('grade', params.grade);

    const response = await api.get<AttendanceApiResponse>(
      `/attendance-log-details?${searchParams.toString()}`
    );
    return response.data;
  },


  exportAttendanceReport: async (params: AttendanceParams = {}): Promise<Blob> => {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append('search', params.search);
  if (params.startDate) searchParams.append('start_date', params.startDate);
  if (params.endDate) searchParams.append('end_date', params.endDate);
  if (params.dept) searchParams.append('dept', params.dept);
  if (params.subDept) searchParams.append('sub_dept', params.subDept);
  if (params.grade) searchParams.append('grade', params.grade);

  const response = await api.get(`/attendance-log-details/export?${searchParams.toString()}`, {
    responseType: 'blob',
  });

  return response.data;
},
};