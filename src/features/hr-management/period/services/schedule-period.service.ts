import { api } from '@/lib/axios';
import type { PeriodeJadwal, PeriodeJadwalFormData } from '../types/schedule-period.type';

export const schedulePeriodService = {
  getAll: async (): Promise<PeriodeJadwal[]> => {
    const response = await api.get('/periods');
    return response.data.data;
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