export interface InputJadwalPeriode {
  id: string;
  status: 'Aktif' | 'Non Aktif';
  id_periode: string;
  nip: string;
  nama: string;
  sub_dept: string;
  skema_kerja: string;
  total_hari: number;
  masuk: number;
  total_libur: number;
  ph: number;
  cuti: number;
  ref?: string;
}