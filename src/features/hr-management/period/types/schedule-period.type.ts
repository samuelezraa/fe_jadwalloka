export interface PeriodeJadwal {
  id: number;
  idPeriode: string;
  periode: string;
  tanggalAwal: string; // Format DD-MM-YYYY
  tanggalAkhir: string; // Format DD-MM-YYYY
  lateTolerance?: string;
  keterangan: string;
  isClosed?: boolean;
  isActive?: boolean;
}

export interface PeriodeJadwalFormData {
  periodeJadwal: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  toleransiKeterlambatan: string; // Format HH:mm:ss
}

export interface PeriodApiResponse {
  success: boolean;
  data: PeriodeJadwal[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
  };
}