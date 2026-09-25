import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departemenSchema, type DepartemenFormValues } from '../schemas/departemen.schema';
import type { Departemen } from '../types/departemen.type';

// Reusable UI Components
// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface DepartemenFormProps {
  initialData?: Departemen | null;
  onSubmit: (data: DepartemenFormValues) => void;
  onCancel: () => void;
}

export const DepartemenForm: React.FC<DepartemenFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartemenFormValues>({
    resolver: zodResolver(departemenSchema),
    defaultValues: {
      id: '',
      departemen: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        departemen: initialData.departemen,
      });
    } else {
      reset({
        id: '',
        departemen: '',
      });
    }
  }, [initialData, reset]);

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Field ID Departemen */}
      <div>
        <FormInput
          label="ID Departemen"
          {...register('id')}
          disabled={isEditMode}
          placeholder="Contoh: DP001"
          error={errors.id?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            ID departemen tidak dapat diubah.
          </p>
        )}
      </div>

      {/* Field Nama Departemen */}
      <FormInput
        label="Nama Departemen"
        {...register('departemen')}
        placeholder="Contoh: IT, HRD, Operasional"
        error={errors.departemen?.message}
      />

      {/* Aksi Tombol Form */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};