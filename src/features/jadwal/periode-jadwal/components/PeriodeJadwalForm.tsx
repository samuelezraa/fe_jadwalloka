import React, { useState } from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';
import type { PeriodeJadwalFormData } from '../types/periodeJadwal.type';

interface PeriodeJadwalFormProps {
  onSubmit: (data: PeriodeJadwalFormData) => void;
  onCancel: () => void;
}

export const PeriodeJadwalForm: React.FC<PeriodeJadwalFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PeriodeJadwalFormData>({
    periodeJadwal: '',
    tanggalAwal: '',
    tanggalAkhir: '',
    toleransiKeterlambatan: '00:15',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setFormData((prev) => ({
      ...prev,
      tanggalAwal: start,
      tanggalAkhir: end,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Periode Jadwal"
        type="text"
        placeholder="Contoh: November - Desember 2022"
        value={formData.periodeJadwal}
        onChange={(e) => setFormData({ ...formData, periodeJadwal: e.target.value })}
        required
      />

      {/* DateRangePicker untuk Tanggal Awal & Tanggal Akhir Absensi */}
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
          Rentang Tanggal Absensi <span className="text-red-500">*</span>
        </label>
        <DateRangePicker
          startDate={formData.tanggalAwal}
          endDate={formData.tanggalAkhir}
          onChange={handleDateRangeChange}
          placeholder="Pilih Tanggal Awal ~ Tanggal Akhir"
        />
      </div>

      <FormInput
        label="Toleransi Keterlambatan"
        type="time"
        value={formData.toleransiKeterlambatan}
        onChange={(e) => setFormData({ ...formData, toleransiKeterlambatan: e.target.value })}
        required
      />

      <div className="flex justify-end gap-2 pt-4">
        <CancelButton onClick={onCancel} />
        <SaveButton type="submit" />
      </div>
    </form>
  );
};