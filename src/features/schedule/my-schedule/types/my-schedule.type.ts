export interface MySchedule {
  id: string;
  period: string;
  nip: string;
  name: string;
  department: string;
  sub_department: string;
  grade?: string;
  off_days: number;
  ph_days: number;
  permit_days: number;
  alpha_days: number;
  sick_days: number;
  leave_days: number;
  late_days: number;
  work_days: number;
  total_days: number;
}