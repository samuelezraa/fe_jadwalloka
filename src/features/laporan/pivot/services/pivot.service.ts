import type { PivotData } from '../types/pivot.type';

// Contoh service untuk mengambil data pivot dari backend/API
export const pivotService = {
  getPivotData: async (): Promise<PivotData[]> => {
    // Di sini Anda bisa menggantinya dengan pemanggilan axios atau fetch ke endpoint API backend Anda
    // Contoh: const response = await axios.get('/api/laporan/pivot'); return response.data;
    
    return [
      {
        id: '1',
        nip: '9999',
        nama: 'User Trial IT',
        departemen: 'IT',
        sub_departemen: 'Aplikasi & System',
        pos: '-',
        grade: '-',
        skema: '5-2',
        masuk: 23,
        libur: 0,
        ph: 0,
        izin: 0,
        alfa: 0,
        sakit: 0,
        cuti: 0,
        terlambat: 0,
      },
    ];
  },
};