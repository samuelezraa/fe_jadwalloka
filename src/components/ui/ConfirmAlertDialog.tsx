import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Power, KeyRound, X } from 'lucide-react';
import { PrimaryButton, CancelButton } from './ActionButtons';

interface ConfirmAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  showIcon?: boolean;
  confirmText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmAlertDialog: React.FC<ConfirmAlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  showIcon = true,
  confirmText = 'Ya',
  variant = 'warning',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'primary':
        return <KeyRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Power className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getBgColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 dark:bg-red-950/50';
      case 'primary':
        return 'bg-emerald-50 dark:bg-emerald-950/50';
      default:
        return 'bg-amber-50 dark:bg-amber-950/50';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5 relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          {showIcon && (
            <div className={`p-2.5 rounded-2xl ${getBgColor()}`}>
              {getIcon()}
            </div>
          )}
          
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* 🌟 Menggunakan w-24 justify-center agar ukuran horizontal kedua tombol sama persis */}
        <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <CancelButton onClick={onClose} className="w-24 justify-center" />
          
          <PrimaryButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`w-24 justify-center ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading ? '...' : confirmText}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  );
};