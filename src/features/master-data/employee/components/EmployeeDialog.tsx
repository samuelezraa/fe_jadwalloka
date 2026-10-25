import React, { useState } from 'react';
import { EmployeeForm } from './EmployeeForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { PrimaryButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FileSpreadsheet, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Employee } from '../types/employee.type';
import type { EmployeeFormValues } from '../schemas/employee.schema';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormValues) => void;
}

export const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const isEditMode = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Data Karyawan' : 'Tambah Data Karyawan Baru'}
      maxWidth="2xl"
    >
      <EmployeeForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

interface ImportEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  onDownloadSample?: () => void;
}

export const ImportEmployeeDialog: React.FC<ImportEmployeeDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  onDownloadSample,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    onImport(selectedFile);
    toast.success('Data karyawan berhasil diimport!');
    setSelectedFile(null);
    onClose();
  };

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Import Data Karyawan"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Pilih File Spreadsheet (.xlsx / .csv)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 rounded-2xl p-6 text-center bg-gray-50/50 dark:bg-gray-800/40 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileSpreadsheet className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              {selectedFile ? (
                <p className="text-xs font-bold text-emerald-600 truncate max-w-[240px]">
                  {selectedFile.name}
                </p>
              ) : (
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Klik atau seret file ke sini
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample</span>
          </button>

          <div className="flex items-center gap-2">
            <CancelButton onClick={onClose}>Batal</CancelButton>
            <PrimaryButton type="submit" disabled={!selectedFile}>
              Import Data
            </PrimaryButton>
          </div>
        </div>
      </form>
    </AppDialog>
  );
};