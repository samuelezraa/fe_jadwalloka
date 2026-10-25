import { api } from '@/lib/axios';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';

export const posService = {
  getAll: async (): Promise<Pos[]> => {
    const response = await api.get('/positions');
    return response.data.data;
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