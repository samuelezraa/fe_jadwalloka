import React, { useState } from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';
import type { PeriodeJadwalFormData } from '../types/periodeJadwal.type';

interface PeriodeJadwalFormProps {
  onSubmit: (data: PeriodeJadwalFormData) => void;
  onCancel: () => void;
}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormInput
          label="Tanggal Awal Absensi"
          type="date"
          value={formData.tanggalAwal}
          onChange={(e) => setFormData({ ...formData, tanggalAwal: e.target.value })}
          required
        />
        <FormInput
          label="Tanggal Akhir Absensi"
          type="date"
          value={formData.tanggalAkhir}
          onChange={(e) => setFormData({ ...formData, tanggalAkhir: e.target.value })}
          required
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