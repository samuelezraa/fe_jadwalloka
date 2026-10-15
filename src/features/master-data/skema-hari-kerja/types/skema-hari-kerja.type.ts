export interface SkemaHariKerja {
  id: string;
  skema: string;
  jumlah_hari_kerja: number;
  jam_kerja_per_hari: number;
  total_jam_per_minggu: number;
  total_jam_per_bulan: number;
  status: 'Aktif' | 'Non Aktif';
}