import React from 'react';
import { createPortal } from 'react-dom';
import { JamKerjaForm } from './JamKerjaForm';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';
import type { JamKerjaFormValues } from '../schemas/jam-kerja.schema';
import { X } from 'lucide-react';

interface JamKerjaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JamKerjaKaryawan | null;
  onSubmit: (data: JamKerjaFormValues) => void;
}

export const JamKerjaDialog: React.FC<JamKerjaDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-auto border border-transparent dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Jam Kerja Karyawan</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <JamKerjaForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};