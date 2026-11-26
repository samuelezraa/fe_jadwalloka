import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subDepartemenSchema, type SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import type { SubDepartemen } from '../types/sub-departemen.type';
import { subDepartemenService } from '../services/sub-departemen.service';
import type { Departemen } from '../../departemen/types/departemen.type';
import { departemenService } from '../../departemen/services/departemen.service';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface SubDepartemenFormProps {
  initialData?: SubDepartemen | null;
  departemenList?: Departemen[];
  existingList?: SubDepartemen[];
  onSubmit: (data: SubDepartemenFormValues & { department_name?: string; departemen_nama?: string }) => Promise<void> | void;
  onCancel: () => void;
}

const DS_PATTERN = /^DS\d{3}$/;

// Format input agar selalu diawali "DS" dan diikuti maksimal 3 angka (0-9)
const sanitizeDsInput = (rawValue: string): string => {
  const upper = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!upper) return '';

  // Ambil digit setelah "DS" jika diawali DS, atau ambil digit saja lalu awali DS
  let digits = '';
  if (upper.startsWith('DS')) {
    digits = upper.slice(2).replace(/\D/g, '').slice(0, 3);
    return `DS${digits}`;
  }

  if (upper.startsWith('D')) {
    digits = upper.slice(1).replace(/\D/g, '').slice(0, 3);
    return digits ? `DS${digits}` : 'DS';
  }

  digits = upper.replace(/\D/g, '').slice(0, 3);
  return digits ? `DS${digits}` : '';
};

export const SubDepartemenForm: React.FC<SubDepartemenFormProps> = ({
  initialData,
  departemenList = [],
  existingList = [],
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
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
  const [allSubDepartemen, setAllSubDepartemen] = useState<SubDepartemen[]>(existingList);

  // Sinkronkan data existingList dari props dan ambil daftar lengkap dari service untuk cek duplikat
  useEffect(() => {
    setAllSubDepartemen(existingList);
  }, [existingList]);

  useEffect(() => {
    let active = true;
    const loadSubDepartemen = async () => {
      try {
        if (typeof subDepartemenService?.getAll === 'function') {
         const res = await subDepartemenService.getAll('', '', '', 1, 500);
          if (active && Array.isArray(res?.data)) {
            setAllSubDepartemen((prev) => {
              const merged = [...prev, ...res.data];
              const seen = new Map<string, SubDepartemen>();
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
    loadSubDepartemen();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const fetchFormDeptSearch = async () => {
      try {
        const res = await departemenService.getAll(formDeptSearchQuery, '', 1, 25);
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

  const checkDuplicateCode = (rawCode: string): boolean => {
    const normalizedCode = rawCode.trim().toLowerCase();
    if (!normalizedCode) return false;

    const currentId = initialData?.id ? String(initialData.id) : null;
    const currentCode = String(initialData?.code || (initialData as any)?.id || '')
      .trim()
      .toLowerCase();

    return allSubDepartemen.some((item) => {
      const itemId = item.id ? String(item.id) : null;
      const itemCode = String(item.code || (item as any).id || '')
        .trim()
        .toLowerCase();

      if (currentId && itemId === currentId) return false;
      if (!currentId && currentCode && itemCode === currentCode) return false;

      return itemCode !== '' && itemCode === normalizedCode;
    });
  };

  const checkDuplicateName = (rawName: string): boolean => {
    const normalizedName = rawName.trim().toLowerCase();
    if (!normalizedName) return false;

    const currentId = initialData?.id ? String(initialData.id) : null;

    return allSubDepartemen.some((item) => {
      const itemId = item.id ? String(item.id) : null;
      if (currentId && itemId === currentId) return false;

      const itemName = String(item.name || (item as any).sub_departemen || '')
        .trim()
        .toLowerCase();
      return itemName !== '' && itemName === normalizedName;
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = sanitizeDsInput(e.target.value);
    setValue('code', formatted, { shouldValidate: false });
    clearErrors('code');

    if (!formatted) {
      setError('code', {
        type: 'manual',
        message: 'ID Sub Departemen wajib diisi (format DSXXX).',
      });
      return;
    }

    if (!DS_PATTERN.test(formatted)) {
      setError('code', {
        type: 'manual',
        message: 'Format ID harus DS diikuti 3 angka (contoh: DS072).',
      });
      return;
    }

    if (checkDuplicateCode(formatted)) {
      setError('code', {
        type: 'manual',
        message: 'ID Sub Departemen sudah digunakan.',
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    clearErrors('name');

    if (!val.trim()) {
      setError('name', {
        type: 'manual',
        message: 'Nama Sub Departemen wajib diisi.',
      });
      return;
    }

    if (checkDuplicateName(val)) {
      setError('name', {
        type: 'manual',
        message: 'Nama Sub Departemen sudah digunakan.',
      });
    }
  };

  const handleFormSubmit = async (values: SubDepartemenFormValues) => {
    clearErrors(['code', 'name']);

    const formattedCode = sanitizeDsInput(values.code);
    const trimmedName = values.name.trim();
    let hasError = false;

    if (!formattedCode) {
      setError('code', {
        type: 'manual',
        message: 'ID Sub Departemen wajib diisi.',
      });
      hasError = true;
    } else if (!DS_PATTERN.test(formattedCode)) {
      setError('code', {
        type: 'manual',
        message: 'Format ID harus DS diikuti 3 angka (contoh: DS072).',
      });
      hasError = true;
    } else if (checkDuplicateCode(formattedCode)) {
      setError('code', {
        type: 'manual',
        message: 'ID Sub Departemen sudah digunakan.',
      });
      hasError = true;
    }

    if (!trimmedName) {
      setError('name', {
        type: 'manual',
        message: 'Nama Sub Departemen wajib diisi.',
      });
      hasError = true;
    } else if (checkDuplicateName(trimmedName)) {
      setError('name', {
        type: 'manual',
        message: 'Nama Sub Departemen sudah digunakan.',
      });
      hasError = true;
    }

    if (hasError) return;

    const selectedDept = (formDeptOptions || []).find(
      (d) => (d.code || String(d.id)) === values.department_code
    );

    const deptName = selectedDept ? (selectedDept.name || (selectedDept as any).departemen) : '';
    const deptCode = selectedDept ? (selectedDept.code || values.department_code) : values.department_code;

    try {
      await onSubmit({
        ...values,
        code: formattedCode,
        name: trimmedName,
        department_code: deptCode,
        department_name: deptName,
        departemen_nama: deptName,
      } as any);
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

      {/* Field ID Sub Departemen: Format DSXXX & Wajib Unik (Alert tanpa kotak via prop error) */}
      <div>
        <FormInput
          label="ID Sub Departemen"
          {...codeRegistration}
          maxLength={5}
          onChange={(e) => {
            codeRegistration.onChange(e);
            handleCodeChange(e);
          }}
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

      {/* Field Nama Sub Departemen: Wajib Unik (Alert tanpa kotak via prop error) */}
      <FormInput
        label="Sub Departemen"
        {...nameRegistration}
        onChange={(e) => {
          nameRegistration.onChange(e);
          handleNameChange(e);
        }}
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