import React from 'react';
import { createPortal } from 'react-dom';
import { FiveTwoWorkHourForm } from './FiveTwoWorkHourForm';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';
import { X } from 'lucide-react';

interface FiveTwoWorkHourDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FiveTwoWorkHourEmployee | null;
  onSubmit: (data: FiveTwoWorkHourFormValues) => void;
}

export const FiveTwoWorkHourDialog: React.FC<FiveTwoWorkHourDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Diperlebar ke max-w-2xl / sm:max-w-3xl agar input jam kerja di desktop tidak terpotong */}
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Edit Jam Kerja Karyawan
            </h3>
            {initialData?.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {initialData.name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal dengan Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <FiveTwoWorkHourForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};