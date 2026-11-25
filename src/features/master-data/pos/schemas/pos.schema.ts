import { z } from 'zod';

export const posSchema = z.object({
  department_code: z.string().min(1, 'Departemen wajib dipilih'),
  sub_department_code: z.string().min(1, 'Sub Departemen wajib dipilih'),
  code: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, 'ID POS wajib diisi')
        .regex(
          /^POS\d{1,4}$/,
          'Format ID POS harus POS diikuti 1 sampai 4 digit angka (contoh: POS01 atau POS8888)'
        )
    ),
  title: z.string().trim().min(1, 'Nama POS wajib diisi'),
  is_active: z.boolean(),
});

export type PosFormValues = z.infer<typeof posSchema>;