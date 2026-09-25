import { z } from 'zod';

export const skemaHariKerjaSchema = z.object({
  id: z.string().min(1, 'ID Skema wajib diisi'),
  skema: z.string().min(1, 'Nama Skema Hari Kerja wajib diisi'),
  // z.coerce.number() akan otomatis mengubah input string dari form menjadi number
  jumlah_hari_kerja: z.coerce.number().min(0, 'Jumlah hari kerja minimal 0'),
  jumlah_hari_libur: z.coerce.number().min(0, 'Jumlah hari libur minimal 0'),
});

export type SkemaHariKerjaFormValues = z.infer<typeof skemaHariKerjaSchema>;