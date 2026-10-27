export interface Grade {
  id?: string | number;
  code: string;
  name: string;
  level?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;

  // Fallback kompatibilitas nama lama dari backend/mock data jika ada
  kode_grade?: string;
  nama_grade?: string;
  grade?: string;
  status?: string;
}