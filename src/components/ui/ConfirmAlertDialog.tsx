import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface ConfirmAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  showIcon?: boolean;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmAlertDialog: React.FC<ConfirmAlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Simpan',
  cancelText = 'Batal',
  showCancelButton = true,
  variant = 'warning',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Pemetaan warna tombol konfirmasi berdasarkan variant
    const confirmButtonBgClass =
      variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700'
        : variant === 'warning'
        ? 'bg-[#d97706] hover:bg-[#b45309]'
        : 'bg-[#059669] hover:bg-[#047857]';

    const iconType =
      variant === 'danger'
        ? 'error'
        : variant === 'warning'
        ? 'question'
        : 'success';

    const iconColor =
      variant === 'danger'
        ? '#dc2626'
        : variant === 'warning'
        ? '#d97706'
        : '#059669';

    MySwal.fire({
      title: `<span style="font-size: 18px; font-weight: 700; color: #1f2937;">${title}</span>`,
      html: description
        ? `<span style="font-size: 13px; color: #6b7280; line-height: 1.5;">${description}</span>`
        : '',
      icon: iconType,
      iconColor: iconColor,
      width: '420px',
      showCancelButton: showCancelButton && cancelText !== '',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true, // Tombol Batal di kiri, Simpan/OK di kanan
      buttonsStyling: false,
      allowOutsideClick: false,
      customClass: {
        container: 'z-[999999]',
        popup: 'rounded-2xl px-6 py-5 shadow-2xl border border-gray-100 dark:bg-gray-900',
        icon: 'my-2 scale-90', // Skala aman tanpa merusak SVG centang/tanda tanya
        confirmButton: `px-5 py-2 ${confirmButtonBgClass} text-white font-medium text-xs rounded-lg shadow-xs transition-colors min-w-[85px]`,
        cancelButton:
          'px-5 py-2 bg-[#6c757d] hover:bg-[#5a6268] text-white font-medium text-xs rounded-lg shadow-xs transition-colors min-w-[85px]',
        actions: 'flex items-center justify-center gap-3 pt-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.isDismissed) {
        onClose();
      }
    });
  }, [isOpen, title, description, confirmText, cancelText, showCancelButton, variant]);

  return null;
};