export interface Departemen {
  id: number;
  code: string;        // ID Departemen (contoh: DP001)
  name: string;        // Nama Departemen (contoh: IT)
  is_active: boolean;  // Status Aktif (true / false)
  created_at?: string;
  updated_at?: string;
}

export interface DepartemenResponse {
  data: Departemen[];
  total: number;
  page: number;
  per_page: number;
}