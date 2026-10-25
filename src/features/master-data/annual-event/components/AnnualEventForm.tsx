import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { AnnualEvent } from '../types/annual-event.type';

// Reusable UI Components
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { DateRangePicker } from '../../../../components/ui/DateRangePicker';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface AnnualEventFormProps {
  initialData?: AnnualEvent | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AnnualEventForm: React.FC<AnnualEventFormProps> = ({
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
  } = useForm<any>({
    defaultValues: {
      title: '',
      date_range: '',
      is_national_holiday: true,
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || rawActive === 1 || rawActive === 'Aktif'
      );
      const rawHoliday = (initialData as any).is_national_holiday ?? true;

      let start = initialData.start_date || (initialData as any).event_date || (initialData as any).tanggal || '';
      let end = initialData.end_date || '';

      if (start.includes('T')) start = start.split('T')[0];
      if (end && end.includes('T')) end = end.split('T')[0];

      const dateRangeStr = end && end !== start ? `${start} - ${end}` : start;

      reset({
        title: initialData.title || (initialData as any).event || '',
        date_range: dateRangeStr,
        is_national_holiday: Boolean(rawHoliday),
        description: initialData.description || (initialData as any).keterangan || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        title: '',
        date_range: '',
        is_national_holiday: true,
        description: '',
        is_active: true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (values: any) => {
    const dates = values.date_range ? values.date_range.split(' - ') : ['', ''];
    const startDate = dates[0] ? dates[0].trim() : '';
    const endDate = dates[1] ? dates[1].trim() : startDate;

    const payload = {
      title: values.title,
      start_date: startDate,
      end_date: endDate,
      is_national_holiday: values.is_national_holiday,
      description: values.description,
      is_active: values.is_active,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormInput
        label="Nama Event"
        {...register('title', { required: 'Nama Event wajib diisi' })}
        placeholder="Contoh: Libur Panjang Akhir Tahun"
        error={errors.title?.message as string}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Rentang Tanggal Event
        </label>
        <Controller
          name="date_range"
          control={control}
          rules={{ required: 'Rentang tanggal wajib diisi' }}
          render={({ field }) => {
            const dates = field.value ? field.value.split(' - ') : ['', ''];
            return (
              <DateRangePicker
                startDate={dates[0] || ''}
                endDate={dates[1] || dates[0] || ''}
                onChange={(start, end) => {
                  if (start && end && end !== start) {
                    field.onChange(`${start} - ${end}`);
                  } else if (start) {
                    field.onChange(start);
                  } else {
                    field.onChange('');
                  }
                }}
                placeholder="Pilih Tanggal Awal - Tanggal Akhir"
              />
            );
          }}
        />
        {errors.date_range?.message && (
          <p className="text-[11px] text-red-500 mt-1">{errors.date_range.message as string}</p>
        )}
      </div>

      {/* Kategori Libur */}
      <Controller
        name="is_national_holiday"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Kategori Libur"
            value={field.value ? 'true' : 'false'}
            onChange={(val) => field.onChange(val === 'true')}
            placeholder="Pilih Kategori"
            showSearch={false}
            options={[
              { id: 'true', label: 'Nasional' },
              { id: 'false', label: 'Perusahaan' },
            ]}
          />
        )}
      />

      <FormInput
        label="Keterangan (Opsional)"
        {...register('description')}
        placeholder="Contoh: Periode cuti bersama"
      />

      {isEditMode && (
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <FormSelectSearch
              label="Status"
              value={field.value ? 'true' : 'false'}
              onChange={(val) => field.onChange(val === 'true')}
              placeholder="Pilih Status"
              showSearch={false}
              options={[
                { id: 'true', label: 'Aktif' },
                { id: 'false', label: 'Non Aktif' },
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