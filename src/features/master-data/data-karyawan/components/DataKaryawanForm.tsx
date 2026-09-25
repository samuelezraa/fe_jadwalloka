import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  dataKaryawanSchema,
  type DataKaryawanFormValues,
} from '../schemas/data-karyawan.schema';
import type { DataKaryawan } from '../types/data-karyawan.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface DataKaryawanFormProps {
  initialData?: DataKaryawan | null;
  onSubmit: (data: DataKaryawanFormValues) => void;
  onCancel: () => void;
}

export const DataKaryawanForm: React.FC<DataKaryawanFormProps> = ({
  initialData,
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
  } = useForm<DataKaryawanFormValues>({
    resolver: zodResolver(dataKaryawanSchema),
    defaultValues: {
      departemen_id: '',
      sub_departemen_id: '',
      pos_id: '',
      grade_id: '',
      nik: '',
      id_absen: '',
      nama: '',
      nomor_telephone: '',
      email: '',
      skema_hari_kerja: '',
      tanggal_bergabung: '',
      tanggal_lahir: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        departemen_id: initialData.departemen_id,
        sub_departemen_id: initialData.sub_departemen_id,
        pos_id: initialData.pos_id,
        grade_id: initialData.grade_id,
        nik: initialData.nik,
        id_absen: initialData.id_absen,
        nama: initialData.nama,
        nomor_telephone: initialData.nomor_telephone,
        email: initialData.email,
        skema_hari_kerja: initialData.skema_hari_kerja,
        tanggal_bergabung: initialData.tanggal_bergabung,
        tanggal_lahir: initialData.tanggal_lahir,
        status: initialData.status,
      });
    } else {
      reset({
        departemen_id: '',
        sub_departemen_id: '',
        pos_id: '',
        grade_id: '',
        nik: '',
        id_absen: '',
        nama: '',
        nomor_telephone: '',
        email: '',
        skema_hari_kerja: '',
        tanggal_bergabung: '',
        tanggal_lahir: '',
        status: 'Aktif',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NIK */}
        <FormInput
          label="NIK"
          {...register('nik')}
          placeholder="Contoh: 123456"
          error={errors.nik?.message}
        />

        {/* ID Absen / Username */}
        <FormInput
          label="ID Absen / Username (Angka)"
          {...register('id_absen')}
          placeholder="Contoh: 9999"
          error={errors.id_absen?.message}
        />
      </div>

      {/* Nama Lengkap */}
      <FormInput
        label="Nama Lengkap"
        {...register('nama')}
        placeholder="Contoh: Antika Lorien"
        error={errors.nama?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departemen dengan FormSelectSearch */}
        <Controller
          name="departemen_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Departemen"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Departemen"
              options={[
                { id: 'DP001', label: 'IT' },
                { id: 'DP002', label: 'HRD' },
              ]}
              error={errors.departemen_id?.message}
            />
          )}
        />

        {/* Sub Departemen dengan FormSelectSearch */}
        <Controller
          name="sub_departemen_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Sub Departemen"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Sub Departemen"
              options={[
                { id: 'SD001', label: 'Aplikasi & System' },
                { id: 'SD002', label: 'Infrastructure' },
              ]}
              error={errors.sub_departemen_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* POS dengan FormSelectSearch */}
        <Controller
          name="pos_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="POS (Posisi Jabatan)"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih POS"
              options={[
                { id: 'POS001', label: 'Programmer Officer' },
                { id: 'POS002', label: 'System Analyst' },
              ]}
              error={errors.pos_id?.message}
            />
          )}
        />

        {/* Grade dengan FormSelectSearch */}
        <Controller
          name="grade_id"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Grade"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Grade"
              options={[
                { id: 'GR001', label: 'Officer' },
                { id: 'GR002', label: 'Supervisor' },
              ]}
              error={errors.grade_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nomor Telephone: Angka Saja & Maks 13 digit */}
        <Controller
          name="nomor_telephone"
          control={control}
          render={({ field }) => (
            <FormInput
              label="Nomor Telephone (Maks 13 digit)"
              type="text"
              value={field.value}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '').slice(0, 13);
                field.onChange(numericValue);
              }}
              placeholder="Contoh: 081234567890"
              maxLength={13}
              error={errors.nomor_telephone?.message}
            />
          )}
        />

        {/* Email dengan Validasi Format */}
        <FormInput
          label="Email"
          type="email"
          {...register('email')}
          placeholder="Contoh: email@lokahr.com"
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skema Hari Kerja dengan FormSelectSearch */}
        <Controller
          name="skema_hari_kerja"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Skema Hari Kerja"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Skema"
              options={[
                { id: '5-2', label: '5-2' },
                { id: '5-1', label: '5-1' },
                { id: '6-1', label: '6-1' },
              ]}
              error={errors.skema_hari_kerja?.message}
            />
          )}
        />

        {/* Tanggal Bergabung */}
        <FormInput
          label="Tanggal Bergabung"
          type="date"
          {...register('tanggal_bergabung')}
          error={errors.tanggal_bergabung?.message}
        />

        {/* Tanggal Lahir */}
        <FormInput
          label="Tanggal Lahir"
          type="date"
          {...register('tanggal_lahir')}
          error={errors.tanggal_lahir?.message}
        />
      </div>

      {isEditMode && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Karyawan</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-400 transition-colors"
          >
            <option value="Aktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">Aktif</option>
            <option value="Non Aktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">Non Aktif</option>
          </select>
        </div>
      )}

      {/* Tombol Aksi Reusable */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};