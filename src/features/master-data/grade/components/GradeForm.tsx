import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gradeSchema, type GradeFormValues } from '../schemas/grade.schema';
import type { Grade } from '../types/grade.type';

// Reusable UI Components
import { FormInput } from '@/components/ui/FormInput';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';

interface GradeFormProps {
  initialData?: Grade | null;
  existingGrades?: Grade[];
  serverCodeError?: string | null;
  onSubmit: (data: GradeFormValues) => void;
  onCancel: () => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({
  initialData,
  existingGrades = [],
  serverCodeError,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      level: 1,
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
        level: initialData.level ?? 1,
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        code: '',
        name: '',
        level: 1,
        is_active: true,
      });
    }
  }, [initialData, reset]);

  // Tampilkan error dari backend (422) jika ID Grade bentrok di halaman paginasi lain
  useEffect(() => {
    if (serverCodeError) {
      setError('code', {
        type: 'server',
        message: serverCodeError,
      });
    }
  }, [serverCodeError, setError]);

  const handleFormSubmit = (data: GradeFormValues) => {
    const normalizedCode = data.code.trim().toUpperCase();

    if (!isEditMode) {
      const isDuplicate = existingGrades.some(
        (item) =>
          String(item.code || (item as any).kode_grade || '')
            .trim()
            .toUpperCase() === normalizedCode
      );

      if (isDuplicate) {
        setError('code', {
          type: 'manual',
          message: `ID Grade "${normalizedCode}" sudah digunakan, silakan gunakan ID lain.`,
        });
        return;
      }
    }

    onSubmit({
      ...data,
      code: normalizedCode,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 1. ID Grade */}
      <div>
        <FormInput
          label="ID Grade"
          {...register('code')}
          disabled={isEditMode}
          maxLength={6}
          placeholder="Contoh: GR001"
          error={errors.code?.message}
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          {isEditMode
            ? 'ID Grade tidak dapat diubah.'
            : 'Format: GR diikuti 1 sampai 4 digit angka (contoh: GR1, GR01, GR8888).'}
        </p>
      </div>

      {/* 2. Nama Grade */}
      <FormInput
        label="Nama Grade"
        {...register('name')}
        placeholder="Contoh: Manager "
        error={errors.name?.message}
      />

      {/* 3. Level Grade (Menggunakan FormSelectSearch tanpa fitur search) */}
      <Controller
        name="level"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Level Urutan (1 = Terendah)"
            value={field.value ? String(field.value) : '1'}
            onChange={(val) => field.onChange(Number(val))}
            placeholder="Pilih Level"
            showSearch={false}
            options={[
              { id: '1', label: 'Level 1' },
              { id: '2', label: 'Level 2' },
              { id: '3', label: 'Level 3' },
              { id: '4', label: 'Level 4' },
              { id: '5', label: 'Level 5' },
            ]}
            error={errors.level?.message}
          />
        )}
      />

      {/* 4. Status (Hanya Tampil Saat Edit Mode) */}
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