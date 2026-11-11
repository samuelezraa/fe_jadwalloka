export interface SchedulePeriodSummary {
  totalPeriodDays: number;
  totalWorkDays: number;
  totalOffDays: number;
  totalPhDays: number;
  totalPermitDays: number;
  totalAlphaDays: number;
  totalLeaveDays: number;
  totalLateDays: number;
}

export interface InputSchedulePeriodItem {
  id: string;
  periodId: string;
  nip: string;
  name: string;
  department_id?: number | string;
  department?: string;
  sub_department_id?: number | string;
  subDept: string;
  workScheme: string;
  status: 'Aktif' | 'Nonaktif';
  totalDays: number;
  workDays: number;
  offDays: number;
  phDays: number;
  permitDays: number;
  alphaDays: number;
  leaveDays: number;
  lateDays: number;
  ref?: string;
}