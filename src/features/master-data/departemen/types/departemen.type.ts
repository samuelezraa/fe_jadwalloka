export interface Departemen {
  id: string;          // Contoh: DP001
  departemen: string;  // Contoh: IT, HRD, Operasional
  status?: 'Aktif' | 'Non Aktif';
  created_at?: string;
  updated_at?: string;
}

export interface DepartemenResponse {
  data: Departemen[];
  total: number;
  page: number;
  per_page: number;
}