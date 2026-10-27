export interface EmployeePresence {
  id: string | number;
  department: string;
  totalPax: number;
}

export interface EmployeePresenceFilterParams {
  selectedPeriode?: string;
  startDate?: string;
  endDate?: string;
}