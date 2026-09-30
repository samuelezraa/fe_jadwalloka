import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { CustomDialog } from '../../../../components/ui/CustomDialog';
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface SettingJamMingguanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (formData: {
    id_periode: string;
    skema_kerja: string;
    total_hari: number;
    masuk: number;
    libur: number;
    ph: number;
    cuti: number;
  }) => void;
}

export const SettingJamMingguanDialog: React.FC<SettingJamMingguanDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    id_periode: 'PER01',
    skema_kerja: '5-2',
    total_hari: 22,
    masuk: 20,
    libur: 8,
    ph: 2,
    cuti: 2,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id_periode: 'PER01',
        skema_kerja: '5-2',
        total_hari: 22,
        masuk: 20,
        libur: 8,
        ph: 2,
        cuti: 2,
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_periode' || name === 'skema_kerja' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      console.log('Global Setting Disimpan:', formData);
      alert('Pengaturan jadwal global untuk semua karyawan berhasil disimpan.');
    }
    onClose();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Setting Jam Mingguan (Global)"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Box Informasi */}
        <div className="flex gap-2.5 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-blue-800 dark:text-blue-300 leading-snug">
            <span className="font-semibold block mb-0.5">Informasi Sistem</span>
            Nilai yang diatur di sini akan memperbarui parameter jadwal secara massal untuk <strong>semua karyawan</strong>.
          </div>
        </div>

        {/* Baris 1: ID Periode & Skema Kerja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="ID Periode"
            name="id_periode"
            value={formData.id_periode}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Skema Kerja"
            name="skema_kerja"
            value={formData.skema_kerja}
            onChange={handleChange}
            required
          />
        </div>

        {/* Baris 2: Grid Angka (Total Hari, Masuk, Libur, PH, Cuti) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <FormInput
            label="Total Hari"
            type="number"
            name="total_hari"
            value={formData.total_hari}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Masuk"
            type="number"
            name="masuk"
            value={formData.masuk}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Libur"
            type="number"
            name="libur"
            value={formData.libur}
            onChange={handleChange}
            required
          />
          <FormInput
            label="PH"
            type="number"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Cuti"
            type="number"
            name="cuti"
            value={formData.cuti}
            onChange={handleChange}
            required
          />
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <CancelButton onClick={onClose} />
          <SaveButton />
        </div>
      </form>
    </CustomDialog>
  );
};