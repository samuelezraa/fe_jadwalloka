export interface Grade {
  id: string;      // ID Grade, contoh: LV-001
  grade: string;   // Nama Grade, contoh: General Manager
  status: 'Aktif' | 'Nonaktif';
  created_at?: string;
  updated_at?: string;
}