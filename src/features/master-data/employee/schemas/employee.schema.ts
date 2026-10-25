import { z } from 'zod';

export const employeeSchema = z.object({
  nip: z.string().min(1, 'NIP / ID Karyawan wajib diisi'),
  name: z.string().min(1, 'Nama Karyawan wajib diisi'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  department_id: z.string().min(1, 'Departemen wajib dipilih'),
  sub_department_id: z.string().optional(),
  position_id: z.string().optional(),
  grade_id: z.string().optional(),
  work_schedule_scheme_id: z.string().optional(),
  join_date: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;