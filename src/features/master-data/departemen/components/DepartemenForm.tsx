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
  draftValues?: DepartemenFormValues | null;
  existingDepartemens?: Departemen[];
  serverErrors?: Record<string, string[]> | null;
  onSubmit: (data: DepartemenFormValues) => void;
  onCancel: () => void;
}

export const DepartemenForm: React.FC<DepartemenFormProps> = ({
  initialData,
  draftValues,
  existingDepartemens = [],
  serverErrors,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
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
    if (draftValues) {
      reset({
        code: draftValues.code || '',
        name: draftValues.name || '',
        is_active: Boolean(draftValues.is_active ?? true),
      });
      return;
    }

    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');

      reset({
        code: initialData.code || String((initialData as any).id || ''),
        name: initialData.name || (initialData as any).departemen || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        code: '',
        name: '',
        is_active: true,
      });
    }
  }, [initialData, draftValues, reset]);

  useEffect(() => {
    if (!serverErrors) return;

    Object.entries(serverErrors).forEach(([field, messages]) => {
      if (
        (field === 'code' || field === 'name' || field === 'is_active') &&
        Array.isArray(messages) &&
        messages[0]
      ) {
        setError(field, {
          type: 'server',
          message: messages[0],
        });
      }
    });
  }, [serverErrors, setError]);

  const handleFormSubmit = (values: DepartemenFormValues) => {
    const normalizedCode = values.code.trim().toUpperCase();
    const normalizedName = values.name.replace(/\s+/g, ' ').trim();

    if (!isEditMode) {
      const isCodeDuplicate = existingDepartemens.some(
        (item) => String(item.code || '').trim().toUpperCase() === normalizedCode
      );
      if (isCodeDuplicate) {
        setError('code', {
          type: 'manual',
          message: `ID Departemen "${normalizedCode}" sudah digunakan, silakan gunakan ID lain.`,
        });
        return;
      }
    }

    const isNameDuplicate = existingDepartemens.some(
      (item) =>
        item.id !== initialData?.id &&
        String(item.name || '').replace(/\s+/g, ' ').trim().toLowerCase() ===
          normalizedName.toLowerCase()
    );

    if (isNameDuplicate) {
      setError('name', {
        type: 'manual',
        message: `Nama Departemen "${normalizedName}" sudah terdaftar, tidak boleh sama.`,
      });
      return;
    }

    onSubmit({
      ...values,
      code: normalizedCode,
      name: normalizedName,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Field Kode / ID Departemen */}
      <div>
        <FormInput
          label="ID Departemen"
          {...register('code')}
          disabled={isEditMode}
          maxLength={5}
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

      {/* Aksi Tombol Form */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};