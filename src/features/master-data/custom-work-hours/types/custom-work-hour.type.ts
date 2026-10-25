export interface CustomWorkHour {
  id?: number | string;
  name: string;
  clock_in: string;
  clock_out: string;
  tolerance?: string; // 👈 Diubah dari number ke string
  description?: string;
  is_active: boolean;
  [key: string]: any;
}