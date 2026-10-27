import { z } from 'zod';

export const schedulePeriodSchema = z.object({
  periodeJadwal: z.string().min(1, 'Nama periode jadwal wajib diisi'),
  tanggalAwal: z.string().min(1, 'Tanggal awal wajib dipilih'),
  tanggalAkhir: z.string().min(1, 'Tanggal akhir wajib dipilih'),
  toleransiKeterlambatan: z.string().min(1, 'Toleransi keterlambatan wajib diisi'),
});

export type SchedulePeriodFormValues = z.infer<typeof schedulePeriodSchema>;