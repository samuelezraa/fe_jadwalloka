import { api } from '@/lib/axios';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';

export const posService = {
  getAll: async (
    search?: string,
    deptCode?: string,
    subDeptCode?: string,
    status?: string,
    page = 1,
    perPage = 10
  ) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (deptCode) params.append('department_code', deptCode);
    if (subDeptCode) params.append('sub_department_code', subDeptCode);
    if (status !== undefined && status !== '') params.append('status', status);
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await api.get(`/positions?${params.toString()}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  create: async (data: PosFormValues): Promise<Pos> => {
    const response = await api.post('/positions', {
      code: data.code,
      title: data.title,
      department_code: data.department_code,
      sub_department_code: data.sub_department_code,
      is_active: data.is_active ?? true,
    });
    return response.data.data;
  },

  update: async (id: number | string, data: PosFormValues): Promise<Pos> => {
    const response = await api.put(`/positions/${id}`, {
      code: data.code,
      title: data.title,
      department_code: data.department_code,
      sub_department_code: data.sub_department_code,
      is_active: data.is_active,
    });
    return response.data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/positions/${id}`);
  },
};