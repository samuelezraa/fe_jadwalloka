import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jamKerjaSchema, type JamKerjaFormValues } from '../schemas/jam-kerja.schema';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';
import { CalendarCheck } from 'lucide-react';

// Reusable UI Components
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface JamKerjaFormProps {
  initialData?: JamKerjaKaryawan | null;
  onSubmit: (data: JamKerjaFormValues) => void;
  onCancel: () => void;
}

const DAYS = [
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
  { key: 'sabtu', label: 'Sabtu' },
  { key: 'minggu', label: 'Minggu' },
] as const;

export const JamKerjaForm: React.FC<JamKerjaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<JamKerjaFormValues>({
    resolver: zodResolver(jamKerjaSchema),
    defaultValues: {
      senin: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
      selasa: { status: 'Berangkat', jam_masuk: '09:05:00', jam_pulang: '18:05:00' },
      rabu: { status: 'Berangkat', jam_masuk: '09:04:00', jam_pulang: '18:04:00' },
      kamis: { status: 'Berangkat', jam_masuk: '09:00:00', jam_pulang: '18:00:00' },
      jumat: { status: 'Berangkat', jam_masuk: '09:00:00', jam_pulang: '17:00:00' },
      sabtu: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
      minggu: { status: 'Libur', jam_masuk: '00:00:00', jam_pulang: '00:00:00' },
    },
  });

  useEffect(() => {
    if (initialData?.jadwal_mingguan) {
      reset(initialData.jadwal_mingguan);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Mengatur jam masuk dan jam pulang karyawan berdasarkan hari kerja (Status Berangkat / Libur).</span>
      </div>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const statusValue = watch(`${day.key}.status`);
          const isLibur = statusValue === 'Libur';

          return (
            <div key={day.key} className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">{day.label}</span>
                <select
                  {...register(`${day.key}.status`)}
                  className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Berangkat">Berangkat</option>
                  <option value="Libur">Libur</option>
                </select>
              </div>

              {!isLibur && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Jam Masuk</label>
                    <input
                      type="time"
                      step="1"
                      {...register(`${day.key}.jam_masuk`)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Jam Pulang</label>
                    <input
                      type="time"
                      step="1"
                      {...register(`${day.key}.jam_pulang`)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reusable Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};