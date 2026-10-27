export interface CustomWorkHour {
  id?: number | string;
  code?: string; // ID otomatis dari backend (misal: CUS001)
  start_date: string;
  end_date: string;
  work_scheme: string; // Skema Hari Kerja (misal: 5-2)
  clock_in: string; // Jam Masuk
  tolerance?: string; // Toleransi Keterlambatan
  description?: string; // Keterangan
  is_active: boolean;
  [key: string]: any;
}