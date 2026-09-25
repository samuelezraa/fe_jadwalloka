import type { DataKaryawan } from '../types/data-karyawan.type';

let mockKaryawanList: DataKaryawan[] = [
  {
    id: '1',
    nik: '123456',
    id_absen: '9999',
    nama: 'Antika Lorien',
    departemen_id: 'DP001',
    departemen: 'IT',
    sub_departemen_id: 'SD001',
    sub_departemen: 'Aplikasi & System',
    pos_id: 'POS001',
    pos: 'Programmer Officer',
    grade_id: 'GR001',
    grade: 'Officer',
    skema_hari_kerja: '5-2',
    tanggal_bergabung: '2026-01-01',
    tanggal_lahir: '1999-01-01',
    nomor_telephone: '081234567890',
    email: 'antika.lorien@lokahr.com',
    status: 'Aktif',
  },
];

export const dataKaryawanService = {
  getAll: async (): Promise<DataKaryawan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockKaryawanList]);
      }, 500);
    });
  },

  create: async (data: Omit<DataKaryawan, 'id'>): Promise<DataKaryawan> => {
    const newItem: DataKaryawan = {
      ...data,
      id: String(Date.now()),
      status: 'Aktif', // Default aktif saat penambahan data baru
    };
    mockKaryawanList.push(newItem);
    return Promise.resolve(newItem);
  },

  update: async (id: string, data: Partial<DataKaryawan>): Promise<DataKaryawan> => {
    mockKaryawanList = mockKaryawanList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockKaryawanList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    mockKaryawanList = mockKaryawanList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },

  // Fitur Tambahan: Toggle Enable/Disable Status Karyawan
  toggleStatus: async (id: string): Promise<DataKaryawan> => {
    mockKaryawanList = mockKaryawanList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Aktif' ? 'Non Aktif' : 'Aktif',
        };
      }
      return item;
    });
    const updated = mockKaryawanList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  // Fitur Tambahan: Reset Password
  resetPassword: async (id: string): Promise<boolean> => {
    console.log(`Password untuk karyawan dengan ID ${id} berhasil direset.`);
    return Promise.resolve(true);
  },
};