export interface DashboardStats {
  present: number;
  late: number;
  sick: number;
  alpha: number;
  active_employees: number;
  inactive_employees: number;
}

export interface DashboardFilter {
  start_date?: string;
  end_date?: string;
  period?: string;
}