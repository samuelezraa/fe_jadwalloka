import { api } from '@/lib/axios';
import type { Employee } from '../types/employee.type';

export const employeeService = {
  getAll: async (
    search?: string,
    departmentId?: string,
    subDepartmentId?: string,
    positionId?: string,
    gradeId?: string,
    status?: string,
    page = 1,
    perPage = 10
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (departmentId) params.append('department_id', departmentId);
    if (subDepartmentId) params.append('sub_department_id', subDepartmentId);
    if (positionId) params.append('position_id', positionId);
    if (gradeId) params.append('grade_id', gradeId);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/employees?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getById: async (id: string | number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await api.post('/employees', data);
    return response.data.data;
  },

  update: async (id: string | number, data: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number): Promise<boolean> => {
    await api.delete(`/employees/${id}`);
    return true;
  },

  exportData: async (ids?: (string | number)[]) => {
    const params = new URLSearchParams();
    if (ids && ids.length > 0) {
      params.append('ids', ids.join(','));
    }
    const response = await api.get(`/employees/export?${params.toString()}`, { responseType: 'blob' });
    return response.data;
  },

  bulkToggleStatus: async (ids: (string | number)[]) => {
    const response = await api.post('/employees/bulk-status', { ids });
    return response.data;
  },

  importData: async (formData: FormData) => {
    const response = await api.post('/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadSample: async () => {
    const response = await api.get('/employees/download-sample', { responseType: 'blob' });
    return response.data;
  },


  bulkResetPassword: async (ids: (string | number)[]) => {
    const response = await api.post('/employees/bulk-reset-password', { ids });
    return response.data;
  },
};