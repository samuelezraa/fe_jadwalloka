import type { Departemen } from '../types/departemen.type';

// ... sisa kode di bawahnya tetap sama

// Mock initial data sesuai spesifikasi gambar
let mockDepartemenList: Departemen[] = [
  { id: 'DP001', departemen: 'IT' },
  { id: 'DP002', departemen: 'HRD' },
  { id: 'DP003', departemen: 'Operasional' },
];

export const departemenService = {
  getAll: async (): Promise<Departemen[]> => {
    return Promise.resolve(mockDepartemenList);
  },

  create: async (data: Departemen): Promise<Departemen> => {
    mockDepartemenList.push(data);
    return Promise.resolve(data);
  },

  update: async (id: string, data: Partial<Departemen>): Promise<Departemen> => {
    mockDepartemenList = mockDepartemenList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockDepartemenList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    mockDepartemenList = mockDepartemenList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};