import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileSpreadsheet } from 'lucide-react';

interface ImportJadwalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportJadwalDialog: React.FC<ImportJadwalDialogProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onImport(selectedFile);
      onClose();
      setSelectedFile(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 my-auto border border-transparent dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Import Jadwal (Periode)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-gray-50 dark:bg-gray-800/40">
            <FileSpreadsheet className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {selectedFile ? selectedFile.name : 'Pilih file Excel / CSV'}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Format yang didukung: .xlsx, .xls, .csv
            </p>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-import-input"
            />
            <label
              htmlFor="file-import-input"
              className="mt-4 inline-block px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              Cari File
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-4 py-2 bg-emerald-600 dark:bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              Upload & Import
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};