import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, FileSpreadsheet, Download, AlertCircle, Loader2 } from 'lucide-react';

interface ImportScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>; // 💡 Dibuat Async agar bisa menunggu status sukses/gagal
  onDownloadSample?: () => void;
}

export const ImportScheduleDialog: React.FC<ImportScheduleDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  onDownloadSample,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedFile(null);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await onImport(selectedFile);
      setSelectedFile(null);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      // Tangkap pesan error dari response backend
      const serverMsg = err?.response?.data?.message || err?.message || 'Gagal memproses file. Pastikan format data dan NIP/ID Karyawan sesuai.';
      setErrorMessage(serverMsg);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto border border-gray-100 dark:border-gray-800 flex flex-col transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Import Data Jam Kerja
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ⚠️ ALERT ERROR SAFETY SYSTEM */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                <p className="font-bold">Gagal Mengimpor Data!</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Pilih File Spreadsheet (.xlsx / .csv)
            </label>
            
            <div
              onClick={() => !isLoading && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 bg-gray-50/30 dark:bg-gray-800/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400 mb-2">
                <FileSpreadsheet className="w-8 h-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[240px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB - Klik untuk mengganti
                  </p>
                </div>
              ) : (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Klik atau seret file ke sini
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 gap-2">
            <button
              type="button"
              onClick={onDownloadSample}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Download Sample
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-colors ${
                  selectedFile && !isLoading
                    ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
                    : 'bg-emerald-300 dark:bg-emerald-800/60 cursor-not-allowed opacity-70'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mengimpor...
                  </>
                ) : (
                  'Import Data'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};