import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateEventTahunanSchema,
  type UpdateEventTahunanFormValues,
} from '../schemas/event-tahunan.schema';
import type { EventTahunan } from '../types/event-tahunan.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { DatePicker } from '../../../../components/ui/DatePicker';
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
    control,
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

      <Controller
        name="tanggal"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Tanggal"
            value={field.value}
            onChange={field.onChange}
            error={errors.tanggal?.message}
            placeholder="DD/MM/YYYY"
          />
        )}
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
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              value={field.value}
              onValueChange={field.onChange}
              error={errors.status?.message}
              options={[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Non Aktif', value: 'Non Aktif' },
              ]}
            />
          )}
        />
      )}

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};