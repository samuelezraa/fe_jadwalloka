import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateEventTahunanSchema,
  type UpdateEventTahunanFormValues,
} from '../schemas/event-tahunan.schema';
import type { EventTahunan } from '../types/event-tahunan.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface EventTahunanFormProps {
  initialData?: EventTahunan | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EventTahunanForm: React.FC<EventTahunanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEventTahunanFormValues>({
    resolver: zodResolver(updateEventTahunanSchema),
    defaultValues: {
      id: '',
      tanggal: '',
      event: '',
      type: 'NATIONAL/COMPANY',
      keterangan: '',
      status: 'Aktif',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        tanggal: initialData.tanggal,
        event: initialData.event,
        type: initialData.type,
        keterangan: initialData.keterangan,
        status: initialData.status,
      });
    } else {
      reset({
        id: '',
        tanggal: '',
        event: '',
        type: 'NATIONAL/COMPANY',
        keterangan: '',
        status: 'Aktif',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="ID Event"
        {...register('id')}
        disabled={isEditMode}
        placeholder="Contoh: 220001"
        error={errors.id?.message}
      />

      {/* Tanggal menggunakan FormInput dengan date picker bawaan */}
      <FormInput
        label="Tanggal"
        type="date"
        {...register('tanggal')}
        error={errors.tanggal?.message}
      />

      <FormInput
        label="Nama Event"
        {...register('event')}
        placeholder="Contoh: Maulid Nabi Muhammad SAW"
        error={errors.event?.message}
      />

      <FormInput
        label="Type"
        {...register('type')}
        placeholder="Contoh: NATIONAL/COMPANY"
        error={errors.type?.message}
      />

      <FormInput
        label="Keterangan"
        {...register('keterangan')}
        placeholder="Contoh: Hari Maulid Nabi"
        error={errors.keterangan?.message}
      />

      {isEditMode && (
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
          >
            <option value="Aktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">Aktif</option>
            <option value="Non Aktif" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">Non Aktif</option>
          </select>
          {errors.status && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.status.message}</p>}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};