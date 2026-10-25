export interface AnnualEvent {
  id?: string | number;
  
  // Properti Standar Backend Baru
  title: string;              
  start_date: string;         
  end_date?: string;          
  is_national_holiday: boolean;
  description?: string;
  is_active: boolean;
  
  created_at?: string;
  updated_at?: string;

  // Fallback Properti Lama (Agar halaman/komponen lain tidak error)
  event?: string;
  tanggal?: string;
  type?: string;
  keterangan?: string;
  status?: string | boolean;
}