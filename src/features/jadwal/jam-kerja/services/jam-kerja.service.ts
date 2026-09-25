import type { JamKerjaKaryawan } from '../types/jam-kerja.type';

let mockJamKerjaList: JamKerjaKaryawan[] = [
  {
    id_karyawan: '9999',
    nama: 'Antika Lorien',
    departemen: 'IT',
    sub_departemen: 'Aplikasi & System',
    tipe_jam_kerja: 'Flextime',
    jadwal_mingguan: {
      senin: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
      selasa: { status: 'Berangkat', jam_masuk: '09:05:00', jam_pulang: '18:05:00' },
      rabu: { status: 'Berangkat', jam_masuk: '09:04:00', jam_pulang: '18:04:00' },
      kamis: { status: 'Berangkat', jam_masuk: '09:00:00', jam_pulang: '18:00:00' },
      jumat: { status: 'Berangkat', jam_masuk: '09:00:00', jam_pulang: '17:00:00' },
      sabtu: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
      minggu: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
    },
  },
];

export const jamKerjaService = {
  getAll: async (): Promise<JamKerjaKaryawan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockJamKerjaList]);
      }, 500);
    });
  },

  update: async (id_karyawan: string, jadwalBaru: JamKerjaKaryawan['jadwal_mingguan']): Promise<JamKerjaKaryawan> => {
    mockJamKerjaList = mockJamKerjaList.map((item) =>
      item.id_karyawan === id_karyawan ? { ...item, jadwal_mingguan: jadwalBaru } : item
    );
    const updated = mockJamKerjaList.find((item) => item.id_karyawan === id_karyawan)!;
    return Promise.resolve(updated);
  },
};