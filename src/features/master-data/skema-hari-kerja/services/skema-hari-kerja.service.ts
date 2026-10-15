import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';

// Mock data awal disesuaikan dengan atribut terbaru
let mockSkemaList: SkemaHariKerja[] = [
  {
    id: 'SK001',
    skema: '5-2',
    jumlah_hari_kerja: 5,
    jam_kerja_per_hari: 8,
    total_jam_per_minggu: 40,
    total_jam_per_bulan: 160,
    status: 'Aktif',
  },
  {
    id: 'SK002',
    skema: '5-1',
    jumlah_hari_kerja: 5,
    jam_kerja_per_hari: 7,
    total_jam_per_minggu: 35,
    total_jam_per_bulan: 140,
    status: 'Aktif',
  },
  {
    id: 'SK003',
    skema: '6-1',
    jumlah_hari_kerja: 6,
    jam_kerja_per_hari: 7,
    total_jam_per_minggu: 42,
    total_jam_per_bulan: 168,
    status: 'Aktif',
  },
];

export const skemaHariKerjaService = {
  // Mengambil semua data
  getAll: async (): Promise<SkemaHariKerja[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSkemaList]);
      }, 200);
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