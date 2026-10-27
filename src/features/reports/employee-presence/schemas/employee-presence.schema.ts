import { z } from 'zod';

export const employeePresenceFilterSchema = z.object({
  selectedPeriode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type EmployeePresenceFilterValues = z.infer<typeof employeePresenceFilterSchema>;