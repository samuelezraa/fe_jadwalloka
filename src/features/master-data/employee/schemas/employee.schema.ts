import { z } from 'zod';

export const employeeSchema = z.object({
  employee_id: z.string().optional(),
  nip: z.string().min(1, 'NIP wajib diisi'),
  name: z.string().min(1, 'Nama Karyawan wajib diisi'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().max(14, 'Nomor telepon maksimal 14 karakter').optional().or(z.literal('')),
  department_id: z.string().min(1, 'Departemen wajib dipilih'),
  sub_department_id: z.string().optional(),
  position_id: z.string().optional(),
  grade_id: z.string().optional(),
  work_schedule_scheme_id: z.string().optional(),
  join_date: z.string().optional(),
  birth_date: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;