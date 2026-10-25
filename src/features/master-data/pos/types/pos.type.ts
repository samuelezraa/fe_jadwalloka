export interface Pos {
  id: number;
  code: string;       // Kode POS/Jabatan (contoh: POS01)
  title: string;      // Nama POS/Jabatan (contoh: Programmer Officer)
  is_active: boolean; // Flag Status
  department_code?: string;
  sub_department_code?: string;
  created_at?: string;
  updated_at?: string;
}