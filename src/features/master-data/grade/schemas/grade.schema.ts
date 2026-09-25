import { z } from 'zod';

// Validasi Form Tambah (Tanpa input Status, karena default aktif)
export const createGradeSchema = z.object({
  id: z.string().min(1, 'ID Grade wajib diisi'),
  grade: z.string().min(1, 'Nama Grade wajib diisi'),
});

// Validasi Form Edit (Ditambah input Status)
export const updateGradeSchema = createGradeSchema.extend({
  status: z.enum(['Aktif', 'Nonaktif'], {
    message: 'Status wajib dipilih',
  }),
});

// Export tipe data hasil inferensi Zod untuk digunakan di React Hook Form
export type CreateGradeFormValues = z.infer<typeof createGradeSchema>;
export type UpdateGradeFormValues = z.infer<typeof updateGradeSchema>;