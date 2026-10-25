import { z } from 'zod';

const dayScheduleSchema = z.object({
  status: z.enum(['Berangkat', 'Libur']),
  check_in_time: z.string().min(1, 'Jam masuk wajib diisi'),
  check_out_time: z.string().min(1, 'Jam pulang wajib diisi'),
});

export const fiveTwoWorkHourSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

export type FiveTwoWorkHourFormValues = z.infer<typeof fiveTwoWorkHourSchema>;