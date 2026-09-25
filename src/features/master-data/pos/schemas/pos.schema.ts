import { z } from 'zod';

// Validasi Tambah POS (Tanpa Status, default Aktif)
export const createPosSchema = z.object({
  departemen_id: z.string().min(1, 'Departemen wajib dipilih'),
  sub_departemen_id: z.string().min(1, 'Sub Departemen wajib dipilih'),
  id: z.string().min(1, 'ID POS wajib diisi'),
  pos: z.string().min(1, 'Nama POS wajib diisi'),
});

// Validasi Edit POS (Memiliki Status)
export const updatePosSchema = createPosSchema.extend({
  status: z.enum(['Aktif', 'Nonaktif'], {
    message: 'Status wajib dipilih', // Perbaikan pada sintaks pesan error Zod
  }),
});

export type CreatePosFormValues = z.infer<typeof createPosSchema>;
export type UpdatePosFormValues = z.infer<typeof updatePosSchema>;