import type { EventTahunan } from '../types/event-tahunan.type';

let mockEventList: EventTahunan[] = [
  {
    id: '220001',
    tanggal: '2022-10-08',
    event: 'Maulid Nabi Muhammad SAW',
    type: 'NATIONAL/COMPANY',
    keterangan: 'Hari Mualid Nabi',
    status: 'Aktif',
  },
  {
    id: '220002',
    tanggal: '2022-12-25',
    event: 'Hari Raya Natal',
    type: 'NATIONAL/COMPANY',
    keterangan: 'Hari Natal',
    status: 'Non Aktif',
  },
];

export const eventTahunanService = {
  getAll: async (): Promise<EventTahunan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockEventList]);
      }, 500);
    });
  },

  create: async (data: Omit<EventTahunan, 'status'>): Promise<EventTahunan> => {
    const newItem: EventTahunan = {
      ...data,
      status: 'Aktif', // Default aktif saat tambah data[cite: 17]
    };
    mockEventList.push(newItem);
    return Promise.resolve(newItem);
  },

  update: async (id: string, data: Partial<EventTahunan>): Promise<EventTahunan> => {
    mockEventList = mockEventList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockEventList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    mockEventList = mockEventList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};