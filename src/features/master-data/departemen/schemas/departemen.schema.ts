import { z } from 'zod';

export const departemenSchema = z.object({
  id: z.string().min(1, 'ID Departemen wajib diisi'),
  departemen: z.string().min(1, 'Nama Departemen wajib diisi'),
  status: z.enum(['Aktif', 'Non Aktif']),
});

export type DepartemenFormValues = z.infer<typeof departemenSchema>;