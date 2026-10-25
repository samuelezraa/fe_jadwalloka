import { api } from '@/lib/axios';
import type { Employee } from '../types/employee.type';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data.data;
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

  exportData: async () => {
    const response = await api.get('/employees/export', { responseType: 'blob' });
    return response.data;
  },

  
  bulkToggleStatus: async (ids: (string | number)[]) => {
    const response = await api.post('/employees/bulk-status', { ids });
    return response.data;
  },
};