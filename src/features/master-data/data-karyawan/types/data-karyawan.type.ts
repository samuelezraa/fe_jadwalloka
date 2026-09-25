export interface DataKaryawan {
  id: string;             // ID Karyawan / System ID
  nik: string;            // NIK Karyawan
  id_absen: string;       // ID Absen / Username (angka)
  nama: string;           // Nama lengkap
  departemen_id: string;
  departemen: string;     // Nama Departemen
  sub_departemen_id: string;
  sub_departemen: string; // Nama Sub Departemen
  pos_id: string;
  pos: string;            // Posisi Jabatan (POS)
  grade_id: string;
  grade: string;          // Grade jabatan
  skema_hari_kerja: string; // Contoh: 5-2
  tanggal_bergabung: string; // Format: YYYY-MM-DD
  tanggal_lahir: string;  // Format: YYYY-MM-DD
  nomor_telephone: string;
  email: string;
  status: 'Aktif' | 'Non Aktif';
  created_at?: string;
  updated_at?: string;
}