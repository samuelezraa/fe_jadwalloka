import React, { useState, useEffect } from 'react';
import { CustomDialog } from '../../../../components/ui/CustomDialog';
import { FormInput } from '../../../../components/ui/FormInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';

interface JamMingguanData {
  senin: string;
  selasa: string;
  rabu: string;
  kamis: string;
  jumat: string;
  sabtu: string;
  minggu: string;
}

interface SettingJamMingguanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (formData: JamMingguanData) => void;
}

const DEFAULT_JAM: JamMingguanData = {
  senin: '00:00:00',
  selasa: '00:00:00',
  rabu: '00:00:00',
  kamis: '00:00:00',
  jumat: '00:00:00',
  sabtu: '00:00:00',
  minggu: '00:00:00',
};

const HARI_LIST: { key: keyof JamMingguanData; label: string }[] = [
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
  { key: 'sabtu', label: 'Sabtu' },
  { key: 'minggu', label: 'Minggu' },
];

export const SettingJamMingguanDialog: React.FC<SettingJamMingguanDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<JamMingguanData>(DEFAULT_JAM);

  useEffect(() => {
    if (isOpen) {
      setFormData(DEFAULT_JAM);
    }
  }, [isOpen]);

  // Fungsi formatter & validasi input jam otomatis
  const handleTimeInput = (key: keyof JamMingguanData, rawValue: string) => {
    // 1. Hapus semua karakter yang bukan angka
    const digitsOnly = rawValue.replace(/\D/g, '');

    // 2. Batasi maksimal 6 digit angka (HHMMSS)
    const truncated = digitsOnly.slice(0, 6);

    // 3. Format otomatis menjadi HH:MM:SS
    let formatted = truncated;
    if (truncated.length >= 5) {
      formatted = `${truncated.slice(0, 2)}:${truncated.slice(2, 4)}:${truncated.slice(4, 6)}`;
    } else if (truncated.length >= 3) {
      formatted = `${truncated.slice(0, 2)}:${truncated.slice(2, 4)}`;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: formatted,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    } else {
      console.log('Jam Mingguan Disimpan:', formData);
    }
    onClose();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Set Jam Mingguan"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* List Input Jam dari Senin - Minggu */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1 pr-2">
          {HARI_LIST.map(({ key, label }) => (
            <div
              key={key}
              className="grid grid-cols-12 items-center gap-4"
            >
              <label className="col-span-4 text-xs font-bold text-gray-800 dark:text-gray-200">
                {label}
              </label>
              <div className="col-span-8">
                <FormInput
                  type="text"
                  maxLength={8} // 🌟 Membatasi panjang maksimal 8 karakter (HH:MM:SS)
                  value={formData[key]}
                  onChange={(e) => handleTimeInput(key, e.target.value)}
                  placeholder="00:00:00"
                  className="font-mono text-center text-xs tracking-wider"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <CancelButton onClick={onClose} />
          <SaveButton />
        </div>
      </form>
    </CustomDialog>
  );
};