import { z } from 'zod';

export const skemaHariKerjaSchema = z.object({
  id: z.string().min(1, 'ID Skema wajib diisi'),
  skema: z.string().min(1, 'Nama Skema Hari Kerja wajib diisi'),
  jumlah_hari_kerja: z.number().min(0, 'Jumlah hari kerja minimal 0'),
  jam_kerja_per_hari: z.number().min(0, 'Jam kerja per hari minimal 0'),
  total_jam_per_minggu: z.number().min(0, 'Total jam per minggu minimal 0'),
  total_jam_per_bulan: z.number().min(0, 'Total jam per bulan minimal 0'),
  status: z.enum(['Aktif', 'Non Aktif']),
});

export type SkemaHariKerjaFormValues = z.infer<typeof skemaHariKerjaSchema>;