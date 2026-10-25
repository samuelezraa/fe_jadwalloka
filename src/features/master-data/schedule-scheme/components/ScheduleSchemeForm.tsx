import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  scheduleSchemeSchema,
  type ScheduleSchemeFormValues,
} from '../schemas/schedule-scheme.schema';
import type { ScheduleScheme } from '../types/schedule-scheme.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface ScheduleSchemeFormProps {
  initialData?: ScheduleScheme | null;
  onSubmit: (data: ScheduleSchemeFormValues) => void;
  onCancel: () => void;
}

export const ScheduleSchemeForm: React.FC<ScheduleSchemeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleSchemeFormValues>({
    resolver: zodResolver(scheduleSchemeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || rawActive === 1 || rawActive === 'Aktif'
      );

      reset({
        code: initialData.code || (initialData as any).id || '',
        name: initialData.name || (initialData as any).skema || '',
        description: initialData.description || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. ID Skema */}
      <div>
        <FormInput
          label="ID Skema"
          {...register('code')}
          disabled={isEditMode}
          placeholder="Contoh: SK001"
          error={errors.code?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            ID Skema tidak dapat diubah.
          </p>
        )}
      </div>

      {/* 2. Nama Skema Hari Kerja */}
      <FormInput
        label="Nama Skema Hari Kerja"
        {...register('name')}
        placeholder="Contoh: Skema 5-2"
        error={errors.name?.message}
      />

      {/* 3. Deskripsi */}
      <FormInput
        label="Deskripsi (Opsional)"
        {...register('description')}
        placeholder="Contoh: 5 hari kerja, 2 hari libur"
        error={errors.description?.message}
      />

      {/* 4. Status (Hanya tampil saat Edit) */}
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

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};