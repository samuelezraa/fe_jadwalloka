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
  existingEvents?: AnnualEvent[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AnnualEventForm: React.FC<AnnualEventFormProps> = ({
  initialData,
  existingEvents = [],
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    setError,
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

  const normalizeToIsoDate = (raw?: string): string => {
    if (!raw) return '';
    const clean = raw.trim().split('T')[0].split(' ')[0];
    const dmyMatch = clean.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (dmyMatch) {
      const [, dd, mm, yyyy] = dmyMatch;
      return `${yyyy}-${mm}-${dd}`;
    }
    return clean;
  };

  const parseDateRange = (rangeStr?: string) => {
    if (!rangeStr) return { startDate: '', endDate: '' };
    const parts = rangeStr.split(/\s*(?:~|\s-\s|s\/d)\s*/i).filter(Boolean);
    const startDate = parts[0] ? normalizeToIsoDate(parts[0]) : '';
    const endDate = parts[1] ? normalizeToIsoDate(parts[1]) : startDate;
    return { startDate, endDate };
  };

  const toComparableNum = (isoDate: string): number => {
    return Number(isoDate.replaceAll('-', ''));
  };

  const hasOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
    const normStartA = normalizeToIsoDate(startA);
    const normEndA = normalizeToIsoDate(endA || startA);
    const normStartB = normalizeToIsoDate(startB);
    const normEndB = normalizeToIsoDate(endB || startB);

    if (!normStartA || !normStartB) return false;

    const s1 = toComparableNum(normStartA);
    const e1 = toComparableNum(normEndA);
    const s2 = toComparableNum(normStartB);
    const e2 = toComparableNum(normEndB);

    return s1 <= e2 && e1 >= s2;
  };

  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || rawActive === 1 || rawActive === 'Aktif'
      );
      const rawHoliday = (initialData as any).is_national_holiday ?? true;

      const start = normalizeToIsoDate(
        initialData.start_date || (initialData as any).event_date || (initialData as any).tanggal || ''
      );
      const end = normalizeToIsoDate(initialData.end_date || '');

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
    const { startDate, endDate } = parseDateRange(values.date_range);

    const isDuplicate = existingEvents.some((ev) => {
      if (initialData?.id !== undefined && String(ev.id) === String(initialData.id)) {
        return false;
      }

      const evStart = normalizeToIsoDate(
        ev.start_date || (ev as any).event_date || (ev as any).tanggal || ''
      );
      const evEnd = normalizeToIsoDate(ev.end_date || evStart);

      return hasOverlap(startDate, endDate, evStart, evEnd);
    });

    if (isDuplicate) {
      setError('date_range', {
        type: 'manual',
        message: 'Tanggal event bentrok dengan event tahunan yang sudah ada.',
      });
      return;
    }

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
            const { startDate, endDate } = parseDateRange(field.value);
            return (
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(start, end) => {
                  const normStart = normalizeToIsoDate(start);
                  const normEnd = normalizeToIsoDate(end);
                  if (normStart && normEnd && normEnd !== normStart) {
                    field.onChange(`${normStart} - ${normEnd}`);
                  } else if (normStart) {
                    field.onChange(normStart);
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