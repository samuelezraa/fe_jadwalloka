export interface Pos {
  id: string;               // ID POS, contoh: POS01
  departemen_id: string;    // ID Departemen
  departemen_nama: string;  // Nama Departemen, contoh: IT
  sub_departemen_id: string;// ID Sub Departemen
  sub_departemen_nama: string; // Nama Sub Departemen, contoh: Aplikasi & System
  pos: string;              // Nama POS, contoh: Programmer Officer
  status: 'Aktif' | 'Nonaktif';
  created_at?: string;
  updated_at?: string;
}