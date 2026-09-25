import { z } from 'zod';

export const detailHariSchema = z.object({
  status: z.enum(['Berangkat', 'Libur']),
  jam_masuk: z.string(),
  jam_pulang: z.string(),
});

export const jamKerjaSchema = z.object({
  senin: detailHariSchema,
  selasa: detailHariSchema,
  rabu: detailHariSchema,
  kamis: detailHariSchema,
  jumat: detailHariSchema,
  sabtu: detailHariSchema,
  minggu: detailHariSchema,
});

export type JamKerjaFormValues = z.infer<typeof jamKerjaSchema>;