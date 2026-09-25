import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateGradeSchema,
  type UpdateGradeFormValues,
} from '../schemas/grade.schema';
import type { Grade } from '../types/grade.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface GradeFormProps {
  initialData?: Grade | null;
  onSubmit: (data: any) => void;
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
    formState: { errors, isSubmitting },
  } = useForm<UpdateGradeFormValues>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: {
      id: '',
      grade: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        grade: initialData.grade,
        status: initialData.status,
      });
    } else {
      reset({
        id: '',
        grade: '',
        status: 'Aktif',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. ID Grade */}
      <div>
        <FormInput
          label="ID Grade"
          {...register('id')}
          disabled={isEditMode}
          placeholder="Contoh: LV-001"
          error={errors.id?.message}
        />
      </div>

      {/* 2. Nama Grade */}
      <FormInput
        label="Nama Grade"
        {...register('grade')}
        placeholder="Contoh: General Manager"
        error={errors.grade?.message}
      />

      {/* 3. Status (Hanya Tampil Saat Edit Mode) */}
      {isEditMode && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-gray-400 focus:bg-gray-50 dark:focus:bg-gray-800/80 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
          >
            <option value="Aktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              Aktif
            </option>
            <option value="Nonaktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              Non Aktif
            </option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.status.message}</p>
          )}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};