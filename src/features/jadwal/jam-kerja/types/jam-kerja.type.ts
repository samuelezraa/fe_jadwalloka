export interface DetailHariKerja {
  status: 'Berangkat' | 'Libur';
  jam_masuk: string;  // Contoh: '09:05:00'
  jam_pulang: string; // Contoh: '18:05:00'
}

export interface JamKerjaKaryawan {
  id_karyawan: string;      // Contoh: '9999'[cite: 15]
  nama: string;             // Contoh: 'Antika Lorien'[cite: 15]
  departemen: string;       // Contoh: 'IT'[cite: 15]
  sub_departemen: string;   // Contoh: 'Aplikasi & System'[cite: 15]
  tipe_jam_kerja: string;   // Contoh: 'Flextime'[cite: 15]
  jadwal_mingguan: {
    senin: DetailHariKerja;
    selasa: DetailHariKerja;
    rabu: DetailHariKerja;
    kamis: DetailHariKerja;
    jumat: DetailHariKerja;
    sabtu: DetailHariKerja;
    minggu: DetailHariKerja;
  };
}