import { z } from 'zod';

export const scheduleSchemeSchema = z.object({
  code: z.string().min(1, 'ID Skema wajib diisi'),
  name: z.string().min(1, 'Nama Skema Hari Kerja wajib diisi'),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type ScheduleSchemeFormValues = z.infer<typeof scheduleSchemeSchema>;