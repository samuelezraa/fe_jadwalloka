import { z } from 'zod';

export const departemenSchema = z.object({
  code: z.string().min(1, 'ID Departemen wajib diisi'),
  name: z.string().min(1, 'Nama Departemen wajib diisi'),
  is_active: z.boolean(),
});

export type DepartemenFormValues = z.infer<typeof departemenSchema>;