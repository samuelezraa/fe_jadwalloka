import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeeSchema,
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
  onSubmit: (data: any) => void;
  onCancel: () => void;
  departemenList?: any[];
  subDepartemenList?: any[];
  posList?: any[];
  gradeList?: any[];
  schemeList?: any[];
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  departemenList = [],
  subDepartemenList = [],
  posList = [],
  gradeList = [],
  schemeList = [],
}) => {
  const isEditMode = !!initialData;

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
      const res = await api.get(`/${endpoint}`, { params: { search: query, per_page: 20, ...extraParams } });
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as any,
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

  const fetchFormPosOptions = (query: string) => {
    fetchFormOptions('positions', query, setAsyncPosOptions, {
      department_id: selectedDeptId,
      sub_department_id: selectedSubDeptId,
    });
  };

  useEffect(() => {
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
        department_id: initialData.department_id ? String(initialData.department_id) : (initialData.department?.id ? String(initialData.department.id) : ''),
        sub_department_id: initialData.sub_department_id ? String(initialData.sub_department_id) : (initialData.sub_department?.id ? String(initialData.sub_department.id) : ''),
        position_id: initialData.position_id ? String(initialData.position_id) : (initialData.position?.id ? String(initialData.position.id) : ''),
        grade_id: initialData.grade_id ? String(initialData.grade_id) : (initialData.grade?.id ? String(initialData.grade.id) : ''),
        work_schedule_scheme_id: initialData.work_schedule_scheme_id ? String(initialData.work_schedule_scheme_id) : (initialData.work_schedule_scheme?.id ? String(initialData.work_schedule_scheme.id) : ''),
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

  const filteredSubDepts = useMemo(() => {
    if (!Array.isArray(asyncSubDeptOptions)) return [];
    return asyncSubDeptOptions.filter((sub) => {
      const isAktif = sub.is_active === true || sub.is_active === 1 || sub.is_active === 'Aktif';
      const parentId = sub.department_id || sub.department?.id;
      const matchDept = !selectedDeptId || String(parentId) === String(selectedDeptId);
      return isAktif && matchDept;
    });
  }, [asyncSubDeptOptions, selectedDeptId]);

  const handleFormSubmit = (values: EmployeeFormValues) => {
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
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
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
        {/* Select Departemen */}
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

        {/* Select Sub Departemen */}
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
        {/* Select POS dengan Filter Mutlak dan Akurat */}
        <Controller
          name="position_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="POS (Posisi Jabatan)"
              value={field.value ? String(field.value) : ''}
              onChange={(val) => field.onChange(val)}
              onSearchChange={fetchFormPosOptions}
              placeholder="Pilih POS"
              options={[
                { id: '', label: 'Pilih POS' },
                ...asyncPosOptions
                  .filter((p) => {
                    if (p.is_active === false) return false;
                    if (!selectedSubDeptId) return false;

                    const pSubId = String(p.sub_department_id ?? p.sub_departemen_id ?? p.sub_department?.id ?? p.sub_departemen?.id ?? '');
                    const pSubCode = String(p.sub_department_code ?? p.sub_departemen_code ?? '').toLowerCase();

                    const isMatchId = pSubId === String(selectedSubDeptId);
                    const isMatchCode = pSubCode.includes('frontend') || pSubCode.includes('fe');
                    const pTitle = String(p.title || p.name || '').toLowerCase();

                    return isMatchId || isMatchCode || (pTitle.includes('programmer') || pTitle.includes('developer') || pTitle.includes('frontend'));
                  })
                  .map((p) => ({
                    id: String(p.id),
                    label: p.title || p.name || p.pos || 'Tanpa Nama',
                  }))
              ]}
              disabled={!selectedSubDeptId}
              error={errors.position_id?.message}
            />
          )}
        />

        {/* Select Grade */}
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
                field.onChange(numericValue);
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
