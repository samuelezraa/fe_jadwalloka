import React, { useState } from 'react';
import { DataKaryawanForm } from './DataKaryawanForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { PrimaryButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DataKaryawan } from '../types/data-karyawan.type';
import type { DataKaryawanFormValues } from '../schemas/data-karyawan.schema';

// 1. Dialog Form Tambah / Edit Karyawan
interface DataKaryawanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DataKaryawan | null;
  onSubmit: (data: DataKaryawanFormValues) => void;
}

export const DataKaryawanDialog: React.FC<DataKaryawanDialogProps> = ({
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
      <DataKaryawanForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

// 2. Dialog Import Data Karyawan
interface ImportDataKaryawanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportDataKaryawanDialog: React.FC<ImportDataKaryawanDialogProps> = ({
  isOpen,
  onClose,
  onImport,
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

        <div className="flex items-center justify-end gap-2 pt-2">
          <CancelButton onClick={onClose}>Batal</CancelButton>
          <PrimaryButton type="submit" disabled={!selectedFile}>
            Import Data
          </PrimaryButton>
        </div>
      </form>
    </AppDialog>
  );
};