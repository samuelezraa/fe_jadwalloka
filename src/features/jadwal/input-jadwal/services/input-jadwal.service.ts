import type { InputJadwalPeriode } from '../types/input-jadwal.type';
import type { InputJadwalFormValues } from '../schemas/input-jadwal.schema';

// Dummy data awal sesuai spesifikasi
const dummyInputJadwalData: InputJadwalPeriode[] = [
  {
    id: '1',
    status: 'Aktif',
    id_periode: 'PER01',
    nip: '9999',
    nama: 'Antika Lorien',
    sub_dept: 'Aplikasi & System',
    skema_kerja: '5-2',
    total_hari: 22,
    masuk: 20,
    total_libur: 8,
    ph: 2,
    cuti: 2,
    ref: '',
  },
];

export const inputJadwalService = {
  getJadwalPeriodeList: async (): Promise<InputJadwalPeriode[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...dummyInputJadwalData]), 300);
    });
  },

  updateJadwalPeriode: async (
    id: string,
    payload: InputJadwalFormValues
  ): Promise<InputJadwalPeriode> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = dummyInputJadwalData.findIndex((item) => item.id === id);
        if (index !== -1) {
          dummyInputJadwalData[index] = {
            ...dummyInputJadwalData[index],
            ...payload,
          };
        }
        resolve(dummyInputJadwalData[index]);
      }, 300);
    });
  },
};