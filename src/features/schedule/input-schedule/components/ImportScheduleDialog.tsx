import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FileSpreadsheet, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { inputScheduleService } from '../services/input-schedule.service';

interface ImportScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportScheduleDialog: React.FC<ImportScheduleDialogProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadSample = async () => {
    const toastId = toast.loading('Mengunduh sample template...');
    setIsDownloading(true);
    try {
      const blob = await inputScheduleService.downloadSample();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample-template-import-schedule.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Sample template berhasil diunduh!', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengunduh sample template.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 my-auto border border-transparent dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Import Data Jam Kerja
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
          <div>
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
              Pilih File Spreadsheet (.xlsx / .csv)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-gray-50 dark:bg-gray-800/40 relative">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-import-input"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {selectedFile ? selectedFile.name : 'Klik atau seret file ke sini'}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {selectedFile ? 'File siap diimport' : 'Format yang didukung: .xlsx, .xls, .csv'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-6">
            {/* Tombol Download Sample di Kiri */}
            <button
              type="button"
              onClick={handleDownloadSample}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download Sample
            </button>

            {/* Tombol Batal & Upload di Kanan */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!selectedFile}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-gray-900 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Import Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};