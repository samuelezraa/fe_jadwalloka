import { z } from 'zod';

export const customJamKerjaSchema = z.object({
  periodeStart: z.string().min(1, 'Periode mulai wajib diisi'),
  periodeEnd: z.string().min(1, 'Periode selesai wajib diisi'),
  skemaHariKerja: z.string().min(1, 'Skema hari kerja wajib diisi'),
  jamMasuk: z.string().min(1, 'Jam masuk wajib diisi'),
  toleransiKeterlambatan: z.string().min(1, 'Toleransi keterlambatan wajib diisi'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
  status: z.enum(['Aktif', 'Nonaktif']).default('Aktif'),
});

export type CustomJamKerjaFormValues = z.infer<typeof customJamKerjaSchema>;