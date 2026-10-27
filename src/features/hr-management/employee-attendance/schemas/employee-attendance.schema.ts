import { z } from 'zod';

export const employeeAttendanceFilterSchema = z.object({
  period: z.string().optional(),
});

export type EmployeeAttendanceFilterValues = z.infer<typeof employeeAttendanceFilterSchema>;