import { api } from '@/lib/axios';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';

export const subDepartemenService = {
  getAll: async (
    search?: string,
    deptCode?: string,
    status?: string,
    page = 1,
    perPage = 10
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (deptCode) params.append('department_code', deptCode);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/sub-departments?${params.toString()}`);

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  create: async (data: SubDepartemenFormValues): Promise<SubDepartemen> => {
    const response = await api.post('/sub-departments', data);
    return response.data.data;
  },

  update: async (id: number, data: SubDepartemenFormValues): Promise<SubDepartemen> => {
    const response = await api.put(`/sub-departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sub-departments/${id}`);
  },
};