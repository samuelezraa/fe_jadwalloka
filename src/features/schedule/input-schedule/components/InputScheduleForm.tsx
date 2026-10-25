import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inputScheduleSchema,
  type InputScheduleFormValues,
} from '../schemas/input-schedule.schema';
import type { InputSchedulePeriodItem } from '../types/input-schedule.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface InputScheduleFormProps {
  initialData?: InputSchedulePeriodItem | null;
  onSubmit: (data: InputScheduleFormValues) => void;
  onCancel: () => void;
}

export const InputScheduleForm: React.FC<InputScheduleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputScheduleFormValues>({
    resolver: zodResolver(inputScheduleSchema) as any,
    defaultValues: {
      periodId: '',
      nip: '',
      name: '',
      subDept: '',
      workScheme: '',
      totalDays: 0,
      workDays: 0,
      offDays: 0,
      phDays: 0,
      permitDays: 0,
      alphaDays: 0,
      leaveDays: 0,
      lateDays: 0,
      ref: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        periodId: initialData.periodId,
        nip: initialData.nip,
        name: initialData.name,
        subDept: initialData.subDept,
        workScheme: initialData.workScheme,
        totalDays: initialData.totalDays,
        workDays: initialData.workDays,
        offDays: initialData.offDays,
        phDays: initialData.phDays,
        permitDays: initialData.permitDays,
        alphaDays: initialData.alphaDays,
        leaveDays: initialData.leaveDays,
        lateDays: initialData.lateDays,
        ref: initialData.ref || '',
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as InputScheduleFormValues))}
      className="space-y-4 max-h-[75vh] overflow-y-auto px-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="ID Periode"
          {...register('periodId')}
          placeholder="Contoh: 2026-10"
          error={errors.periodId?.message}
        />
        <FormInput
          label="NIP"
          {...register('nip')}
          placeholder="Contoh: 99-9999-01"
          error={errors.nip?.message}
        />
      </div>

      <FormInput
        label="Nama Karyawan"
        {...register('name')}
        placeholder="Contoh: Antika Lorien"
        error={errors.name?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Sub Departemen"
          {...register('subDept')}
          placeholder="Contoh: Aplikasi & System"
          error={errors.subDept?.message}
        />
        <FormInput
          label="Skema Kerja"
          {...register('workScheme')}
          placeholder="Contoh: 5-2"
          error={errors.workScheme?.message}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <FormInput label="Total Hari" type="number" {...register('totalDays', { valueAsNumber: true })} />
        <FormInput label="Masuk" type="number" {...register('workDays', { valueAsNumber: true })} />
        <FormInput label="Libur" type="number" {...register('offDays', { valueAsNumber: true })} />
        <FormInput label="PH" type="number" {...register('phDays', { valueAsNumber: true })} />
        <FormInput label="Izin" type="number" {...register('permitDays', { valueAsNumber: true })} />
        <FormInput label="Alfa" type="number" {...register('alphaDays', { valueAsNumber: true })} />
        <FormInput label="Cuti" type="number" {...register('leaveDays', { valueAsNumber: true })} />
        <FormInput label="Terlambat" type="number" {...register('lateDays', { valueAsNumber: true })} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};