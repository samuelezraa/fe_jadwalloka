import { z } from 'zod';

export const inputJadwalSchema = z.object({
  id_periode: z.string().min(1, 'ID Periode wajib diisi'),
  nip: z.string().min(1, 'NIP wajib diisi'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  sub_dept: z.string().min(1, 'Sub Departemen wajib diisi'),
  skema_kerja: z.string().min(1, 'Skema Kerja wajib diisi'),
  total_hari: z.number().min(0),
  masuk: z.number().min(0),
  total_libur: z.number().min(0),
  ph: z.number().min(0),
  cuti: z.number().min(0),
  ref: z.string().optional(),
  status: z.enum(['Aktif', 'Non Aktif']),
});

export type InputJadwalFormValues = z.infer<typeof inputJadwalSchema>;