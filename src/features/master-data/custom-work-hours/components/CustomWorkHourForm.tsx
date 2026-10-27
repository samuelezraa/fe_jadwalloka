import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customWorkHourSchema, type CustomWorkHourFormValues } from '../schemas/custom-work-hour.schema';
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

// Reusable UI Components
import { FormInput } from '@/components/ui/FormInput';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';
import { FormTimeInput } from '@/components/ui/FormTimeInput';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';

interface CustomWorkHourFormProps {
  initialData?: CustomWorkHour | null;
  onSubmit: (data: CustomWorkHourFormValues) => void | Promise<any>;
  onCancel: () => void;
}

export const CustomWorkHourForm: React.FC<CustomWorkHourFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!initialData;
  const [schemeOptions, setSchemeOptions] = useState<{ id: string; label: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomWorkHourFormValues>({
    resolver: zodResolver(customWorkHourSchema) as any,
    defaultValues: {
      start_date: '',
      end_date: '',
      work_scheme: '',
      clock_in: '12:00:00',
      tolerance: '00:05:00',
      description: '',
      is_active: true,
    },
  });

  const startDateValue = watch('start_date');
  const endDateValue = watch('end_date');

  // Load opsi Skema Hari Kerja dari Backend Master Data
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get('/work-schedule-schemes');
        const list = response.data.data || response.data || [];
        const options = list.map((item: any) => ({
          id: item.name || item.code || String(item.id),
          label: item.name ? `${item.name} (${item.code || ''})`.trim() : item.code,
        }));
        setSchemeOptions(options);
      } catch (error) {
        console.error('Gagal memuat skema hari kerja:', error);
        toast.error('Gagal memuat daftar skema hari kerja');
      }
    };

    fetchSchemes();
  }, []);

  // Sync data saat initialData atau schemeOptions berubah
  useEffect(() => {
    if (initialData) {
      const rawActive = (initialData as any).is_active ?? (initialData as any).status;
      const isActiveBoolean = Boolean(
        rawActive === true || 
        (rawActive as unknown as number) === 1 || 
        rawActive === 'Aktif' || 
        rawActive === 'true'
      );

      // Cari ID opsi yang cocok walaupun nilainya berupa "6-1" atau "Skema 6-1"
      let matchedScheme = initialData.work_scheme || '';
      if (schemeOptions.length > 0 && matchedScheme) {
        const found = schemeOptions.find(
          (opt) =>
            opt.id === matchedScheme ||
            opt.label === matchedScheme ||
            opt.label.toLowerCase().includes(matchedScheme.toLowerCase()) ||
            matchedScheme.toLowerCase().includes(opt.id.toLowerCase())
        );
        if (found) {
          matchedScheme = found.id;
        }
      }

      reset({
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        work_scheme: matchedScheme,
        clock_in: initialData.clock_in || '12:00:00',
        tolerance: initialData.tolerance || '00:05:00',
        description: initialData.description || '',
        is_active: isActiveBoolean,
      });
    } else {
      reset({
        start_date: '',
        end_date: '',
        work_scheme: '',
        clock_in: '12:00:00',
        tolerance: '00:05:00',
        description: '',
        is_active: true,
      });
    }
  }, [initialData, schemeOptions, reset]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
      {/* 1. Field Periode (Datepicker Range) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Periode Range Tanggal
        </label>
        <DateRangePicker
          startDate={startDateValue}
          endDate={endDateValue}
          onChange={(start: string, end: string) => {
            setValue('start_date', start || '', { shouldValidate: true });
            setValue('end_date', end || '', { shouldValidate: true });
          }}
        />
        {(errors.start_date || errors.end_date) && (
          <p className="text-[10px] text-red-500 mt-1">
            {errors.start_date?.message || errors.end_date?.message}
          </p>
        )}
      </div>

      {/* 2. Field Skema Hari Kerja (Dropdown Select Search) */}
      <Controller
        name="work_scheme"
        control={control}
        render={({ field }) => (
          <FormSelectSearch
            label="Skema Hari Kerja"
            value={field.value}
            onChange={field.onChange}
            placeholder="Pilih Skema Hari Kerja"
            options={schemeOptions}
            error={errors.work_scheme?.message}
          />
        )}
      />

      {/* 3. Field Jam Masuk & Toleransi Keterlambatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Jam Masuk
          </label>
          <Controller
            name="clock_in"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.clock_in && (
            <p className="text-[10px] text-red-500 mt-1">{errors.clock_in.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Toleransi Keterlambatan
          </label>
          <Controller
            name="tolerance"
            control={control}
            render={({ field }) => (
              <div className="w-full border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                <FormTimeInput value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.tolerance && (
            <p className="text-[10px] text-red-500 mt-1">{errors.tolerance.message}</p>
          )}
        </div>
      </div>

      {/* 4. Field Keterangan */}
      <FormInput
        label="Keterangan"
        {...register('description')}
        placeholder="Contoh: Peak Season"
        error={errors.description?.message}
      />

      {/* 5. Status (Hanya saat Edit) */}
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
              error={errors.is_active?.message}
            />
          )}
        />
      )}

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  );
};

export default CustomWorkHourForm;