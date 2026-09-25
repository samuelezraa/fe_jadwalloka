import { z } from 'zod';

export const createEventTahunanSchema = z.object({
  id: z.string().min(1, 'ID Event wajib diisi'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  event: z.string().min(1, 'Nama Event wajib diisi'),
  type: z.string().min(1, 'Type wajib diisi'),
  keterangan: z.string().min(1, 'Keterangan wajib diisi'),
});

export const updateEventTahunanSchema = createEventTahunanSchema.extend({
  status: z.enum(['Aktif', 'Non Aktif'], {
    message: 'Status wajib dipilih',
  }),
});

export type CreateEventTahunanFormValues = z.infer<typeof createEventTahunanSchema>;
export type UpdateEventTahunanFormValues = z.infer<typeof updateEventTahunanSchema>;