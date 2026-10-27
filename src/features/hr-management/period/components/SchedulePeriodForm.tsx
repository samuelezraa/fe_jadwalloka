import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/ui/FormInput';
import { FormTimeInput } from '@/components/ui/FormTimeInput';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';
import { schedulePeriodSchema, type SchedulePeriodFormValues } from '../schemas/schedule-period.schema';

interface SchedulePeriodFormProps {
  onSubmit: (data: SchedulePeriodFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SchedulePeriodForm: React.FC<SchedulePeriodFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchedulePeriodFormValues>({
    resolver: zodResolver(schedulePeriodSchema),
    defaultValues: {
      periodeJadwal: '',
      tanggalAwal: '',
      tanggalAkhir: '',
      toleransiKeterlambatan: '00:15:00',
    },
  });

  const startDate = watch('tanggalAwal');
  const endDate = watch('tanggalAkhir');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <FormInput
          label="Periode Jadwal"
          type="text"
          placeholder="Contoh: November - Desember 2026"
          {...register('periodeJadwal')}
          required
        />
        {errors.periodeJadwal && (
          <p className="text-red-500 text-xs mt-1">{errors.periodeJadwal.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          Rentang Tanggal Absensi <span className="text-red-500">*</span>
        </label>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setValue('tanggalAwal', start);
            setValue('tanggalAkhir', end);
          }}
          placeholder="Pilih Tanggal Awal ~ Tanggal Akhir"
        />
        {(errors.tanggalAwal || errors.tanggalAkhir) && (
          <p className="text-red-500 text-xs mt-1">Rentang tanggal absensi wajib dipilih</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          Toleransi Keterlambatan (Jam:Menit:Detik) <span className="text-red-500">*</span>
        </label>
        {/* 🌟 Tambahkan wrapper border di sini */}
        <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <Controller
            name="toleransiKeterlambatan"
            control={control}
            render={({ field }) => (
              <FormTimeInput
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.toleransiKeterlambatan && (
          <p className="text-red-500 text-xs mt-1">{errors.toleransiKeterlambatan.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <CancelButton onClick={onCancel} disabled={isLoading} />
        <SaveButton type="submit" isLoading={isLoading} />
      </div>
    </form>
  );
};