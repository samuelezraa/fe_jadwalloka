import type { KomplimenData } from '../types/komplimen.type';

export const komplimenService = {
  getKomplimenData: async (): Promise<KomplimenData[]> => {
    // Simulasi data dari API
    return [
      {
        id: '1',
        nip: '9999',
        nama: 'User Trial IT',
        departemen: 'IT',
        sub_departemen: 'Aplikasi & System',
        tanggal: '2026-03-01',
        kategori: 'Koreksi Absen Masuk',
        keterangan: 'Lupa scan fingerprint karena mesin error',
        status: 'Approved',
      },
      {
        id: '2',
        nip: '123456',
        nama: 'Antika Lorien',
        departemen: 'IT',
        sub_departemen: 'Aplikasi & System',
        tanggal: '2026-03-02',
        kategori: 'Lembur',
        keterangan: 'Maintenance server malam hari',
        status: 'Pending',
      },
    ];
  },
};