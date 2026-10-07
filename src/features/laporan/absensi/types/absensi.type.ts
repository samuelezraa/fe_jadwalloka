export interface LaporanAbsensi {
  id: number;
  nip: string;
  name: string;
  dept: string;
  subDept: string;
  pos: string;
  grade: string;
  idEnrollKaryawan: string;
  verifikasiAbsen: string;
  verifikasiKehadiran: string;
  jamAbsen: string;
  tanggalAbsen: string;
  waktuUploadData: string;
  idMesin: string;
  ipMesin: string;
}