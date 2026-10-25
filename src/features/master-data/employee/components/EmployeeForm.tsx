import React, { useEffect } from 'react';
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
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
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
      is_active: true,
    },
  });

  // Watch perubahan Departemen & Sub Departemen
  const selectedDeptId = useWatch({ control, name: 'department_id' });
  const selectedSubDeptId = useWatch({ control, name: 'sub_department_id' });

  useEffect(() => {
    if (initialData) {
      const rawJoinDate = initialData.join_date || (initialData as any).tanggal_bergabung || '';
      const formattedJoinDate = rawJoinDate ? String(rawJoinDate).split('T')[0] : '';

      reset({
        nip: String(initialData.nik || initialData.nip || ''),
        name: String(initialData.full_name || initialData.name || (initialData as any).nama || ''),
        email: String(initialData.email || ''),
        phone: String(initialData.phone || (initialData as any).nomor_telephone || ''),
        department_id: initialData.department_id ? String(initialData.department_id) : (initialData.department?.id ? String(initialData.department.id) : ''),
        sub_department_id: initialData.sub_department_id ? String(initialData.sub_department_id) : (initialData.sub_department?.id ? String(initialData.sub_department.id) : ''),
        position_id: initialData.position_id ? String(initialData.position_id) : (initialData.position?.id ? String(initialData.position.id) : ''),
        grade_id: initialData.grade_id ? String(initialData.grade_id) : (initialData.grade?.id ? String(initialData.grade.id) : ''),
        work_schedule_scheme_id: initialData.work_schedule_scheme_id ? String(initialData.work_schedule_scheme_id) : (initialData.work_schedule_scheme?.id ? String(initialData.work_schedule_scheme.id) : ''),
        join_date: formattedJoinDate,
        is_active: Boolean(initialData.is_active ?? ((initialData as any).status === 'Aktif')),
      });
    } else {
      reset({
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
        is_active: true,
      });
    }
  }, [initialData, reset]);

  // Master Data Dummy / API Options
  const departmentOptions = [
    { id: '1', label: 'IT' },
    { id: '2', label: 'HRD' },
  ];

  // Map Sub Departemen berdasarkan Departemen
  const allSubDepartments: Record<string, { id: string; label: string }[]> = {
    '1': [
      { id: '1', label: 'Aplikasi & System' },
      { id: '2', label: 'Infrastructure' },
    ],
    '2': [
      { id: '3', label: 'Recruiting & Talent Acquisition' },
      { id: '4', label: 'Payroll & Benefits' },
    ],
  };

  // Map POS berdasarkan Sub Departemen / Departemen
  const allPositions: Record<string, { id: string; label: string }[]> = {
    '1': [{ id: '1', label: 'Programmer Officer' }],
    '2': [{ id: '2', label: 'System Analyst' }],
    '3': [{ id: '3', label: 'Talent Acquisition Staff' }],
    '4': [{ id: '4', label: 'Payroll & Benefits Specialist' }],
  };

  const availableSubDeptOptions = selectedDeptId ? allSubDepartments[selectedDeptId] || [] : [];
  const availablePosOptions = selectedSubDeptId ? allPositions[selectedSubDeptId] || [] : [];

  const handleFormSubmit = (values: EmployeeFormValues) => {
    const payload = {
      nik: values.nip,
      full_name: values.name,
      email: values.email || null,
      phone: values.phone || null,
      department_id: values.department_id ? Number(values.department_id) : null,
      sub_department_id: values.sub_department_id ? Number(values.sub_department_id) : null,
      position_id: values.position_id ? Number(values.position_id) : null,
      grade_id: values.grade_id ? Number(values.grade_id) : null,
      work_schedule_scheme_id: values.work_schedule_scheme_id ? Number(values.work_schedule_scheme_id) : null,
      join_date: values.join_date || null,
      is_active: values.is_active,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="NIP / ID Karyawan"
          {...register('nip')}
          placeholder="Contoh: 123456"
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
        <Controller
          name="department_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Departemen"
              value={field.value || ''}
              onChange={(val) => {
                field.onChange(val);
                // Reset Sub Departemen & POS ketika Departemen diganti
                setValue('sub_department_id', '');
                setValue('position_id', '');
              }}
              placeholder="Pilih Departemen"
              options={departmentOptions}
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
                // Reset POS ketika Sub Departemen diganti
                setValue('position_id', '');
              }}
              placeholder={selectedDeptId ? 'Pilih Sub Departemen' : 'Pilih Departemen terlebih dahulu'}
              options={availableSubDeptOptions}
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
              value={field.value || ''}
              onChange={field.onChange}
              placeholder={selectedSubDeptId ? 'Pilih POS' : 'Pilih Sub Departemen terlebih dahulu'}
              options={availablePosOptions}
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
              placeholder="Pilih Grade"
              options={[
                { id: '1', label: 'Staff / Junior' },
                { id: '2', label: 'Senior Staff' },
                { id: '3', label: 'Supervisor' },
              ]}
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
              label="Nomor Telepon (Maks 13 digit)"
              type="text"
              value={field.value || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 13);
                field.onChange(numericValue);
              }}
              placeholder="Contoh: 081234567890"
              maxLength={13}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="work_schedule_scheme_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Skema Hari Kerja"
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Pilih Skema"
              options={[
                { id: '1', label: 'Skema 5-2' },
                { id: '2', label: 'Skema 6-1' },
              ]}
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