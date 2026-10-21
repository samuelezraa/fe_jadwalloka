import type { SubDepartemen } from '../types/sub-departemen.type';

let mockSubDepartemenList: SubDepartemen[] = [
  {
    id: 'DS072',
    departemen_id: 'DP001',
    departemen_nama: 'IT',
    sub_departemen: 'Aplikasi & System',
    status: 'Aktif',
  },
  {
    id: 'DS0739',
    departemen_id: 'DP001',
    departemen_nama: 'IT',
    sub_departemen: 'Infrastructure & Network',
    status: 'Aktif',
  },
  {
    id: 'DS074',
    departemen_id: 'DP002',
    departemen_nama: 'HRD',
    sub_departemen: 'Recruitment & Talent',
    status: 'Aktif',
  },
];

export const subDepartemenService = {
  getAll: async (): Promise<SubDepartemen[]> => {
    return Promise.resolve(mockSubDepartemenList);
  },

  create: async (data: SubDepartemen): Promise<SubDepartemen> => {
    const newItem = {
      ...data,
      status: data.status || 'Aktif',
    };
    mockSubDepartemenList.push(newItem);
    return Promise.resolve(newItem);
  },

  update: async (id: string, data: Partial<SubDepartemen>): Promise<SubDepartemen> => {
    mockSubDepartemenList = mockSubDepartemenList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockSubDepartemenList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    mockSubDepartemenList = mockSubDepartemenList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};