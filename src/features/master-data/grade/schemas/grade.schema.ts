import { z } from 'zod';

export const gradeSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, 'ID Grade wajib diisi')
        .regex(
          /^GR\d{1,4}$/,
          'Format ID Grade harus GR diikuti 1 sampai 4 digit angka (contoh: GR01 atau GR8888)'
        )
    ),
  name: z.string().trim().min(1, 'Nama Grade wajib diisi'),
  level: z.coerce.number().int().min(1, 'Level minimal 1'),
  is_active: z.boolean(),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;