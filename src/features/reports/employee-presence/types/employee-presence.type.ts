export interface EmployeePresence {
  id: string | number;
  department: string;
  totalPax: number;
}

export interface EmployeePresenceFilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  selectedPeriode?: string;
  startDate?: string;
  endDate?: string;
}

export interface EmployeePresenceApiResponse {
  success: boolean;
  data: EmployeePresence[];
  grandTotalPax?: number;
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
  };
}