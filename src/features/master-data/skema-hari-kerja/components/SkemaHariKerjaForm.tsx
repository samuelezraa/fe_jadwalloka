import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  skemaHariKerjaSchema,
  type SkemaHariKerjaFormValues,
} from '../schemas/skema-hari-kerja.schema';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface SkemaHariKerjaFormProps {
  initialData?: SkemaHariKerja | null;
  onSubmit: (data: SkemaHariKerjaFormValues) => void;
  onCancel: () => void;
}

export const SkemaHariKerjaForm: React.FC<SkemaHariKerjaFormProps> = ({
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
  } = useForm<SkemaHariKerjaFormValues>({
    resolver: zodResolver(skemaHariKerjaSchema),
    defaultValues: {
      id: '',
      skema: '',
      jumlah_hari_kerja: 0,
      jumlah_hari_libur: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        skema: initialData.skema,
        jumlah_hari_kerja: initialData.jumlah_hari_kerja,
        jumlah_hari_libur: initialData.jumlah_hari_libur,
      });
    } else {
      reset({
        id: '',
        skema: '',
        jumlah_hari_kerja: 0,
        jumlah_hari_libur: 0,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. ID Skema */}
      <div>
        <FormInput
          label="ID Skema"
          {...register('id')}
          disabled={isEditMode}
          placeholder="Contoh: SK001"
          error={errors.id?.message}
        />
      </div>

      {/* 2. Nama Skema Hari Kerja */}
      <FormInput
        label="Nama Skema Hari Kerja"
        {...register('skema')}
        placeholder="Contoh: 5-2"
        error={errors.skema?.message}
      />

      {/* 3. Jumlah Hari Kerja */}
      <FormInput
        label="Jumlah Hari Kerja"
        type="number"
        {...register('jumlah_hari_kerja', { valueAsNumber: true })}
        placeholder="Contoh: 21"
        error={errors.jumlah_hari_kerja?.message}
      />

      {/* 4. Jumlah Hari Libur */}
      <FormInput
        label="Jumlah Hari Libur"
        type="number"
        {...register('jumlah_hari_libur', { valueAsNumber: true })}
        placeholder="Contoh: 8"
        error={errors.jumlah_hari_libur?.message}
      />

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};