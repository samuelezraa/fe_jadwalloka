import React, { useEffect, useState, useMemo } from 'react'; // 🟢 Tambahkan useMemo di sini
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subDepartemenSchema, type SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import { departemenService } from '../../departemen/services/departemen.service';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface SubDepartemenFormProps {
  initialData?: SubDepartemen | null;
  departemenList?: Departemen[];
  onSubmit: (data: SubDepartemenFormValues & { department_name?: string; departemen_nama?: string }) => void;
  onCancel: () => void;
}

export const SubDepartemenForm: React.FC<SubDepartemenFormProps> = ({
  initialData,
  departemenList = [],
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
  } = useForm<SubDepartemenFormValues>({
    resolver: zodResolver(subDepartemenSchema),
    defaultValues: {
      department_code: '',
      code: '',
      name: '',
      is_active: true,
    },
  });

  const [formDeptSearchQuery, setFormDeptSearchQuery] = useState('');
  const [formDeptOptions, setFormDeptOptions] = useState<Departemen[]>(departemenList);

  useEffect(() => {
    const fetchFormDeptSearch = async () => {
      try {
        const res = await departemenService.getAll(formDeptSearchQuery, '', 1, 50);
        setFormDeptOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFormDeptSearch();
  }, [formDeptSearchQuery]);

  useEffect(() => {
    setFormDeptOptions(departemenList);
  }, [departemenList]);

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');

      reset({
        department_code: initialData.department_code || (initialData as any).departemen_id || '',
        code: initialData.code || (initialData as any).id || '',
        name: initialData.name || (initialData as any).sub_departemen || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        department_code: '',
        code: '',
        name: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  const departemenSelectOptions = useMemo(() => {
    if (!Array.isArray(formDeptOptions)) return [];

    return formDeptOptions
      .filter((d) => Boolean(d.is_active))
      .map((d) => {
        const codeVal = d.code || (d as any).id || '';
        const nameVal = d.name || (d as any).departemen || '';
        return {
          id: codeVal,
          label: codeVal && nameVal ? `${codeVal}(${nameVal})` : nameVal || codeVal,
        };
      })
      .filter((opt) => opt.id !== '');
  }, [formDeptOptions]);

  const handleFormSubmit = (values: SubDepartemenFormValues) => {
    const selectedDept = (formDeptOptions || []).find(
      (d) => (d.code || String(d.id)) === values.department_code
    );
    
    const deptName = selectedDept ? (selectedDept.name || (selectedDept as any).departemen) : '';
    const deptCode = selectedDept ? (selectedDept.code || values.department_code) : values.department_code;

    onSubmit({
      ...values,
      department_code: deptCode,
      department_name: deptName,
      departemen_nama: deptName,
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Controller
        name="department_code"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Departemen Induk"
            options={departemenSelectOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="-- Pilih Departemen --"
            onSearchChange={(query) => setFormDeptSearchQuery(query)}
            error={errors.department_code?.message}
          />
        )}
      />

      <div>
        <FormInput
          label="ID Sub Departemen"
          {...register('code')}
          disabled={isEditMode}
          placeholder="Contoh: DS072"
          error={errors.code?.message}
        />
        {isEditMode && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            ID Sub Departemen tidak dapat diubah.
          </p>
        )}
      </div>

      <FormInput
        label="Sub Departemen"
        {...register('name')}
        placeholder="Contoh: Aplikasi & System"
        error={errors.name?.message}
      />

      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status Sub Departemen"
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

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};