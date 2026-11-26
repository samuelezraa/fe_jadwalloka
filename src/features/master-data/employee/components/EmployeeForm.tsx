import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeesSchema,
  type EmployeeFormValues,
} from '../schemas/employee.schema';
import type { Employee } from '../types/employee.type';
import { api } from '../../../../lib/axios';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel: () => void;
  departemenList?: any[];
  subDepartemenList?: any[];
  posList?: any[];
  gradeList?: any[];
  schemeList?: any[];
  serverErrors?: Record<string, string[] | string> | null;
}

const FIELD_MAP: Record<string, keyof EmployeeFormValues> = {
  employee_id: 'employee_id',
  nip: 'nip',
  full_name: 'name',
  name: 'name',
  email: 'email',
  phone: 'phone',
  department_id: 'department_id',
  sub_department_id: 'sub_department_id',
  position_id: 'position_id',
  grade_id: 'grade_id',
  work_schedule_scheme_id: 'work_schedule_scheme_id',
  join_date: 'join_date',
  birth_date: 'birth_date',
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  departemenList = [],
  subDepartemenList = [],
  posList = [],
  gradeList = [],
  schemeList = [],
  serverErrors = null,
}) => {
  const isEditMode = !!initialData?.id;

  const [asyncDeptOptions, setAsyncDeptOptions] = useState<any[]>(departemenList);
  const [asyncSubDeptOptions, setAsyncSubDeptOptions] = useState<any[]>(subDepartemenList);
  const [asyncPosOptions, setAsyncPosOptions] = useState<any[]>(posList);
  const [asyncGradeOptions, setAsyncGradeOptions] = useState<any[]>(gradeList);
  const [asyncSchemeOptions, setAsyncSchemeOptions] = useState<any[]>(schemeList);

  useEffect(() => { setAsyncDeptOptions(departemenList); }, [departemenList]);
  useEffect(() => { setAsyncSubDeptOptions(subDepartemenList); }, [subDepartemenList]);
  useEffect(() => { setAsyncPosOptions(posList); }, [posList]);
  useEffect(() => { setAsyncGradeOptions(gradeList); }, [gradeList]);
  useEffect(() => { setAsyncSchemeOptions(schemeList); }, [schemeList]);

  const fetchFormOptions = async (endpoint: string, query: string, setter: Function, extraParams = {}) => {
    try {
      const res = await api.get(`/${endpoint}`, { params: { search: query, per_page: 25, ...extraParams } });
      setter(res.data.data || res.data || []);
    } catch (err) {
      console.error(`Gagal memuat opsi form ${endpoint}`, err);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeesSchema) as any,
    defaultValues: {
      employee_id: '',
      nip: '',
      name: '',
      email: '',
      phone: '',
      department_id: '',
      sub_department_id: '',
      position_id: '',
      grade_id: '',
      work_schedule_scheme_id: '',
      join_date: '',
      birth_date: '',
      is_active: true,
    },
  });

  const selectedDeptId = useWatch({ control, name: 'department_id' });
  const selectedSubDeptId = useWatch({ control, name: 'sub_department_id' });

  const lastResetKeyRef = useRef<string | null>(null);

const isValidPhonePrefix = (value: string): boolean => {
  if (!value) return true;
  if (value === '0' || value === '6') return true;
  return /^(08|8|62)\d*$/.test(value);
};

const hasCompleteValidPrefix = (value: string): boolean => {
  if (!value) return false;
  return /^(08|8|62)\d*$/.test(value);
};


  useEffect(() => {
    const resetKey = initialData
      ? `${initialData.id ?? 'new'}-${initialData.employee_id ?? ''}-${initialData.nip ?? ''}-${initialData.phone ?? ''}`
      : 'empty-new';

    if (lastResetKeyRef.current === resetKey) return;
    lastResetKeyRef.current = resetKey;

    if (initialData) {
      const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
          const [d, m, y] = dateStr.split('-');
          return `${y}-${m}-${d}`;
        }
        return dateStr.split('T')[0];
      };

      reset({
        employee_id: String(initialData.employee_id || ''),
        nip: String(initialData.nip || ''),
        name: String(initialData.full_name || initialData.name || ''),
        email: String(initialData.email || ''),
        phone: String(initialData.phone || ''),
        department_id: initialData.department_id
          ? String(initialData.department_id)
          : (initialData.department?.id ? String(initialData.department.id) : ''),
        sub_department_id: initialData.sub_department_id
          ? String(initialData.sub_department_id)
          : (initialData.sub_department?.id ? String(initialData.sub_department.id) : ''),
        position_id: initialData.position_id
          ? String(initialData.position_id)
          : (initialData.position?.id ? String(initialData.position.id) : ''),
        grade_id: initialData.grade_id
          ? String(initialData.grade_id)
          : (initialData.grade?.id ? String(initialData.grade.id) : ''),
        work_schedule_scheme_id: initialData.work_schedule_scheme_id
          ? String(initialData.work_schedule_scheme_id)
          : (initialData.work_schedule_scheme?.id ? String(initialData.work_schedule_scheme.id) : ''),
        join_date: formatDate(initialData.join_date),
        birth_date: formatDate(initialData.birth_date),
        is_active: Boolean(initialData.is_active ?? true),
      });
    } else {
      reset({
        employee_id: '',
        nip: '',
        name: '',
        email: '',
        phone: '',
        department_id: '',
        sub_department_id: '',
        position_id: '',
        grade_id: '',
        work_schedule_scheme_id: '',
        join_date: '',
        birth_date: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!serverErrors) return;

    Object.entries(serverErrors).forEach(([key, messages]) => {
      const targetField = FIELD_MAP[key];
      const message = Array.isArray(messages) ? messages[0] : String(messages);
      if (targetField && message) {
        setError(targetField, { type: 'server', message });
      }
    });
  }, [serverErrors, setError]);

  useEffect(() => {
    if (!selectedSubDeptId) return;

    const selectedSub = asyncSubDeptOptions.find(
      (s) => String(s.id) === String(selectedSubDeptId)
    );
    const subCode = selectedSub?.code || selectedSubDeptId;

    const selectedDept = asyncDeptOptions.find(
      (d) => String(d.id) === String(selectedDeptId)
    );
    const deptCode = selectedDept?.code || selectedDeptId;

    fetchFormOptions('positions', '', setAsyncPosOptions, {
      department_id: deptCode,
      sub_department_id: subCode,
    });
  }, [selectedDeptId, selectedSubDeptId]);


  
  const fetchFormPosOptions = (query: string) => {
    const selectedSub = asyncSubDeptOptions.find(
      (s) => String(s.id) === String(selectedSubDeptId)
    );
    const subCode = selectedSub?.code || selectedSubDeptId;

    const selectedDept = asyncDeptOptions.find(
      (d) => String(d.id) === String(selectedDeptId)
    );
    const deptCode = selectedDept?.code || selectedDeptId;

    fetchFormOptions('positions', query, setAsyncPosOptions, {
      department_id: deptCode,
      sub_department_id: subCode,
    });
  };

  const filteredSubDepts = useMemo(() => {
    if (!Array.isArray(asyncSubDeptOptions)) return [];
    const selectedDept = asyncDeptOptions.find((d) => String(d.id) === String(selectedDeptId));
    const selectedDeptCode = selectedDept?.code ? String(selectedDept.code) : '';

    return asyncSubDeptOptions.filter((sub) => {
      const isAktif = sub.is_active === true || sub.is_active === 1 || sub.is_active === 'Aktif';
      if (!selectedDeptId) return false;

      const parentId = String(sub.department_id ?? sub.department?.id ?? '');
      const parentCode = String(sub.department_code ?? sub.department?.code ?? '');

      const matchDept =
        parentId === String(selectedDeptId) ||
        (selectedDeptCode !== '' && parentCode === selectedDeptCode);

      return isAktif && matchDept;
    });
  }, [asyncSubDeptOptions, asyncDeptOptions, selectedDeptId]);

  const filteredPositions = useMemo(() => {
    if (!selectedSubDeptId || !Array.isArray(asyncPosOptions)) return [];

    const selectedSub = asyncSubDeptOptions.find(
      (s) => String(s.id) === String(selectedSubDeptId)
    );
    const selectedSubCode = selectedSub?.code ? String(selectedSub.code) : '';

    return asyncPosOptions.filter((p) => {
      if (p.is_active === false || p.is_active === 0) return false;

      const pSubId = String(
        p.sub_department_id ?? p.sub_departemen_id ?? p.sub_department?.id ?? p.sub_departemen?.id ?? ''
      );
      const pSubCode = String(
        p.sub_department_code ?? p.sub_departemen_code ?? p.sub_department?.code ?? ''
      );

      const isMatchId = pSubId !== '' && pSubId === String(selectedSubDeptId);
      const isMatchCode = selectedSubCode !== '' && pSubCode === selectedSubCode;

      return isMatchId || isMatchCode;
    });
  }, [asyncPosOptions, asyncSubDeptOptions, selectedSubDeptId]);

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    clearErrors();
    const payload = {
      employee_id: values.employee_id,
      nip: values.nip,
      full_name: values.name,
      email: values.email || null,
      phone: values.phone,
      department_id: values.department_id ? Number(values.department_id) : null,
      sub_department_id: values.sub_department_id ? Number(values.sub_department_id) : null,
      position_id: values.position_id ? Number(values.position_id) : null,
      grade_id: values.grade_id ? Number(values.grade_id) : null,
      work_schedule_scheme_id: values.work_schedule_scheme_id ? Number(values.work_schedule_scheme_id) : null,
      join_date: values.join_date,
      birth_date: values.birth_date,
      is_active: values.is_active,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === 'object') {
        Object.entries(apiErrors).forEach(([key, messages]) => {
          const targetField = FIELD_MAP[key];
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          if (targetField && message) {
            setError(targetField, { type: 'server', message });
          }
        });
      }
    }
  };

  const handleInvalidSubmit = (formErrors: any) => {
    console.warn('Validasi form gagal:', formErrors);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleInvalidSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="employee_id"
          control={control}
          render={({ field }) => (
            <FormInput
              label="ID Karyawan (4 Digit)"
              type="text"
              inputMode="numeric"
              value={field.value || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                field.onChange(numericValue);
                clearErrors('employee_id');
              }}
              placeholder="Contoh: 1001"
              maxLength={4}
              error={errors.employee_id?.message}
            />
          )}
        />

        <Controller
          name="nip"
          control={control}
          render={({ field }) => (
            <FormInput
              label="NIP (9 Digit)"
              type="text"
              inputMode="numeric"
              value={field.value || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 9);
                field.onChange(numericValue);
                clearErrors('nip');
              }}
              placeholder="Contoh: 000001001"
              maxLength={9}
              error={errors.nip?.message}
            />
          )}
        />

        <FormInput
          label="Nama Lengkap"
          {...register('name')}
          placeholder="Contoh: Nova Hendriawan"
          error={errors.name?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="department_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Departemen"
              value={field.value || ''}
              onChange={(val) => {
                field.onChange(val);
                setValue('sub_department_id', '');
                setValue('position_id', '');
              }}
              onSearchChange={(query) => fetchFormOptions('departments', query, setAsyncDeptOptions)}
              placeholder="Pilih Departemen"
              options={asyncDeptOptions.filter(d => d.is_active !== false).map(d => ({
                id: String(d.id),
                label: d.name || d.departemen
              }))}
              error={errors.department_id?.message}
            />
          )}
        />

        <Controller
          name="sub_department_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Sub Departemen"
              value={field.value || ''}
              onChange={(val) => {
                field.onChange(val);
                setValue('position_id', '');
              }}
              onSearchChange={(query) => fetchFormOptions('sub-departments', query, setAsyncSubDeptOptions, { department_id: selectedDeptId })}
              placeholder={selectedDeptId ? 'Pilih Sub Departemen' : 'Pilih Departemen dahulu'}
              options={filteredSubDepts.map(sub => ({
                id: String(sub.id),
                label: sub.name || sub.sub_departemen
              }))}
              disabled={!selectedDeptId}
              error={errors.sub_department_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="position_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="POS (Posisi Jabatan)"
              value={field.value ? String(field.value) : ''}
              onChange={(val) => field.onChange(val)}
              onSearchChange={fetchFormPosOptions}
              placeholder={selectedSubDeptId ? 'Pilih POS' : 'Pilih Sub Departemen dahulu'}
              options={filteredPositions.map((p) => ({
                id: String(p.id),
                label: p.title || p.name || p.pos || 'Tanpa Nama',
              }))}
              disabled={!selectedSubDeptId}
              error={errors.position_id?.message}
            />
          )}
        />

        <Controller
          name="grade_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Grade"
              value={field.value || ''}
              onChange={field.onChange}
              onSearchChange={(query) => fetchFormOptions('grades', query, setAsyncGradeOptions)}
              placeholder="Pilih Grade"
              options={asyncGradeOptions.filter(g => g.is_active !== false).map(g => ({
                id: String(g.id),
                label: g.name || g.grade
              }))}
              error={errors.grade_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <FormInput
            label="Nomor Telepon (Maks 14 digit)"
            type="text"
            inputMode="numeric"
            value={field.value || ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '').slice(0, 14);

              if (!isValidPhonePrefix(numericValue)) {
                setError('phone', {
                  type: 'manual',
                  message: 'Nomor telepon harus diawali dengan 08, 8, atau 62.',
                });
                return;
              }

              field.onChange(numericValue);
              clearErrors('phone');

              if (numericValue.length >= 2 && !hasCompleteValidPrefix(numericValue)) {
                setError('phone', {
                  type: 'manual',
                  message: 'Nomor telepon harus diawali dengan 08, 8, atau 62.',
                });
              }
            }}
            placeholder="Contoh: 081234567890"
            maxLength={14}
            error={errors.phone?.message}
          />
        )}
      />

        <FormInput
          label="Email (Opsional)"
          type="email"
          {...register('email')}
          placeholder="Contoh: email@lokahr.com"
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="work_schedule_scheme_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Skema Hari Kerja"
              value={field.value || ''}
              onChange={field.onChange}
              onSearchChange={(query) => fetchFormOptions('work-schedule-schemes', query, setAsyncSchemeOptions)}
              placeholder="Pilih Skema"
              options={asyncSchemeOptions.map((s: any) => ({
                id: String(s.id),
                label: s.name || s.code
              }))}
              error={errors.work_schedule_scheme_id?.message}
            />
          )}
        />

        <Controller
          name="join_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Tanggal Bergabung"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Pilih Tanggal"
              error={errors.join_date?.message}
            />
          )}
        />

        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Tanggal Lahir"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Pilih Tanggal"
              error={errors.birth_date?.message}
            />
          )}
        />
      </div>

      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status Karyawan"
              value={field.value ? 'true' : 'false'}
              onChange={(val) => field.onChange(val === 'true')}
              placeholder="Pilih Status"
              options={[
                { id: 'true', label: 'Aktif' },
                { id: 'false', label: 'Non Aktif' },
              ]}
              error={errors.is_active?.message}
            />
          )}
        />
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};