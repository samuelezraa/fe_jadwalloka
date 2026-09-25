import React, { useState, useEffect } from 'react';
import { X, Settings, Info } from 'lucide-react';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Setting Jam Mingguan (Global)
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Terapkan pengaturan default ke seluruh karyawan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body dengan Scroll Internal */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-4 space-y-3.5 overflow-y-auto max-h-[calc(90vh-120px)]">
            
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
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  ID Periode
                </label>
                <input
                  type="text"
                  name="id_periode"
                  value={formData.id_periode}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Skema Kerja
                </label>
                <input
                  type="text"
                  name="skema_kerja"
                  value={formData.skema_kerja}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left transition-colors"
                  required
                />
              </div>
            </div>

            {/* Baris 2: Grid Angka (Total Hari, Masuk, Libur, PH, Cuti) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Total Hari
                </label>
                <input
                  type="number"
                  name="total_hari"
                  value={formData.total_hari}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-medium transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Masuk
                </label>
                <input
                  type="number"
                  name="masuk"
                  value={formData.masuk}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-medium transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Libur
                </label>
                <input
                  type="number"
                  name="libur"
                  value={formData.libur}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-medium transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  PH
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-medium transition-colors"
                  required
                />
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                  Cuti
                </label>
                <input
                  type="number"
                  name="cuti"
                  value={formData.cuti}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left font-medium transition-colors"
                  required
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <CancelButton onClick={onClose} />
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
};