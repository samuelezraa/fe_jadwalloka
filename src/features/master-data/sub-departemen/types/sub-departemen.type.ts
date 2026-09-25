export interface SubDepartemen {
  id: string;             // ID Sub Departemen, ex: DS072
  departemen_id: string;  // ID Departemen relasi, ex: DP001
  departemen_nama: string;// Nama Departemen, ex: IT
  sub_departemen: string; // Nama Sub Departemen, ex: Aplikasi & System
  created_at?: string;
  updated_at?: string;
}