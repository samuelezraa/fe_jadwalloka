import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock } from 'lucide-react';
import { fiveTwoWorkHourSchema, type FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';

// Reusable UI Components
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { WorkStatusToggleButton } from '../../../../components/ui/WorkStatusToggleButton';
import { FormTimeInput } from '../../../../components/ui/FormTimeInput';

interface FiveTwoWorkHourFormProps {
  initialData?: FiveTwoWorkHourEmployee | null;
  onSubmit: (data: FiveTwoWorkHourFormValues) => void;
  onCancel: () => void;
}

const DAYS = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
] as const;

export const FiveTwoWorkHourForm: React.FC<FiveTwoWorkHourFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FiveTwoWorkHourFormValues>({
    resolver: zodResolver(fiveTwoWorkHourSchema) as any,
    defaultValues: {
      monday: { status: 'Libur', check_in_time: '00:00:00', check_out_time: '00:00:00' },
      tuesday: { status: 'Berangkat', check_in_time: '09:00:00', check_out_time: '18:00:00' },
      wednesday: { status: 'Berangkat', check_in_time: '09:00:00', check_out_time: '18:00:00' },
      thursday: { status: 'Berangkat', check_in_time: '09:00:00', check_out_time: '18:00:00' },
      friday: { status: 'Berangkat', check_in_time: '09:00:00', check_out_time: '17:00:00' },
      saturday: { status: 'Libur', check_in_time: '00:00:00', check_out_time: '00:00:00' },
      sunday: { status: 'Libur', check_in_time: '00:00:00', check_out_time: '00:00:00' },
    },
  });

  useEffect(() => {
    if (initialData?.weekly_schedule) {
      reset(initialData.weekly_schedule as any);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4 w-full">
      {/* Header Kolom (Desktop) */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100/70 dark:bg-gray-800/60 rounded-xl text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
        <div className="col-span-2">Hari</div>
        <div className="col-span-4 text-center">Status Kehadiran</div>
        <div className="col-span-3 text-center">Jam Masuk</div>
        <div className="col-span-3 text-center">Jam Keluar</div>
      </div>

      {/* Daftar Pengaturan Hari */}
      <div className="space-y-2 pr-1">
        {DAYS.map((day) => {
          const statusValue = watch(`${day.key}.status`);
          const isBerangkat = statusValue === 'Berangkat';

          const toggleStatus = () => {
            const nextStatus = isBerangkat ? 'Libur' : 'Berangkat';
            setValue(`${day.key}.status`, nextStatus, { shouldValidate: true });
            if (nextStatus === 'Libur') {
              setValue(`${day.key}.check_in_time`, '00:00:00');
              setValue(`${day.key}.check_out_time`, '00:00:00');
            }
          };

          return (
            <div
              key={day.key}
              className={`flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-center p-2.5 sm:p-2 rounded-2xl border transition-all duration-200 ${
                isBerangkat
                  ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xs hover:border-emerald-200 dark:hover:border-emerald-900/50'
                  : 'bg-gray-50/70 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800/60 opacity-80'
              }`}
            >
              {/* Nama Hari */}
              <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-start px-2">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {day.label}
                </span>
                <div className="sm:hidden">
                  <WorkStatusToggleButton
                    status={statusValue as 'Berangkat' | 'Libur'}
                    onToggle={toggleStatus}
                  />
                </div>
              </div>

              {/* Status Toggle Button (Desktop) */}
              <div className="hidden sm:flex sm:col-span-4 justify-center">
                <WorkStatusToggleButton
                  status={statusValue as 'Berangkat' | 'Libur'}
                  onToggle={toggleStatus}
                />
              </div>

              {/* Input Jam Masuk & Jam Keluar */}
              <div className="w-full sm:col-span-6 grid grid-cols-2 gap-3">
                {/* Jam Masuk */}
                <div className="relative flex items-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all [&_input::-webkit-calendar-picker-indicator]:hidden">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mr-1.5 pointer-events-none" />
                  <Controller
                    name={`${day.key}.check_in_time`}
                    control={control}
                    render={({ field }) => (
                      <FormTimeInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isBerangkat}
                        className="text-center font-mono font-medium tracking-wide w-full"
                      />
                    )}
                  />
                </div>

                {/* Jam Keluar */}
                <div className="relative flex items-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all [&_input::-webkit-calendar-picker-indicator]:hidden">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mr-1.5 pointer-events-none" />
                  <Controller
                    name={`${day.key}.check_out_time`}
                    control={control}
                    render={({ field }) => (
                      <FormTimeInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isBerangkat}
                        className="text-center font-mono font-medium tracking-wide w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};