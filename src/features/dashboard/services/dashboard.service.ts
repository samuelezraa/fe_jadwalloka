import axios from 'axios';

export interface DashboardStats {
  totalKaryawan: number;
  karyawanBelumAbsen: number;
  totalDepartemen: number;
  totalSubDepartemen: number;
  kehadiranAktual: number;
  kehadiranPotensial: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // Simulasi data dummy API untuk HR LokaHR
    return {
      totalKaryawan: 245,
      karyawanBelumAbsen: 15,
      totalDepartemen: 8,
      totalSubDepartemen: 24,
      kehadiranAktual: 230,
      kehadiranPotensial: 245,
    };
  },
};