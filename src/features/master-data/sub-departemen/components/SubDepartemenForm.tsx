import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subDepartemenSchema, type SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { Departemen } from '../../departemen/types/departemen.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface SubDepartemenFormProps {
  initialData?: SubDepartemen | null;
  departemenList: Departemen[];
  onSubmit: (data: SubDepartemenFormValues & { departemen_nama: string }) => void;
  onCancel: () => void;
}

export const SubDepartemenForm: React.FC<SubDepartemenFormProps> = ({
  initialData,
  departemenList,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubDepartemenFormValues>({
    resolver: zodResolver(subDepartemenSchema),
    defaultValues: {
      departemen_id: '',
      id: '',
      sub_departemen: '',
    },
  });

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        departemen_id: initialData.departemen_id,
        id: initialData.id,
        sub_departemen: initialData.sub_departemen,
      });
    } else {
      reset({
        departemen_id: '',
        id: '',
        sub_departemen: '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (values: SubDepartemenFormValues) => {
    const selectedDept = departemenList.find((d) => d.id === values.departemen_id);
    onSubmit({
      ...values,
      departemen_nama: selectedDept ? selectedDept.departemen : '',
    });
  };

  // Format data untuk FormSelectSearch
  const departemenOptions = departemenList.map((d) => ({
    id: d.id,
    label: `${d.departemen} (${d.id})`,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Pilih Departemen menggunakan Search Dropdowns Reusable */}
      <Controller
        name="departemen_id"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Departemen"
            options={departemenOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="-- Pilih Departemen --"
            error={errors.departemen_id?.message}
          />
        )}
      />

      {/* ID Sub Departemen */}
      <div>
        <FormInput
          label="ID Sub Departemen"
          {...register('id')}
          disabled={isEditMode}
          placeholder="Contoh: DS072"
          error={errors.id?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">ID Sub Departemen tidak dapat diubah.</p>
        )}
      </div>

      {/* Nama Sub Departemen */}
      <FormInput
        label="Sub Departemen"
        {...register('sub_departemen')}
        placeholder="Contoh: Aplikasi & System"
        error={errors.sub_departemen?.message}
      />

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};