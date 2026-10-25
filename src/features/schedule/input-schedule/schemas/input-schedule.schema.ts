import { z } from 'zod';

export const inputScheduleSchema = z.object({
  periodId: z.string().min(1, 'ID Periode wajib diisi'),
  nip: z.string().min(1, 'NIP wajib diisi'),
  name: z.string().min(1, 'Nama Karyawan wajib diisi'),
  subDept: z.string().min(1, 'Sub Departemen wajib diisi'),
  workScheme: z.string().min(1, 'Skema Kerja wajib diisi'),
  totalDays: z.coerce.number().min(0),
  workDays: z.coerce.number().min(0),
  offDays: z.coerce.number().min(0),
  phDays: z.coerce.number().min(0),
  permitDays: z.coerce.number().min(0),
  alphaDays: z.coerce.number().min(0),
  leaveDays: z.coerce.number().min(0),
  lateDays: z.coerce.number().min(0),
  ref: z.string().optional(),
  status: z.enum(['Aktif', 'Nonaktif']),
});

export type InputScheduleFormValues = z.infer<typeof inputScheduleSchema>;