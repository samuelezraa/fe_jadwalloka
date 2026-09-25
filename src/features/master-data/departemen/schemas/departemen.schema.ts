import { z } from 'zod';

export const departemenSchema = z.object({
  id: z.string().min(1, 'ID Departemen wajib diisi'),
  departemen: z.string().min(1, 'Nama Departemen wajib diisi'),
});

export type DepartemenFormValues = z.infer<typeof departemenSchema>;