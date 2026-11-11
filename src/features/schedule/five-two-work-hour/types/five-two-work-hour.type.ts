export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ScheduleDetailItem {
  id?: number | string;
  schedule_id?: number | string;
  day_of_week: DayOfWeek;
  check_in_time: string;
  check_out_time: string;
  is_day_off?: boolean;
  is_active?: boolean;
}

export interface WorkScheduleSchemeItem {
  id: number | string;
  code?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface ScheduleSchemeItem {
  id?: number | string;
  schedule_id?: number | string;
  work_schedule_scheme_id?: number | string;
  is_active?: boolean;
  work_schedule_scheme?: WorkScheduleSchemeItem;
}

export interface DayScheduleFormValue {
  status: 'Berangkat' | 'Libur';
  check_in_time: string;
  check_out_time: string;
}

export interface FiveTwoWorkHourEmployee {
  id: number | string;
  name?: string;
  employee_id_code?: string;
  nip?: string;
  employee_name?: string;
  department_name?: string;
  sub_department_name?: string;
  is_active?: boolean;
  employee_id?: number | string;
  employee?: {
    id: number | string;
    employee_id?: string;
    nip?: string;
    full_name?: string;
  };
  department_id?: number | string;
  sub_department_id?: number | string;
  department?: { id: number | string; name: string };
  sub_department?: { id: number | string; name: string };
  work_hour_type?: string;
  weekly_schedule?: Record<string, DayScheduleFormValue>;
  schedule_details?: ScheduleDetailItem[];
  schedule_schemes?: ScheduleSchemeItem[];
  created_at?: string;
  updated_at?: string;
}