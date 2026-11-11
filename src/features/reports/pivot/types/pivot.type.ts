export interface PivotData {
  id: string | number;
  employee_id?: string; // 👈 Kode ID Karyawan (EMP-001)
  nip: string;
  nama: string;
  departemen: string;
  sub_departemen: string;
  pos: string;
  grade: string;
  skema: string;
  masuk: number;
  libur: number;
  ph: number;
  izin: number;
  alfa: number;
  sakit: number;
  cuti: number;
  terlambat: number;
}

export interface PivotFilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  periode?: string;
  startDate?: string;
  endDate?: string;
  departemen?: string;
  sub_departemen?: string;
  pos?: string;
  grade?: string;
  skema?: string;
}

export interface PivotApiResponse {
  success: boolean;
  data: PivotData[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
  };
}