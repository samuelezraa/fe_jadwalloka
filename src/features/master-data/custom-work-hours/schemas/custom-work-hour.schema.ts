import { z } from 'zod';

export const customWorkHourSchema = z.object({
  name: z.string().min(1, 'Nama jam kerja wajib diisi'),
  clock_in: z.string().min(1, 'Jam masuk wajib diisi'),
  clock_out: z.string().min(1, 'Jam pulang wajib diisi'),
  tolerance: z.string().min(1, 'Toleransi wajib diisi').default('00:00:00'), // 👈 Menggunakan string format waktu
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CustomWorkHourFormValues = z.infer<typeof customWorkHourSchema>;