import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { posSchema, type PosFormValues } from '../schemas/pos.schema';
import type { Pos } from '../types/pos.type';
import { posService } from '../services/pos.service';
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
  existingList?: Pos[];
  onSubmit: (data: PosFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const POS_CODE_PATTERN = /^POS\d{1,4}$/;

const sanitizePosCodeInput = (rawValue: string): string => {
  const cleaned = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('POS')) {
    const digits = cleaned.slice(3).replace(/\D/g, '').slice(0, 4);
    return `POS${digits}`;
  }
  if (cleaned.startsWith('PO')) {
    const digits = cleaned.slice(2).replace(/\D/g, '').slice(0, 4);
    return digits ? `POS${digits}` : 'POS';
  }
  if (cleaned.startsWith('P')) {
    const digits = cleaned.slice(1).replace(/\D/g, '').slice(0, 4);
    return digits ? `POS${digits}` : 'POS';
  }

  const digits = cleaned.replace(/\D/g, '').slice(0, 4);
  return digits ? `POS${digits}` : '';
};

export const PosForm: React.FC<PosFormProps> = ({
  initialData,
  departemenList = [],
  subDepartemenList = [],
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
    watch,
    setValue,
    setError,
    clearErrors,
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

  // State untuk Backend Search Debounce pada Form
  const [formDeptSearchQuery, setFormDeptSearchQuery] = useState('');
  const [formDeptOptions, setFormDeptOptions] = useState<Departemen[]>(departemenList);

  const [formSubDeptSearchQuery, setFormSubDeptSearchQuery] = useState('');
  const [formSubDeptOptions, setFormSubDeptOptions] = useState<SubDepartemen[]>(subDepartemenList);

  const [allPosList, setAllPosList] = useState<Pos[]>(existingList);

  useEffect(() => {
    setAllPosList(existingList);
  }, [existingList]);

  useEffect(() => {
    let active = true;
    const loadExistingPos = async () => {
      try {
        if (typeof posService?.getAll === 'function') {
          const res = await posService.getAll('', '', '', '', 1, 500);
          if (active && Array.isArray(res?.data)) {
            setAllPosList((prev) => {
              const merged = [...prev, ...res.data];
              const seen = new Map<string, Pos>();
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
    loadExistingPos();
    return () => {
      active = false;
    };
  }, []);

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

  const filteredSubDepartmentList = useMemo(() => {
    if (!selectedDepartmentCode || !Array.isArray(formSubDeptOptions)) return [];
    return formSubDeptOptions.filter((sub) => {
      if (!Boolean(sub.is_active)) return false;
      const parentCode = sub.department_code || (sub as any).departemen_id;
      return String(parentCode) === String(selectedDepartmentCode);
    });
  }, [formSubDeptOptions, selectedDepartmentCode]);

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

  const isDuplicateCode = (rawCode: string): boolean => {
    if (isEditMode) return false;
    const normalized = rawCode.trim().toLowerCase();
    if (!normalized) return false;

    return allPosList.some((item) => {
      const itemCode = String(item.code || '').trim().toLowerCase();
      return itemCode !== '' && itemCode === normalized;
    });
  };

  const isDuplicateTitle = (rawTitle: string): boolean => {
    const normalized = rawTitle.trim().toLowerCase();
    if (!normalized) return false;

    const currentId = initialData?.id !== undefined ? String(initialData.id) : null;
    const currentCode = String(initialData?.code || '').trim().toLowerCase();

    return allPosList.some((item) => {
      const itemId = item.id !== undefined ? String(item.id) : null;
      const itemCode = String(item.code || '').trim().toLowerCase();

      if (isEditMode) {
        if (currentId && itemId === currentId) return false;
        if (!currentId && currentCode && itemCode === currentCode) return false;
      }

      const itemTitle = String(item.title || (item as any).pos || '').trim().toLowerCase();
      return itemTitle !== '' && itemTitle === normalized;
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = sanitizePosCodeInput(e.target.value);
    setValue('code', formatted, { shouldValidate: false });
    clearErrors('code');

    if (!isEditMode && formatted && isDuplicateCode(formatted)) {
      setError('code', {
        type: 'manual',
        message: 'ID POS sudah digunakan. Gunakan ID lain yang belum terdaftar.',
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    clearErrors('title');

    if (val.trim() && isDuplicateTitle(val)) {
      setError('title', {
        type: 'manual',
        message: 'Nama POS sudah digunakan. Gunakan nama lain yang belum terdaftar.',
      });
    }
  };

  const handleFormSubmit = async (values: PosFormValues) => {
    clearErrors(['code', 'title']);

    const formattedCode = isEditMode ? values.code.trim().toUpperCase() : sanitizePosCodeInput(values.code);
    const trimmedTitle = values.title.trim();
    let hasError = false;

    if (!isEditMode) {
      if (!formattedCode) {
        setError('code', {
          type: 'manual',
          message: 'ID POS wajib diisi.',
        });
        hasError = true;
      } else if (!POS_CODE_PATTERN.test(formattedCode)) {
        setError('code', {
          type: 'manual',
          message: 'Format ID POS harus diawali POS dan diikuti 1 sampai 4 digit angka (contoh: POS01).',
        });
        hasError = true;
      } else if (isDuplicateCode(formattedCode)) {
        setError('code', {
          type: 'manual',
          message: 'ID POS sudah digunakan. Gunakan ID lain yang belum terdaftar.',
        });
        hasError = true;
      }
    }

    if (!trimmedTitle) {
      setError('title', {
        type: 'manual',
        message: 'Nama POS wajib diisi.',
      });
      hasError = true;
    } else if (isDuplicateTitle(trimmedTitle)) {
      setError('title', {
        type: 'manual',
        message: 'Nama POS sudah digunakan. Gunakan nama lain yang belum terdaftar.',
      });
      hasError = true;
    }

    if (hasError) return;

    try {
      await onSubmit({
        ...values,
        code: formattedCode,
        title: trimmedTitle,
      });
    } catch (err: any) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors?.code?.[0]) {
        setError('code', { type: 'server', message: serverErrors.code[0] });
      }
      if (serverErrors?.title?.[0]) {
        setError('title', { type: 'server', message: serverErrors.title[0] });
      }
    }
  };

  const codeRegistration = register('code');
  const titleRegistration = register('title');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            disabled={!selectedDepartmentCode}
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
          {...codeRegistration}
          disabled={isEditMode}
          maxLength={7}
          onChange={(e) => {
            codeRegistration.onChange(e);
            handleCodeChange(e);
          }}
          placeholder="Contoh: POS01"
          error={errors.code?.message}
        />
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          {isEditMode
            ? 'ID POS tidak dapat diubah.'
            : 'Format: POS diikuti 1 sampai 4 digit angka (contoh: POS1, POS01, POS8888).'}
        </p>
      </div>

      {/* 4. Field Pos */}
      <FormInput
        label="Pos"
        {...titleRegistration}
        onChange={(e) => {
          titleRegistration.onChange(e);
          handleTitleChange(e);
        }}
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