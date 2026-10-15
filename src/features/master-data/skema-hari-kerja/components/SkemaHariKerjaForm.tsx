import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  skemaHariKerjaSchema,
  type SkemaHariKerjaFormValues,
} from '../schemas/skema-hari-kerja.schema';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelect } from '../../../../components/ui/FormSelect';
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<SkemaHariKerjaFormValues>({
    resolver: zodResolver(skemaHariKerjaSchema),
    defaultValues: {
      id: '',
      skema: '',
      jumlah_hari_kerja: 0,
      jam_kerja_per_hari: 0,
      total_jam_per_minggu: 0,
      total_jam_per_bulan: 0,
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        skema: initialData.skema,
        jumlah_hari_kerja: initialData.jumlah_hari_kerja,
        jam_kerja_per_hari: initialData.jam_kerja_per_hari,
        total_jam_per_minggu: initialData.total_jam_per_minggu,
        total_jam_per_bulan: initialData.total_jam_per_bulan,
        status: initialData.status || 'Aktif',
      });
    } else {
      reset({
        id: '',
        skema: '',
        jumlah_hari_kerja: 0,
        jam_kerja_per_hari: 0,
        total_jam_per_minggu: 0,
        total_jam_per_bulan: 0,
        status: 'Aktif',
      });
    }
  }, [initialData, reset]);

  // Handler untuk memblokir pengetikan selain angka 0-9
  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

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
        onKeyDown={handleNumberKeyDown}
        placeholder="Contoh: 5"
        error={errors.jumlah_hari_kerja?.message}
      />

      {/* 4. Jam Kerja (/Hari) */}
      <FormInput
        label="Jam Kerja (/Hari)"
        type="number"
        {...register('jam_kerja_per_hari', { valueAsNumber: true })}
        onKeyDown={handleNumberKeyDown}
        placeholder="Contoh: 8"
        error={errors.jam_kerja_per_hari?.message}
      />

      {/* 5. Total Jam (/Minggu) */}
      <FormInput
        label="Total Jam (/Minggu)"
        type="number"
        {...register('total_jam_per_minggu', { valueAsNumber: true })}
        onKeyDown={handleNumberKeyDown}
        placeholder="Contoh: 40"
        error={errors.total_jam_per_minggu?.message}
      />

      {/* 6. Total Jam (/Bulan) */}
      <FormInput
        label="Total Jam (/Bulan)"
        type="number"
        {...register('total_jam_per_bulan', { valueAsNumber: true })}
        onKeyDown={handleNumberKeyDown}
        placeholder="Contoh: 160"
        error={errors.total_jam_per_bulan?.message}
      />

     {/* 7. Status */}
      {/* 7. Status */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormSelect
            label="Status"
            value={field.value}
            onValueChange={(val) => field.onChange(val)}
            error={errors.status?.message}
            placeholder="Pilih Status"
            options={[
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Non Aktif', label: 'Non Aktif' },
            ]}
          />
        )}
      />

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};