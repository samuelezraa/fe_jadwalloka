import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { posSchema, type PosFormValues } from '../schemas/pos.schema';
import type { Pos } from '../types/pos.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface PosFormProps {
  initialData?: Pos | null;
  departemenList?: Departemen[];
  subDepartemenList?: SubDepartemen[];
  onSubmit: (data: PosFormValues) => void;
  onCancel: () => void;
}

export const PosForm: React.FC<PosFormProps> = ({
  initialData,
  departemenList = [],
  subDepartemenList = [],
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PosFormValues>({
    resolver: zodResolver(posSchema),
    defaultValues: {
      department_code: '',
      sub_department_code: '',
      code: '',
      title: '',
      is_active: true,
    },
  });

  const selectedDepartmentCode = watch('department_code');

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || rawActive === 1 || rawActive === 'Aktif'
      );

      reset({
        department_code: initialData.department_code || (initialData as any).departemen_id || '',
        sub_department_code: initialData.sub_department_code || (initialData as any).sub_departemen_id || '',
        code: initialData.code || (initialData as any).id || '',
        title: initialData.title || (initialData as any).pos || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        department_code: '',
        sub_department_code: '',
        code: '',
        title: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  // Options Departemen dengan format ID(Departemen) -> DP001(IT)
  const departmentOptions = useMemo(() => {
    if (!Array.isArray(departemenList)) return [];

    return departemenList
      .map((d) => {
        const codeVal = d.code || String(d.id || '');
        const nameVal = d.name || (d as any).departemen || '';
        return {
          id: codeVal,
          label: codeVal && nameVal ? `${codeVal}(${nameVal})` : nameVal || codeVal,
        };
      })
      .filter((opt) => opt.id !== '');
  }, [departemenList]);

  // Filter Sub Departemen Berdasarkan Departemen yang Terpilih
  const filteredSubDepartmentList = useMemo(() => {
    if (!selectedDepartmentCode) return subDepartemenList;
    return subDepartemenList.filter((sub) => {
      const parentCode = sub.department_code || (sub as any).departemen_id;
      return String(parentCode) === String(selectedDepartmentCode);
    });
  }, [subDepartemenList, selectedDepartmentCode]);

  // Options Sub Departemen dengan format ID(Sub Departemen) -> SUB001(Aplikasi & System)
  const subDepartmentOptions = useMemo(() => {
    if (!Array.isArray(filteredSubDepartmentList)) return [];

    return filteredSubDepartmentList
      .map((sub) => {
        const codeVal = sub.code || String(sub.id || '');
        const nameVal = sub.name || (sub as any).sub_departemen || '';
        return {
          id: codeVal,
          label: codeVal && nameVal ? `${codeVal}(${nameVal})` : nameVal || codeVal,
        };
      })
      .filter((opt) => opt.id !== '');
  }, [filteredSubDepartmentList]);

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4">
      {/* 1. Select Departemen */}
      <Controller
        name="department_code"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Departemen"
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              setValue('sub_department_code', '');
            }}
            placeholder="-- Pilih Departemen --"
            options={departmentOptions}
            error={errors.department_code?.message}
          />
        )}
      />

      {/* 2. Select Sub Departemen */}
      <Controller
        name="sub_department_code"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Sub Departemen"
            value={field.value}
            onChange={field.onChange}
            placeholder="-- Pilih Sub Departemen --"
            options={subDepartmentOptions}
            error={errors.sub_department_code?.message}
          />
        )}
      />

      {/* 3. Field ID POS */}
      <div>
        <FormInput
          label="ID POS"
          {...register('code')}
          disabled={isEditMode}
          placeholder="Contoh: POS01"
          error={errors.code?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            ID POS tidak dapat diubah.
          </p>
        )}
      </div>

      {/* 4. Field Pos */}
      <FormInput
        label="Pos"
        {...register('title')}
        placeholder="Contoh: Programmer Officer"
        error={errors.title?.message}
      />

      {/* 5. Status (Hanya Tampil Pada Form Edit Pos) */}
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
                { id: 'false', label: 'Non aktif' },
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