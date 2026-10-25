import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departemenSchema, type DepartemenFormValues } from '../schemas/departemen.schema';
import type { Departemen } from '../types/departemen.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
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
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartemenFormValues>({
    resolver: zodResolver(departemenSchema),
    defaultValues: {
      code: '',
      name: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      // Konversi nilai number (1 / 0) atau string/boolean dari API menjadi boolean murni
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');

      reset({
        code: initialData.code || (initialData as any).id || '',
        name: initialData.name || (initialData as any).departemen || '',
        is_active: isActiveBoolean, // 👈 Nilai dijamin boolean murni (true/false)
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
      {/* Field Kode / ID Departemen */}
      <div>
        <FormInput
          label="ID Departemen"
          {...register('code')}
          disabled={isEditMode}
          placeholder="Contoh: DP001"
          error={errors.code?.message}
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
        {...register('name')}
        placeholder="Contoh: IT, HRD, Operasional"
        error={errors.name?.message}
      />

      {/* Field Status Departemen dalam Mode Edit */}
      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status Departemen"
              value={field.value ? 'true' : 'false'}
              onChange={(val) => field.onChange(val === 'true')}
              placeholder="Pilih Status"
              showSearch={false} // Sembunyikan input pencarian khusus untuk pilihan status
              options={[
                { id: 'true', label: 'Aktif' },
                { id: 'false', label: 'Non Aktif' },
              ]}
              error={errors.is_active?.message}
            />
          )}
        />
      )}

      {/* Aksi Tombol Form */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};