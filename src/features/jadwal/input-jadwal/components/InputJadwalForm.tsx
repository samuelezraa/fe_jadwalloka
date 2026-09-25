import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inputJadwalSchema,
  type InputJadwalFormValues,
} from '../schemas/input-jadwal.schema';
import type { InputJadwalPeriode } from '../types/input-jadwal.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface InputJadwalFormProps {
  initialData?: InputJadwalPeriode | null;
  onSubmit: (data: InputJadwalFormValues) => void;
  onCancel: () => void;
}

export const InputJadwalForm: React.FC<InputJadwalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputJadwalFormValues>({
    resolver: zodResolver(inputJadwalSchema),
    defaultValues: {
      id_periode: '',
      nip: '',
      nama: '',
      sub_dept: '',
      skema_kerja: '',
      total_hari: 0,
      masuk: 0,
      total_libur: 0,
      ph: 0,
      cuti: 0,
      ref: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id_periode: initialData.id_periode,
        nip: initialData.nip,
        nama: initialData.nama,
        sub_dept: initialData.sub_dept,
        skema_kerja: initialData.skema_kerja,
        total_hari: initialData.total_hari,
        masuk: initialData.masuk,
        total_libur: initialData.total_libur,
        ph: initialData.ph,
        cuti: initialData.cuti,
        ref: initialData.ref || '',
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="ID Periode"
          {...register('id_periode')}
          placeholder="Contoh: PERIODE-01"
          error={errors.id_periode?.message}
        />

        <FormInput
          label="NIP"
          {...register('nip')}
          placeholder="Contoh: 123456"
          error={errors.nip?.message}
        />
      </div>

      <FormInput
        label="Nama Karyawan"
        {...register('nama')}
        placeholder="Contoh: Antika Lorien"
        error={errors.nama?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Sub Departemen"
          {...register('sub_dept')}
          placeholder="Contoh: Aplikasi & System"
          error={errors.sub_dept?.message}
        />

        <FormInput
          label="Skema Kerja"
          {...register('skema_kerja')}
          placeholder="Contoh: 5-2"
          error={errors.skema_kerja?.message}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <FormInput
          label="Total Hari"
          type="number"
          {...register('total_hari', { valueAsNumber: true })}
        />
        <FormInput
          label="Masuk"
          type="number"
          {...register('masuk', { valueAsNumber: true })}
        />
        <FormInput
          label="Libur"
          type="number"
          {...register('total_libur', { valueAsNumber: true })}
        />
        <FormInput
          label="PH"
          type="number"
          {...register('ph', { valueAsNumber: true })}
        />
        <FormInput
          label="Cuti"
          type="number"
          {...register('cuti', { valueAsNumber: true })}
        />
      </div>

      {/* Reusable Action Buttons (Tombol Batal Merah & Simpan) */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};