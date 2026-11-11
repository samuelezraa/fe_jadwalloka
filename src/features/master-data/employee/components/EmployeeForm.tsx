import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeeSchema,
  type EmployeeFormValues,
} from '../schemas/employee.schema';
import type { Employee } from '../types/employee.type';

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

  // Watch perubahan Departemen & Sub Departemen secara real-time
  const selectedDeptId = useWatch({ control, name: 'department_id' });
  const selectedSubDeptId = useWatch({ control, name: 'sub_department_id' });

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

  // 1. Filter Sub Departemen Berdasarkan Departemen yang Dipilih (Hanya yang Aktif)
  const filteredSubDepts = useMemo(() => {
    if (!Array.isArray(subDepartemenList)) return [];
    return subDepartemenList.filter((sub) => {
      const isAktif = sub.is_active === true || sub.is_active === 1 || sub.is_active === 'Aktif';
      const parentId = sub.department_id || sub.department?.id;
      const matchDept = !selectedDeptId || String(parentId) === String(selectedDeptId);
      return isAktif && matchDept;
    });
  }, [subDepartemenList, selectedDeptId]);


// 2. Filter POS Berdasarkan Sub Departemen / Departemen (Hanya yang Aktif)
const filteredPosList = useMemo(() => {
  if (!Array.isArray(posList)) return [];

  return posList.filter((pos) => {
    // 1. Cek status aktif
    const isAktif = pos.is_active === true || pos.is_active === 1 || pos.is_active === 'Aktif' || pos.is_active === undefined;
    if (!isAktif) return false;

    // 2. Ambil ID Sub Dept & Dept dari data POS
    const parentSubId = pos.sub_department_id ?? pos.sub_departemen_id ?? pos.sub_department?.id ?? pos.sub_departemen?.id;
    const parentDeptId = pos.department_id ?? pos.departemen_id ?? pos.department?.id ?? pos.departemen?.id;

    // 3. Jika POS di database memilik relasi sub_department_id, filter berdasarkan Sub Dept terpilih
    if (parentSubId && selectedSubDeptId) {
      return String(parentSubId) === String(selectedSubDeptId);
    }

    // 4. Jika POS di database hanya punya department_id, filter berdasarkan Dept terpilih
    if (parentDeptId && selectedDeptId) {
      return String(parentDeptId) === String(selectedDeptId);
    }

    // 5. Jika POS di database TIDAK MEMILIKI relasi parent (null/undefined), TETAP TAMPILKAN
    return true;
  });
}, [posList, selectedSubDeptId, selectedDeptId]);

  const handleFormSubmit = (values: EmployeeFormValues) => {
    const payload = {
      employee_id: values.employee_id || null,
      nip: values.nip,
      full_name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      department_id: values.department_id ? Number(values.department_id) : null,
      sub_department_id: values.sub_department_id ? Number(values.sub_department_id) : null,
      position_id: values.position_id ? Number(values.position_id) : null,
      grade_id: values.grade_id ? Number(values.grade_id) : null,
      work_schedule_scheme_id: values.work_schedule_scheme_id ? Number(values.work_schedule_scheme_id) : null,
      join_date: values.join_date || null,
      birth_date: values.birth_date || null,
      is_active: values.is_active,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="ID Karyawan (Opsional)"
          {...register('employee_id')}
          placeholder="Contoh: EMP-001"
          error={errors.employee_id?.message}
        />

        <FormInput
          label="NIP"
          {...register('nip')}
          placeholder="Contoh: 1001"
          error={errors.nip?.message}
        />

        <FormInput
          label="Nama Lengkap"
          {...register('name')}
          placeholder="Contoh: Antika Lorien"
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
                setValue('sub_department_id', ''); // Reset sub departemen
                setValue('position_id', ''); // Reset POS
              }}
              placeholder="Pilih Departemen"
              options={departemenList.filter(d => d.is_active).map(d => ({
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
                setValue('position_id', ''); // Reset POS ketika sub departemen berubah
              }}
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
          {/* Select POS (Posisi Jabatan) */}
      <Controller
        name="position_id"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="POS (Posisi Jabatan)"
            value={field.value ? String(field.value) : ''}
            onChange={(val) => field.onChange(val)}
            placeholder={selectedSubDeptId ? 'Pilih POS' : 'Pilih Sub Departemen dahulu'}
            options={filteredPosList.map((p) => ({
              id: String(p.id),
              label: p.title || p.pos || p.name || p.pos_name || 'Tanpa Nama',
            }))}
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
              placeholder="Pilih Grade"
              options={gradeList.filter(g => g.is_active).map(g => ({
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
          label="Email"
          type="email"
          {...register('email')}
          placeholder="Contoh: email@lokahr.com"
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select Skema Hari Kerja */}
        <Controller
          name="work_schedule_scheme_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Skema Hari Kerja"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Pilih Skema"
              options={schemeList.map((s: any) => ({
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