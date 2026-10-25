import { z } from 'zod';

export const annualEventSchema = z.object({
  title: z.string().min(1, 'Judul / Nama Event wajib diisi'),
  event_date: z.string().min(1, 'Rentang Tanggal Event wajib diisi'),
  is_national_holiday: z.boolean(),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type AnnualEventFormValues = z.infer<typeof annualEventSchema>;