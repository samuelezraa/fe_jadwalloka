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
  {
    id: '2',
    nik: '123457',
    id_absen: '1001',
    nama: 'Budi Santoso',
    departemen_id: 'DP001',
    departemen: 'IT',
    sub_departemen_id: 'SD002',
    sub_departemen: 'Infrastructure & Network',
    pos_id: 'POS002',
    pos: 'Network Engineer',
    grade_id: 'GR001',
    grade: 'Officer',
    skema_hari_kerja: '5-2',
    tanggal_bergabung: '2026-02-15',
    tanggal_lahir: '1997-05-12',
    nomor_telephone: '081298765432',
    email: 'budi.santoso@lokahr.com',
    status: 'Aktif',
  },
  {
    id: '3',
    nik: '123458',
    id_absen: '1002',
    nama: 'Citra Dewi',
    departemen_id: 'DP002',
    departemen: 'Human Resources',
    sub_departemen_id: 'SD003',
    sub_departemen: 'Talent Acquisition',
    pos_id: 'POS003',
    pos: 'HR Recruiter Specialist',
    grade_id: 'GR002',
    grade: 'Senior Officer',
    skema_hari_kerja: '5-2',
    tanggal_bergabung: '2025-08-10',
    tanggal_lahir: '1998-11-23',
    nomor_telephone: '081377889900',
    email: 'citra.dewi@lokahr.com',
    status: 'Aktif',
  },
  {
    id: '4',
    nik: '123459',
    id_absen: '1003',
    nama: 'Dian Prasetyo',
    departemen_id: 'DP003',
    departemen: 'Finance & Accounting',
    sub_departemen_id: 'SD004',
    sub_departemen: 'Payroll & Tax',
    pos_id: 'POS004',
    pos: 'Payroll Supervisor',
    grade_id: 'GR003',
    grade: 'Supervisor',
    skema_hari_kerja: '5-2',
    tanggal_bergabung: '2024-03-01',
    tanggal_lahir: '1995-07-04',
    nomor_telephone: '085612344321',
    email: 'dian.prasetyo@lokahr.com',
    status: 'Aktif',
  },
  {
    id: '5',
    nik: '123460',
    id_absen: '1004',
    nama: 'Eka Rahmawati',
    departemen_id: 'DP004',
    departemen: 'Marketing',
    sub_departemen_id: 'SD005',
    sub_departemen: 'Digital Marketing',
    pos_id: 'POS005',
    pos: 'Content Specialist',
    grade_id: 'GR001',
    grade: 'Officer',
    skema_hari_kerja: '6-1',
    tanggal_bergabung: '2026-05-20',
    tanggal_lahir: '2000-02-18',
    nomor_telephone: '087855667788',
    email: 'eka.rahmawati@lokahr.com',
    status: 'Aktif',
  },
  {
    id: '6',
    nik: '123461',
    id_absen: '1005',
    nama: 'Fajar Nugraha',
    departemen_id: 'DP005',
    departemen: 'Operations',
    sub_departemen_id: 'SD006',
    sub_departemen: 'General Support',
    pos_id: 'POS006',
    pos: 'Operational Staff',
    grade_id: 'GR001',
    grade: 'Officer',
    skema_hari_kerja: '6-1',
    tanggal_bergabung: '2025-11-01',
    tanggal_lahir: '1996-09-30',
    nomor_telephone: '089611223344',
    email: 'fajar.nugraha@lokahr.com',
    status: 'Non Aktif',
  },
];



export const dataKaryawanService = {
  getAll: async (): Promise<DataKaryawan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockKaryawanList]);
      }, 200);
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