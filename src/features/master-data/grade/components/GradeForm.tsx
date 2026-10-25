import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gradeSchema, type GradeFormValues } from '../schemas/grade.schema';
import type { Grade } from '../types/grade.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface GradeFormProps {
  initialData?: Grade | null;
  onSubmit: (data: GradeFormValues) => void;
  onCancel: () => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({
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
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      code: '',
      name: '',
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
        code: initialData.code || (initialData as any).id || (initialData as any).kode_grade || '',
        name: initialData.name || (initialData as any).grade || (initialData as any).nama_grade || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        code: '',
        name: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. ID Grade */}
      <div>
        <FormInput
          label="ID Grade"
          {...register('code')}
          disabled={isEditMode}
          placeholder="Contoh: GR001"
          error={errors.code?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            ID Grade tidak dapat diubah.
          </p>
        )}
      </div>

      {/* 2. Nama Grade */}
      <FormInput
        label="Nama Grade"
        {...register('name')}
        placeholder="Contoh: Staff / Junior"
        error={errors.name?.message}
      />

      {/* 3. Status (Hanya Tampil Saat Edit Mode) */}
      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status Grade"
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