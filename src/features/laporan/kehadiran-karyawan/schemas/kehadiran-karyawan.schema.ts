import { z } from 'zod';

export const kehadiranKaryawanFilterSchema = z.object({
  selectedPeriode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type KehadiranKaryawanFilterValues = z.infer<typeof kehadiranKaryawanFilterSchema>;