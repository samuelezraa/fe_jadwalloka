import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { DateRangePicker } from '../../../../components/ui/DateRangePicker'; // 🌟 Date Range Picker Reusable
import { customJamKerjaSchema, type CustomJamKerjaFormValues } from '../schemas/custom-jam-kerja.schema';
import type { CustomJamKerja } from '../types/custom-jam-kerja.type';
import { Input } from '../../../../components/ui/input'; // 🌟 Komponen Input Reusable
import { FormTimeInput } from '../../../../components/ui/FormTimeInput'; // 🌟 Komponen FormTimeInput Reusable

interface CustomJamKerjaFormProps {
  initialData?: CustomJamKerja | null;
  onSubmit: (data: CustomJamKerjaFormValues) => void;
  onCancel: () => void;
}

export const CustomJamKerjaForm: React.FC<CustomJamKerjaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomJamKerjaFormValues>({
    resolver: zodResolver(customJamKerjaSchema),
    defaultValues: {
      periodeStart: '',
      periodeEnd: '',
      skemaHariKerja: '5-2',
      jamMasuk: '08:00:00',
      toleransiKeterlambatan: '5 Menit',
      keterangan: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        periodeStart: initialData.periodeStart,
        periodeEnd: initialData.periodeEnd,
        skemaHariKerja: initialData.skemaHariKerja,
        jamMasuk: initialData.jamMasuk,
        toleransiKeterlambatan: initialData.toleransiKeterlambatan,
        keterangan: initialData.keterangan,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. PERIODE (DATE RANGE PICKER DISATUKAN) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Periode
        </label>
        <Controller
          name="periodeStart"
          control={control}
          render={({ field: startField }) => (
            <Controller
              name="periodeEnd"
              control={control}
              render={({ field: endField }) => (
                <DateRangePicker
                  startDate={startField.value}
                  endDate={endField.value}
                  onChange={(start, end) => {
                    setValue('periodeStart', start, { shouldValidate: true });
                    setValue('periodeEnd', end, { shouldValidate: true });
                  }}
                  placeholder="Pilih rentang periode..."
                />
              )}
            />
          )}
        />
        {(errors.periodeStart || errors.periodeEnd) && (
          <p className="text-[10px] text-red-500 mt-1">
            {errors.periodeStart?.message || errors.periodeEnd?.message}
          </p>
        )}
      </div>

      {/* 2. SKEMA HARI KERJA & JAM MASUK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Skema Hari Kerja
          </label>
          <Input
            type="text"
            placeholder="Contoh: 5-2"
            {...register('skemaHariKerja')}
            className="w-full text-xs px-3 py-2 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {errors.skemaHariKerja && (
            <p className="text-[10px] text-red-500 mt-1">{errors.skemaHariKerja.message}</p>
          )}
        </div>

        {/* FIELD JAM MASUK (MENGGUNAKAN FORMTIMEINPUT REUSABLE) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Jam Masuk
          </label>
          <Controller
            name="jamMasuk"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:bg-gray-100 dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
          {errors.jamMasuk && (
            <p className="text-[10px] text-red-500 mt-1">{errors.jamMasuk.message}</p>
          )}
        </div>
      </div>

      {/* 3. TOLERANSI KETERLAMBATAN & STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Toleransi Keterlambatan
          </label>
          <Input
            type="text"
            placeholder="Contoh: 5 Menit"
            {...register('toleransiKeterlambatan')}
            className="w-full text-xs px-3 py-2 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          />
          {errors.toleransiKeterlambatan && (
            <p className="text-[10px] text-red-500 mt-1">{errors.toleransiKeterlambatan.message}</p>
          )}
        </div>

        {isEdit && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelectSearch
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih Status"
                  options={[
                    { id: 'Aktif', label: 'Aktif' },
                    { id: 'Non Aktif', label: 'Non Aktif' },
                  ]}
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* 4. KETERANGAN */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Keterangan
        </label>
        <Input
          type="text"
          placeholder="Contoh: Peak Season"
          {...register('keterangan')}
          className="w-full text-xs px-3 py-2 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        />
        {errors.keterangan && (
          <p className="text-[10px] text-red-500 mt-1">{errors.keterangan.message}</p>
        )}
      </div>

      {/* AKSI TOMBOL FORM */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};