export interface DashboardStats {
  masuk?: number;
  terlambat?: number;
  sakit?: number;
  alfa?: number;
  totalKaryawan?: number;
  karyawanBelumAbsen?: number;
  totalDepartemen?: number;
  totalSubDepartemen?: number;
  kehadiranAktual?: number;
  kehadiranPotensial?: number;
}

export interface DashboardFilter {
  tanggal?: string;
  periode?: string;
}