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
  karyawanAktif?: number;     // <-- Tambahkan ini
  karyawanNonAktif?: number;  
}

export interface DashboardFilter {
  tanggal?: string;
  periode?: string;
}
