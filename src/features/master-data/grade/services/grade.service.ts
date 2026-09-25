import type { Grade } from '../types/grade.type';

// Mock data awal sesuai referensi spesifikasi
let mockGradeList: Grade[] = [
  {
    id: 'LV-001',
    grade: 'General Manager',
    status: 'Aktif',
  },
  {
    id: 'LV-002',
    grade: 'Manager',
    status: 'Aktif',
  },
  {
    id: 'LV-003',
    grade: 'Supervisor',
    status: 'Nonaktif',
  },
];

export const gradeService = {
  // Mengambil semua data
  getAll: async (): Promise<Grade[]> => {
    // Simulasi delay jaringan (opsional, agar loading state terlihat)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockGradeList]);
      }, 500);
    });
  },

  // Menambah data baru (status default "Aktif" sesuai spesifikasi)
  create: async (data: Omit<Grade, 'status'>): Promise<Grade> => {
    const newGrade: Grade = {
      ...data,
      status: 'Aktif', 
    };
    mockGradeList.push(newGrade);
    return Promise.resolve(newGrade);
  },

  // Mengubah data (edit)
  update: async (id: string, data: Partial<Grade>): Promise<Grade> => {
    mockGradeList = mockGradeList.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    const updated = mockGradeList.find((item) => item.id === id)!;
    return Promise.resolve(updated);
  },

  // Menghapus data
  delete: async (id: string): Promise<boolean> => {
    mockGradeList = mockGradeList.filter((item) => item.id !== id);
    return Promise.resolve(true);
  },
};