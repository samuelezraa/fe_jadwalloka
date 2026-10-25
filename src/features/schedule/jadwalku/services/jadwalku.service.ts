import type { Jadwalku } from '../types/jadwalku.type';

const dummyJadwalkuData: Jadwalku[] = [
  {
    id: '1',
    nip: '220-1112',
    nama: 'Antika Lorien',
    departemen: 'IT',
    sub_departemen: 'Aplikasi & System',
    periode: '2026-09',
    libur: 4,
    ph: 1,
    izin: 0,
    alfa: 0,
    sakit: 0,
    cuti: 0,
    terlambat: 0,
    masuk: 25,
    total_hari: 21,
  },
];

export const jadwalkuService = {
  getJadwalkuList: async (): Promise<Jadwalku[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...dummyJadwalkuData]), 300);
    });
  },
};