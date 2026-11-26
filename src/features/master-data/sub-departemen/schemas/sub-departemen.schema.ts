import { z } from 'zod';

export const subDepartemenSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'ID Sub Departemen wajib diisi')
    .regex(/^DS\d{3}$/, 'Format ID harus DS diikuti 3 angka (contoh: DS072)'),
  name: z
    .string()
    .trim()
    .min(1, 'Nama Sub Departemen wajib diisi'),
  department_code: z
    .string()
    .min(1, 'Pilih Departemen induk'),
  is_active: z.boolean(),
});

export type SubDepartemenFormValues = z.infer<typeof subDepartemenSchema>;