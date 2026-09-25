export interface SkemaHariKerja {
  id: string;               // ID Skema (contoh: SK001)
  skema: string;            // Nama Skema (contoh: 5-2)
  jumlah_hari_kerja: number;// (contoh: 21)
  jumlah_hari_libur: number;// (contoh: 8)
  created_at?: string;
  updated_at?: string;
}