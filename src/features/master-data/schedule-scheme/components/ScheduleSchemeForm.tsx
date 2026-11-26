import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  scheduleSchemeSchema,
  type ScheduleSchemeFormValues,
} from '../schemas/schedule-scheme.schema';
import type { ScheduleScheme } from '../types/schedule-scheme.type';
import { scheduleSchemeService } from '../services/schedule-scheme.service';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface ScheduleSchemeFormProps {
  initialData?: ScheduleScheme | null;
  existingList?: ScheduleScheme[];
  onSubmit: (data: ScheduleSchemeFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const SK_PATTERN = /^SK\d{3}$/;

const sanitizeSkInput = (rawValue: string): string => {
  const upper = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!upper) return '';

  if (upper.startsWith('SK')) {
    const digits = upper.slice(2).replace(/\D/g, '').slice(0, 3);
    return `SK${digits}`;
  }
  if (upper.startsWith('S')) {
    const digits = upper.slice(1).replace(/\D/g, '').slice(0, 3);
    return digits ? `SK${digits}` : 'SK';
  }

  const digits = upper.replace(/\D/g, '').slice(0, 3);
  return digits ? `SK${digits}` : '';
};

export const ScheduleSchemeForm: React.FC<ScheduleSchemeFormProps> = ({
  initialData,
  existingList = [],
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
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

  const [allSchemes, setAllSchemes] = useState<ScheduleScheme[]>(existingList);

  useEffect(() => {
    setAllSchemes(existingList);
  }, [existingList]);

  useEffect(() => {
    let active = true;
    const loadSchemes = async () => {
      try {
        if (typeof scheduleSchemeService?.getAll === 'function') {
          const res = await scheduleSchemeService.getAll('', '', 1, 500);
          if (active && Array.isArray(res?.data)) {
            setAllSchemes((prev) => {
              const merged = [...prev, ...res.data];
              const seen = new Map<string, ScheduleScheme>();
              merged.forEach((item, idx) => {
                const key = String(item.id ?? item.code ?? idx);
                seen.set(key, item);
              });
              return Array.from(seen.values());
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSchemes();
    return () => {
      active = false;
    };
  }, []);

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

  const isDuplicateCode = (rawCode: string): boolean => {
    if (isEditMode) return false;
    const normalized = rawCode.trim().toLowerCase();
    if (!normalized) return false;

    return allSchemes.some((item) => {
      const itemCode = String(item.code || '').trim().toLowerCase();
      return itemCode !== '' && itemCode === normalized;
    });
  };

  const isDuplicateName = (rawName: string): boolean => {
    const normalized = rawName.trim().toLowerCase();
    if (!normalized) return false;

    const currentId = initialData?.id !== undefined ? String(initialData.id) : null;
    const currentCode = String(initialData?.code || '').trim().toLowerCase();

    return allSchemes.some((item) => {
      const itemId = item.id !== undefined ? String(item.id) : null;
      const itemCode = String(item.code || '').trim().toLowerCase();

      if (isEditMode) {
        if (currentId && itemId === currentId) return false;
        if (!currentId && currentCode && itemCode === currentCode) return false;
      }

      const itemName = String(item.name || (item as any).skema || '').trim().toLowerCase();
      return itemName !== '' && itemName === normalized;
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCode = sanitizeSkInput(e.target.value);
    setValue('code', formattedCode, { shouldValidate: false });
    clearErrors('code');

    if (!isEditMode && formattedCode && !SK_PATTERN.test(formattedCode)) {
      setError('code', {
        type: 'manual',
        message: 'Format ID harus SK diikuti 3 angka (contoh: SK001).',
      });
      return;
    }

    if (!isEditMode && formattedCode && isDuplicateCode(formattedCode)) {
      setError('code', {
        type: 'manual',
        message: 'ID Skema sudah digunakan. Gunakan ID lain yang belum terdaftar.',
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    clearErrors('name');

    if (val.trim() && isDuplicateName(val)) {
      setError('name', {
        type: 'manual',
        message: 'Nama Skema sudah digunakan. Gunakan nama lain yang belum terdaftar.',
      });
    }
  };

  const handleFormSubmit = async (values: ScheduleSchemeFormValues) => {
    clearErrors(['code', 'name']);

    const formattedCode = isEditMode ? values.code.trim().toUpperCase() : sanitizeSkInput(values.code);
    const trimmedName = values.name.trim();
    let hasError = false;

    if (!isEditMode) {
      if (!formattedCode) {
        setError('code', {
          type: 'manual',
          message: 'ID Skema wajib diisi.',
        });
        hasError = true;
      } else if (!SK_PATTERN.test(formattedCode)) {
        setError('code', {
          type: 'manual',
          message: 'Format ID harus SK diikuti 3 angka (contoh: SK001).',
        });
        hasError = true;
      } else if (isDuplicateCode(formattedCode)) {
        setError('code', {
          type: 'manual',
          message: 'ID Skema sudah digunakan. Gunakan ID lain yang belum terdaftar.',
        });
        hasError = true;
      }
    }

    if (!trimmedName) {
      setError('name', {
        type: 'manual',
        message: 'Nama Skema wajib diisi.',
      });
      hasError = true;
    } else if (isDuplicateName(trimmedName)) {
      setError('name', {
        type: 'manual',
        message: 'Nama Skema sudah digunakan. Gunakan nama lain yang belum terdaftar.',
      });
      hasError = true;
    }

    if (hasError) return;

    try {
      await onSubmit({
        ...values,
        code: formattedCode,
        name: trimmedName,
        description: values.description?.trim() || '',
      });
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors?.code?.[0]) {
        setError('code', { type: 'server', message: serverErrors.code[0] });
      }
      if (serverErrors?.name?.[0]) {
        setError('name', { type: 'server', message: serverErrors.name[0] });
      }
    }
  };

  const codeRegistration = register('code');
  const nameRegistration = register('name');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 1. ID Skema */}
      <div>
        <FormInput
          label="ID Skema"
          {...codeRegistration}
          disabled={isEditMode}
          maxLength={5}
          onChange={(e) => {
            codeRegistration.onChange(e);
            handleCodeChange(e);
          }}
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
        {...nameRegistration}
        onChange={(e) => {
          nameRegistration.onChange(e);
          handleNameChange(e);
        }}
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