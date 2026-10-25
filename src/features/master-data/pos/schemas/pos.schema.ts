import { z } from 'zod';

export const posSchema = z.object({
  department_code: z.string().min(1, 'Departemen wajib dipilih'),
  sub_department_code: z.string().min(1, 'Sub Departemen wajib dipilih'),
  code: z.string().min(1, 'ID POS wajib diisi'),
  title: z.string().min(1, 'Nama POS wajib diisi'),
  is_active: z.boolean(),
});

export type PosFormValues = z.infer<typeof posSchema>;