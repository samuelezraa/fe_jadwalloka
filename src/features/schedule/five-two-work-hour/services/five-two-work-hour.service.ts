import { api } from '@/lib/axios';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';

export interface ScheduleExportFilters {
  search?: string;
  department_id?: string;
  sub_department_id?: string;
  status?: string;
}

export const fiveTwoWorkHourService = {
  getAll: async (
    search?: string,
    deptId?: string,
    subDeptId?: string,
    status?: string,
    page = 1,
    perPage = 25
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (deptId) params.append('department_id', deptId);
    if (subDeptId) params.append('sub_department_id', subDeptId);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/schedules?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getById: async (id: number | string): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.get(`/schedules/${id}`);
    return response.data.data;
  },

  create: async (data: FiveTwoWorkHourFormValues): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.post('/schedules', data);
    return response.data.data;
  },

  update: async (
    id: number | string,
    data: FiveTwoWorkHourFormValues
  ): Promise<FiveTwoWorkHourEmployee> => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await api.delete(`/schedules/${id}`);
    return true;
  },

  exportData: async (
    selectedIds?: (string | number)[],
    filters?: ScheduleExportFilters
  ) => {
    const params = new URLSearchParams();
    if (selectedIds && selectedIds.length > 0) {
      params.append('selectedIds', selectedIds.join(','));
    }
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department_id) params.append('department_id', filters.department_id);
    if (filters?.sub_department_id) params.append('sub_department_id', filters.sub_department_id);
    if (filters?.status !== undefined && filters?.status !== '') {
      params.append('status', filters.status);
    }

    const response = await api.get(`/schedules/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Jam_Kerja_Skema_5-2_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  importData: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/schedules/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadSample: async () => {
    const response = await api.get('/schedules/download-sample', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sample_Import_Jam_Kerja_Skema_5-2.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};