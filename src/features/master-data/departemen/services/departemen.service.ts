import type { Departemen } from '../types/departemen.type';

// Mock initial data dengan field status
let mockDepartemenList: Departemen[] = [
  { id: 'DP001', departemen: 'IT', status: 'Aktif' },
  { id: 'DP002', departemen: 'HRD', status: 'Aktif' },
  { id: 'DP003', departemen: 'Operasional', status: 'Aktif' },
];

export const departemenService = {
  getAll: async (): Promise<Departemen[]> => {
    return Promise.resolve(mockDepartemenList);
  },

  create: async (data: Departemen): Promise<Departemen> => {
    const newItem = {
      ...data,
      status: data.status || 'Aktif',
    };
    mockDepartemenList.push(newItem);
    return Promise.resolve(newItem);
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