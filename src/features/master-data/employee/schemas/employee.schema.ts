import { z } from 'zod';

const PHONE_PREFIX_REGEX = /^(08|8|62)\d*$/;

export const employeesSchema = z.object({
  employee_id: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'ID Karyawan wajib diisi tepat 4 digit angka (contoh: 1001)'),
  nip: z
    .string()
    .trim()
    .regex(/^\d{9}$/, 'NIP wajib diisi tepat 9 digit angka (contoh: 000001001)'),
  name: z.string().trim().min(1, 'Nama Karyawan wajib diisi'),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^\d+$/, 'Nomor telepon hanya boleh berisi angka')
    .max(14, 'Nomor telepon maksimal 14 digit')
    .refine(
      (val) => PHONE_PREFIX_REGEX.test(val),
      'Nomor telepon harus diawali dengan 08, 8, atau 62'
    ),
  department_id: z.string().min(1, 'Departemen wajib dipilih'),
  sub_department_id: z.string().min(1, 'Sub Departemen wajib dipilih'),
  position_id: z.string().min(1, 'POS wajib dipilih'),
  grade_id: z.string().min(1, 'Grade wajib dipilih'),
  work_schedule_scheme_id: z.string().min(1, 'Skema Hari Kerja wajib dipilih'),
  join_date: z.string().min(1, 'Tanggal Bergabung wajib diisi'),
  birth_date: z.string().min(1, 'Tanggal Lahir wajib diisi'),
  is_active: z.boolean().default(true),
});

export type EmployeeFormValues = z.infer<typeof employeesSchema>;