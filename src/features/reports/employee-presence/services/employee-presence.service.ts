import { api } from '@/lib/axios';
import type { EmployeePresenceFilterParams, EmployeePresenceApiResponse } from '../types/employee-presence.type';

export const employeePresenceService = {
  getPresenceData: async (params: EmployeePresenceFilterParams = {}): Promise<EmployeePresenceApiResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('per_page', params.perPage.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.selectedPeriode) searchParams.append('periode', params.selectedPeriode);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);

    const response = await api.get<EmployeePresenceApiResponse>(
      `/reports/employee-presence?${searchParams.toString()}`
    );
    return response.data;
  },

  exportEmployeePresenceReport: async (params: EmployeePresenceFilterParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append('search', params.search);
    if (params.selectedPeriode) searchParams.append('periode', params.selectedPeriode);
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);

    const response = await api.get(`/reports/employee-presence/export?${searchParams.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },
};