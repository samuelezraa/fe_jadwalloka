export interface PivotData {
  id: string | number;
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
  periode?: string;
  startDate?: string;
  endDate?: string;
}