import React, { useState, useRef } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { CustomDialog } from './CustomDialog';
import { CancelButton, PrimaryButton, OutlineActionButton } from './ActionButtons';

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

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Jadwal (Periode)"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Area Drop/Pilih File Excel & CSV */}
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center space-y-3 bg-gray-50/50 dark:bg-gray-800/40">
          <div className="w-12 h-12 mx-auto bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-xs mx-auto">
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

          {/* Tombol Cari File (Reusable) */}
          <OutlineActionButton onClick={() => fileInputRef.current?.click()}>
            Cari File
          </OutlineActionButton>
        </div>

        {/* Footer Aksi Modal */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Tombol Batal Merah Solid (Reusable) */}
          <CancelButton onClick={handleClose} />
          
          {/* Tombol Utama Hijau Solid (Reusable) */}
          <PrimaryButton
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload & Import
          </PrimaryButton>
        </div>
      </div>
    </CustomDialog>
  );
};