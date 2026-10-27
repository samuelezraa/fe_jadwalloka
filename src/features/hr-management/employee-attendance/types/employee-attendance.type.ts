export interface HrManagementItem {
  id: string;
  nip: string;
  nama: string;
  departemen: string;
  subDepartemen: string;
  subDept: string;
  pos: string;
  grade: string;
  skemaKerja: string;
  totalLibur: number;
  totalPH: number;
  totalIzin: number;
  totalAlfa: number;
  totalSakit: number;
  totalCuti: number;
  totalTerlambat: number;
  totalMasuk: number;
  totalHari: number;
}

export interface DetailKehadiranHarian {
  id: string;
  no: number;
  hari: string;
  tanggal: string;
  kehadiran: 'Berangkat' | 'Libur' | 'PH' | 'Alfa' | 'Cuti';
  jamDatang: string;
  jamPulang: string;
  absenDatang: string;
  absenPulang: string;
  status: string;
  keterangan: string;
  ref: string;
}

export interface KaryawanAttendanceInfo {
  nama: string;
  nip: string;
  periode: string;
  rentangTanggal: string;
  skema: string;
  totalHariKerja: number;
  jamKerjaPerHari: number;
}

export interface AttendanceDetailResponse {
  karyawanInfo: KaryawanAttendanceInfo;
  jadwalList: DetailKehadiranHarian[];
}