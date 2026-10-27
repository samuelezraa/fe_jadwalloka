export interface KomplimenData {
  id: string;
  nip: string;
  nama: string;
  departemen: string;
  sub_departemen: string;
  tanggal: string;
  kategori: string;
  keterangan: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}