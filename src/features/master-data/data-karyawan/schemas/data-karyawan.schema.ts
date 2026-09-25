import { z } from 'zod';

export const dataKaryawanSchema = z.object({
  departemen_id: z.string().min(1, 'Departemen wajib dipilih'),
  sub_departemen_id: z.string().min(1, 'Sub Departemen wajib dipilih'),
  pos_id: z.string().min(1, 'POS wajib dipilih'),
  grade_id: z.string().min(1, 'Grade wajib dipilih'),
  nik: z.string().min(1, 'NIK wajib diisi'),
  id_absen: z.string().regex(/^\d+$/, 'ID Absen hanya dapat berisi angka'),
  nama: z.string().min(1, 'Nama lengkap wajib diisi'),
  nomor_telephone: z
    .string()
    .regex(/^\d+$/, 'Nomor telephone hanya dapat berisi angka')
    .max(13, 'Nomor telephone maksimal 13 digit'),
  email: z.string().email('Format email tidak valid'),
  skema_hari_kerja: z.string().min(1, 'Skema hari kerja wajib dipilih'),
  tanggal_bergabung: z.string().min(1, 'Tanggal bergabung wajib diisi'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  status: z.enum(['Aktif', 'Non Aktif']).optional(),
});

export type DataKaryawanFormValues = z.infer<typeof dataKaryawanSchema>;