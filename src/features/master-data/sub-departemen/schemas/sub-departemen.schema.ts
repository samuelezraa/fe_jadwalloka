import { z } from 'zod';

export const subDepartemenSchema = z.object({
  departemen_id: z.string().min(1, 'Departemen wajib dipilih'),
  id: z.string().min(1, 'ID Sub Departemen wajib diisi'),
  sub_departemen: z.string().min(1, 'Nama Sub Departemen wajib diisi'),
});

export type SubDepartemenFormValues = z.infer<typeof subDepartemenSchema>;