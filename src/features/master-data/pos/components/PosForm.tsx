import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updatePosSchema,
  type UpdatePosFormValues,
} from '../schemas/pos.schema';
import type { Pos } from '../types/pos.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface PosFormProps {
  initialData?: Pos | null;
  departemenList: Departemen[];
  subDepartemenList: SubDepartemen[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PosForm: React.FC<PosFormProps> = ({
  initialData,
  departemenList,
  subDepartemenList,
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
    formState: { errors, isSubmitting },
  } = useForm<UpdatePosFormValues>({
    resolver: zodResolver(updatePosSchema),
    defaultValues: {
      departemen_id: '',
      sub_departemen_id: '',
      id: '',
      pos: '',
      status: 'Aktif',
    },
  });

  const selectedDeptId = watch('departemen_id');

  useEffect(() => {
    if (initialData) {
      reset({
        departemen_id: initialData.departemen_id,
        sub_departemen_id: initialData.sub_departemen_id,
        id: initialData.id,
        pos: initialData.pos,
        status: initialData.status,
      });
    } else {
      reset({
        departemen_id: '',
        sub_departemen_id: '',
        id: '',
        pos: '',
        status: 'Aktif',
      });
    }
  }, [initialData, reset]);

  // Format options untuk FormSelectSearch
  const departemenOptions = departemenList.map((d) => ({
    id: d.id,
    label: `${d.departemen} (${d.id})`,
  }));

  const filteredSubDeptList = subDepartemenList.filter(
    (sub) => !selectedDeptId || sub.departemen_id === selectedDeptId
  );

  const subDepartemenOptions = filteredSubDeptList.map((sub) => ({
    id: sub.id,
    label: `${sub.sub_departemen} (${sub.id})`,
  }));

  const handleFormSubmit = (values: UpdatePosFormValues) => {
    const selectedDept = departemenList.find((d) => d.id === values.departemen_id);
    const selectedSubDept = subDepartemenList.find(
      (s) => s.id === values.sub_departemen_id
    );

    onSubmit({
      ...values,
      departemen_nama: selectedDept ? selectedDept.departemen : '',
      sub_departemen_nama: selectedSubDept ? selectedSubDept.sub_departemen : '',
    });
  };

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data))} className="space-y-4">
      {/* 1. Select Departemen dengan Search */}
      <Controller
        name="departemen_id"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Departemen"
            options={departemenOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="-- Pilih Departemen --"
            error={errors.departemen_id?.message}
          />
        )}
      />

      {/* 2. Select Sub Departemen dengan Search */}
      <Controller
        name="sub_departemen_id"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Sub Departemen"
            options={subDepartemenOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="-- Pilih Sub Departemen --"
            error={errors.sub_departemen_id?.message}
          />
        )}
      />

      {/* 3. ID POS */}
      <div>
        <FormInput
          label="ID POS"
          {...register('id')}
          disabled={isEditMode}
          placeholder="Contoh: POS01"
          error={errors.id?.message}
        />
      </div>

      {/* 4. Nama POS */}
      <FormInput
        label="POS"
        {...register('pos')}
        placeholder="Contoh: Programmer Officer"
        error={errors.pos?.message}
      />

      {/* 5. Status (Hanya Tampil Saat Edit Mode) */}
      {isEditMode && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.status.message}
            </p>
          )}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};