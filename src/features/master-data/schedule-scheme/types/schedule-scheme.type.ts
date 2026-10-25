export interface ScheduleScheme {
  id?: string | number;
  code: string;               // Contoh: SK001
  name: string;               // Contoh: Skema 5-2
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;

  // Fallback kompatibilitas nama lama jika dibutuhkan
  skema?: string;
  status?: string;
}