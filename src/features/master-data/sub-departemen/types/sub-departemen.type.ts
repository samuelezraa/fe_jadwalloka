export interface SubDepartemen {
  id?: string | number;
  code: string;
  name: string;
  department_code: string;
  department_name?: string; // 👈 Tambahkan properti ini
  is_active: boolean;
  
  // Property legacy (opsional, jika backend masih mengirim format lama)
  departemen_id?: string;
  departemen_nama?: string;
  sub_departemen?: string;
  status?: string;
}