import type { Pos } from '../types/pos.type';

let mockPosList: Pos[] = [
  {
    id: 'POS01',
    departemen_id: 'DP001',
    departemen_nama: 'IT',
    sub_departemen_id: 'DS072',
    sub_departemen_nama: 'Aplikasi & System',
    pos: 'Programmer Officer',
    status: 'Aktif',
  },
  {
    id: 'POS02',
    departemen_id: 'DP001',
    departemen_nama: 'IT',
    sub_departemen_id: 'DS073',
    sub_departemen_nama: 'Infrastructure & Network',
    pos: 'Network Engineer',
    status: 'Aktif',
  },
  {
    id: 'POS03',
    departemen_id: 'DP002',
    departemen_nama: 'HRD',
    sub_departemen_id: 'DS074',
    sub_departemen_nama: 'Recruitment & Talent',
    pos: 'Talent Acquisition Staff',
    status: 'Nonaktif',
  },
];

export const posService = {
  // Mengambil semua data dengan simulasi delay 500ms untuk loading state
  getAll: async (): Promise<Pos[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPosList]);
      }, 500);
    });
  },

  create: async (data: Omit<Pos, 'status'>): Promise<Pos> => {
    const newPos: Pos = {
      ...data,
      status: 'Aktif', // Default ketika tambah baru
    };
    mockPosList.push(newPos);
    return Promise.resolve(newPos);
  },

  update: async (id: string, data: Partial<Pos>): Promise<Pos> => {
    mockPosList = mockPosList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockPosList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    mockPosList = mockPosList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};