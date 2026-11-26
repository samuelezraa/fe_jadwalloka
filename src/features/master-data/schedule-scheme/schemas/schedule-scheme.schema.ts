import { z } from 'zod';

export const scheduleSchemeSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, 'ID Skema wajib diisi')
        .regex(/^SK\d{3}$/, 'Format ID harus SK diikuti 3 angka (contoh: SK001)')
    ),
  name: z.string().trim().min(1, 'Nama Skema wajib diisi'),
  description: z.string().trim().optional(),
  is_active: z.boolean(),
});

export type ScheduleSchemeFormValues = z.infer<typeof scheduleSchemeSchema>;