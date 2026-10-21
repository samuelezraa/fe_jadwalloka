import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jamKerjaSchema, type JamKerjaFormValues } from '../schemas/jam-kerja.schema';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';

// Reusable UI Components
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { WorkStatusToggleButton } from '../../../../components/ui/WorkStatusToggleButton';

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
    setValue,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
      {/* Container dengan Scroll Vertical & Responsive Layout */}
      <div className="max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 space-y-2.5 sm:space-y-1.5">
        {DAYS.map((day) => {
          const statusValue = watch(`${day.key}.status`);
          const isBerangkat = statusValue === 'Berangkat';

          const toggleStatus = () => {
            const nextStatus = isBerangkat ? 'Libur' : 'Berangkat';
            setValue(`${day.key}.status`, nextStatus, { shouldValidate: true });
            if (nextStatus === 'Libur') {
              setValue(`${day.key}.jam_masuk`, '00:00:00');
              setValue(`${day.key}.jam_pulang`, '00:00:00');
            }
          };

          return (
            <div
              key={day.key}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 p-2 sm:p-1 bg-gray-50/60 sm:bg-transparent dark:bg-gray-800/40 sm:dark:bg-transparent rounded-xl sm:rounded-none border border-gray-100 sm:border-none dark:border-gray-800"
            >
              {/* Baris Atas pada Mobile: Nama Hari & Tombol Status */}
              <div className="flex items-center justify-between gap-2 sm:contents">
                <div className="w-20 shrink-0">
                  <span className="text-xs font-bold sm:font-semibold text-gray-800 dark:text-gray-200">
                    {day.label}
                  </span>
                </div>

                <div className="w-28 sm:w-28 md:w-32 shrink-0 flex justify-end sm:justify-center">
                  <WorkStatusToggleButton
                    status={statusValue as 'Berangkat' | 'Libur'}
                    onToggle={toggleStatus}
                  />
                </div>
              </div>

              {/* Baris Bawah pada Mobile / Kolom Kanan pada Desktop: Input Jam */}
              <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3 items-center">
                <div>
                  <input
                    type="time"
                    step="1"
                    disabled={!isBerangkat}
                    {...register(`${day.key}.jam_masuk`)}
                    className="w-full px-2 sm:px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs bg-white sm:bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-center [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    step="1"
                    disabled={!isBerangkat}
                    {...register(`${day.key}.jam_pulang`)}
                    className="w-full px-2 sm:px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs bg-white sm:bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-center [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Aksi Utama */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};