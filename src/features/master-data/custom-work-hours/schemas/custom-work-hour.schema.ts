import { z } from 'zod';

export const customWorkHourSchema = z.object({
  start_date: z.string().min(1, 'Tanggal mulai periode wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai periode wajib diisi'),
  work_scheme: z.string().min(1, 'Skema hari kerja wajib diisi'),
  clock_in: z.string().min(1, 'Jam masuk wajib diisi'),
  tolerance: z.string().min(1, 'Toleransi keterlambatan wajib diisi').default('00:05:00'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CustomWorkHourFormValues = z.infer<typeof customWorkHourSchema>;