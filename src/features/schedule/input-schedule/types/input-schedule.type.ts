export interface SchedulePeriodSummary {
  totalPeriodDays: number; // Total Hari Periode
  totalWorkDays: number;   // Total Masuk
  totalOffDays: number;    // Total Libur
  totalPhDays: number;     // Total PH
  totalPermitDays: number; // Total Izin
  totalAlphaDays: number;  // Total Alfa
  totalLeaveDays: number;  // Total Cuti
  totalLateDays: number;   // Total Terlambat
}

export interface InputSchedulePeriodItem {
  id: string;
  periodId: string;
  nip: string;
  name: string;
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