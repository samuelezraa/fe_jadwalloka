export interface PeriodeJadwal {
  id: number;
  idPeriode: string;
  periode: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  keterangan: string;
}

export interface PeriodeJadwalFormData {
  periodeJadwal: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  toleransiKeterlambatan: string;
}