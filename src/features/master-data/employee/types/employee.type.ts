export interface Employee {
  id?: string | number;
  employee_id?: string;
  nip?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  department_id?: string | number;
  sub_department_id?: string | number;
  position_id?: string | number;
  grade_id?: string | number;
  work_schedule_scheme_id?: string | number;
  join_date?: string;
  birth_date?: string;
  age_years?: number | string;
  work_duration_months?: number | string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;

  department?: { id: number | string; name: string };
  sub_department?: { id: number | string; name: string };
  position?: { id: number | string; name: string; title?: string };
  grade?: { id: number | string; name: string };
  work_schedule_scheme?: { id: number | string; name: string };
}