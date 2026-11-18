import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { posSchema, type PosFormValues } from '../schemas/pos.schema';
import type { Pos } from '../types/pos.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';
import { departemenService } from '../../departemen/services/departemen.service';
import { subDepartemenService } from '../../sub-departemen/services/sub-departemen.service';

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

  // 🟢 State untuk Backend Search Debounce pada Form
  const [formDeptSearchQuery, setFormDeptSearchQuery] = useState('');
  const [formDeptOptions, setFormDeptOptions] = useState<Departemen[]>(departemenList);

  const [formSubDeptSearchQuery, setFormSubDeptSearchQuery] = useState('');
  const [formSubDeptOptions, setFormSubDeptOptions] = useState<SubDepartemen[]>(subDepartemenList);

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await departemenService.getAll(formDeptSearchQuery, '', 1, 50);
        setFormDeptOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDept();
  }, [formDeptSearchQuery]);

  useEffect(() => {
    setFormDeptOptions(departemenList);
  }, [departemenList]);

  useEffect(() => {
    const fetchSubDept = async () => {
      if (!selectedDepartmentCode) {
        setFormSubDeptOptions([]);
        return;
      }
      try {
        const res = await subDepartemenService.getAll(formSubDeptSearchQuery, selectedDepartmentCode, '', 1, 50);
        setFormSubDeptOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubDept();
  }, [formSubDeptSearchQuery, selectedDepartmentCode]);

  useEffect(() => {
    if (!selectedDepartmentCode) {
      setFormSubDeptOptions([]);
    } else {
      setFormSubDeptOptions(subDepartemenList);
    }
  }, [subDepartemenList, selectedDepartmentCode]);

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
    if (!Array.isArray(formDeptOptions)) return [];

    return formDeptOptions
      .map((d) => {
        const codeVal = d.code || String(d.id || '');
        const nameVal = d.name || (d as any).departemen || '';
        return {
          id: codeVal,
          label: codeVal && nameVal ? `${codeVal}(${nameVal})` : nameVal || codeVal,
        };
      })
      .filter((opt) => opt.id !== '');
  }, [formDeptOptions]);

  // Filter Sub Departemen Berdasarkan Departemen yang Terpilih & Backend Search
  const filteredSubDepartmentList = useMemo(() => {
    if (!selectedDepartmentCode || !Array.isArray(formSubDeptOptions)) return [];
    return formSubDeptOptions.filter((sub) => {
      if (!Boolean(sub.is_active)) return false;
      const parentCode = sub.department_code || (sub as any).departemen_id;
      return String(parentCode) === String(selectedDepartmentCode);
    });
  }, [formSubDeptOptions, selectedDepartmentCode]);

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
              setValue('sub_department_code', ''); // Reset sub departemen saat departemen diubah
            }}
            placeholder="-- Pilih Departemen --"
            onSearchChange={(query) => setFormDeptSearchQuery(query)}
            options={departmentOptions}
            error={errors.department_code?.message}
          />
        )}
      />

      {/* 2. Select Sub Departemen (Disabled jika departemen belum dipilih) */}
      <Controller
        name="sub_department_code"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Sub Departemen"
            value={field.value}
            onChange={field.onChange}
            placeholder={selectedDepartmentCode ? '-- Pilih Sub Departemen --' : '-- Pilih Departemen Terlebih Dahulu --'}
            disabled={!selectedDepartmentCode} // 👈 Dinonaktifkan jika departemen kosong
            onSearchChange={(query) => setFormSubDeptSearchQuery(query)}
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