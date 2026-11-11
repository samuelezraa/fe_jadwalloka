import { api } from '@/lib/axios';
import type { PeriodeJadwal, PeriodeJadwalFormData, PeriodApiResponse } from '../types/schedule-period.type';

export const schedulePeriodService = {
  getAll: async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<PeriodApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('per_page', params.perPage.toString());
    if (params.search) searchParams.append('search', params.search);

    const response = await api.get<PeriodApiResponse>(`/periods?${searchParams.toString()}`);
    return response.data;
  },

  create: async (data: PeriodeJadwalFormData): Promise<PeriodeJadwal> => {
    const payload = {
      name: data.periodeJadwal,
      start_date: data.tanggalAwal,
      end_date: data.tanggalAkhir,
      late_tolerance: data.toleransiKeterlambatan,
      description: 'Generate Successfully',
    };

    const response = await api.post('/periods', payload);
    return response.data.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await api.delete(`/periods/${id}`);
    return true;
  },
};