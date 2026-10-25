import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customWorkHourSchema, type CustomWorkHourFormValues } from '../schemas/custom-work-hour.schema';
import type { CustomWorkHour } from '../types/custom-work-hour.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { FormTimeInput } from '../../../../components/ui/FormTimeInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface CustomWorkHourFormProps {
  initialData?: CustomWorkHour | null;
  onSubmit: (data: CustomWorkHourFormValues) => void | Promise<any>;
  onCancel: () => void;
}

export const CustomWorkHourForm: React.FC<CustomWorkHourFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomWorkHourFormValues>({
    resolver: zodResolver(customWorkHourSchema) as any,
    defaultValues: {
      name: '',
      clock_in: '08:00:00',
      clock_out: '17:00:00',
      tolerance: '00:00:00',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || 
        (rawActive as unknown as number) === 1 || 
        rawActive === 'Aktif' || 
        rawActive === 'true'
      );

      reset({
        name: initialData.name || '',
        clock_in: initialData.clock_in || '08:00:00',
        clock_out: initialData.clock_out || '17:00:00',
        tolerance: initialData.tolerance || '00:00:00',
        description: initialData.description || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        name: '',
        clock_in: '08:00:00',
        clock_out: '17:00:00',
        tolerance: '00:00:00',
        description: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      {/* 1. Nama / Skema Jam Kerja */}
      <FormInput
        label="Nama Jam Kerja"
        {...register('name')}
        placeholder="Contoh: Jam Kerja Shift Pagi"
        error={errors.name?.message}
      />

      {/* 2. Jam Masuk, Toleransi, & Jam Pulang (3 Kolom dengan Flex Col untuk Kesejajaran Input) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col justify-between">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Jam Masuk
          </label>
          <Controller
            name="clock_in"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.clock_in && (
            <p className="text-[10px] text-red-500 mt-1">{errors.clock_in.message}</p>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Toleransi Keterlambatan
          </label>
          <Controller
            name="tolerance"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.tolerance && (
            <p className="text-[10px] text-red-500 mt-1">{errors.tolerance.message}</p>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Jam Pulang
          </label>
          <Controller
            name="clock_out"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.clock_out && (
            <p className="text-[10px] text-red-500 mt-1">{errors.clock_out.message}</p>
          )}
        </div>
      </div>

      {/* 3. Status (Hanya Tampil Saat Edit Mode) */}
      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status"
              value={field.value ? 'true' : 'false'}
              onChange={(val) => field.onChange(val === 'true')}
              placeholder="Pilih Status"
              showSearch={false}
              options={[
                { id: 'true', label: 'Aktif' },
                { id: 'false', label: 'Non Aktif' },
              ]}
              error={errors.is_active?.message}
            />
          )}
        />
      )}

      {/* 4. Keterangan */}
      <FormInput
        label="Keterangan"
        {...register('description')}
        placeholder="Contoh: Berlaku untuk divisi operasional"
        error={errors.description?.message}
      />

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};

export default CustomWorkHourForm;