export interface CustomJamKerja {
  id: string;
  periodeStart: string;
  periodeEnd: string;
  skemaHariKerja: string;
  jamMasuk: string;
  toleransiKeterlambatan: string;
  keterangan: string;
  status: 'Aktif' | 'Nonaktif';
}