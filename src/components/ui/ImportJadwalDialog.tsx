import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { CancelButton } from './ActionButtons';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-auto border border-transparent dark:border-gray-800 transition-colors duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Import Jadwal (Periode)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Kotak Upload Dashed */}
        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center space-y-3 bg-gray-50/50 dark:bg-gray-800/40">
            <div className="w-12 h-12 mx-auto bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {selectedFile ? selectedFile.name : 'Pilih file Excel / CSV'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Format yang didukung: .xlsx, .xls, .csv
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold transition-colors border border-emerald-200 dark:border-emerald-800 shadow-sm"
            >
              Cari File
            </button>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <CancelButton onClick={onClose} />
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="px-4 py-2 bg-emerald-600 dark:bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50 shadow-sm"
          >
            Upload & Import
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};