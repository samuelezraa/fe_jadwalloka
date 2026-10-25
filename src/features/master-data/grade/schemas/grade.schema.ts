import { z } from 'zod';

export const gradeSchema = z.object({
  code: z.string().min(1, 'ID Grade wajib diisi'),
  name: z.string().min(1, 'Nama Grade wajib diisi'),
  is_active: z.boolean(),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;