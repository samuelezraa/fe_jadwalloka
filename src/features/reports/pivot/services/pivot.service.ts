import { api } from '@/lib/axios';
import type { PivotData, PivotFilterParams } from '../types/pivot.type';

export const pivotService = {
  getPivotData: async (params?: PivotFilterParams): Promise<PivotData[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/reports/pivot', {
      params,
    });

    const rawList = response.data.data || response.data || [];

    return rawList.map((item: any, index: number) => ({
      id: item.id || String(index + 1),
      nip: item.nik || item.nip || '-',
      nama: item.nama || item.employee_name || item.employee?.full_name || '-',
      departemen: item.departemen || item.department_name || item.employee?.department?.name || '-',
      sub_departemen: item.sub_departemen || item.employee?.sub_department?.name || item.employee?.subDepartment?.name || '-',
      pos: item.pos || item.employee?.position?.title || item.employee?.position?.name || '-',
      grade: item.grade || item.employee?.grade?.name || '-',
      skema: item.skema || item.employee?.work_schedule_scheme?.code || item.work_scheme || '5-2',
      masuk: Number(item.masuk || item.work_days || 0),
      libur: Number(item.libur || item.off_days || 0),
      ph: Number(item.ph || item.ph_days || 0),
      izin: Number(item.izin || item.permit_days || 0),
      alfa: Number(item.alfa || item.alpha_days || 0),
      sakit: Number(item.sakit || item.sick_days || 0),
      cuti: Number(item.cuti || item.leave_days || 0),
      terlambat: Number(item.terlambat || item.late_days || 0),
    }));
  },
};