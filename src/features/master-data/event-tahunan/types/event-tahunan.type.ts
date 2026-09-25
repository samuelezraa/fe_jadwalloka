export interface EventTahunan {
  id: string;          // ID Event, contoh: 220001
  tanggal: string;     // Format: YYYY-MM-DD
  event: string;       // Nama Event
  type: string;        // Contoh: NATIONAL/COMPANY
  keterangan: string;  // Keterangan event[cite: 17]
  status: 'Aktif' | 'Non Aktif';
  created_at?: string;
  updated_at?: string;
}