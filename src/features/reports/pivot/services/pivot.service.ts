import { api } from '@/lib/axios';
import type { PivotFilterParams, PivotApiResponse } from '../types/pivot.type';

export const pivotService = {
  getPivotData: async (params: PivotFilterParams = {}): Promise<PivotApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('per_page', params.perPage.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.periode) searchParams.append('periode', params.periode);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);
    if (params.departemen) searchParams.append('departemen', params.departemen);
    if (params.sub_departemen) searchParams.append('sub_departemen', params.sub_departemen);
    if (params.pos) searchParams.append('pos', params.pos);
    if (params.grade) searchParams.append('grade', params.grade);
    if (params.skema) searchParams.append('skema', params.skema);

    const response = await api.get<PivotApiResponse>(
      `/reports/pivot?${searchParams.toString()}`
    );
    return response.data;
  },

  // 🟢 Tambahkan fungsi exportPivotReport ini:
  exportPivotReport: async (params: PivotFilterParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append('search', params.search);
    if (params.periode) searchParams.append('periode', params.periode);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);
    if (params.departemen) searchParams.append('departemen', params.departemen);
    if (params.sub_departemen) searchParams.append('sub_departemen', params.sub_departemen);
    if (params.pos) searchParams.append('pos', params.pos);
    if (params.grade) searchParams.append('grade', params.grade);
    if (params.skema) searchParams.append('skema', params.skema);

    const response = await api.get(`/reports/pivot/export?${searchParams.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },
};