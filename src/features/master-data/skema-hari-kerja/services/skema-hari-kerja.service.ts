import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';

// Mock data awal sesuai referensi gambar spesifikasi
let mockSkemaList: SkemaHariKerja[] = [
  {
    id: 'SK001',
    skema: '5-2',
    jumlah_hari_kerja: 21,
    jumlah_hari_libur: 8,
  },
  {
    id: 'SK002',
    skema: '5-1',
    jumlah_hari_kerja: 25,
    jumlah_hari_libur: 8,
  },
  {
    id: 'SK003',
    skema: '6-1',
    jumlah_hari_kerja: 25,
    jumlah_hari_libur: 5,
  },
];

export const skemaHariKerjaService = {
  // Mengambil semua data (dengan simulasi delay jaringan 500ms untuk loading state)
  getAll: async (): Promise<SkemaHariKerja[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSkemaList]);
      }, 500);
    });
  },

  // Menambah data baru
  create: async (data: SkemaHariKerja): Promise<SkemaHariKerja> => {
    mockSkemaList.push(data);
    return Promise.resolve(data);
  },

  // Mengubah data (edit)
  update: async (id: string, data: Partial<SkemaHariKerja>): Promise<SkemaHariKerja> => {
    mockSkemaList = mockSkemaList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockSkemaList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  // Menghapus data
  delete: async (id: string): Promise<boolean> => {
    mockSkemaList = mockSkemaList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};