export interface LogHistory {
  id: string;
  tipe: 'Create' | 'Edit' | 'Delete';
  menu: string;
  subMenu: string;
  pic: string;
  tanggal: string; // Format: YYYY-MM-DD
  keterangan: string;
}