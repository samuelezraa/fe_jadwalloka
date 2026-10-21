import React from 'react';

interface WorkStatusToggleButtonProps {
  status: 'Berangkat' | 'Libur';
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export const WorkStatusToggleButton: React.FC<WorkStatusToggleButtonProps> = ({
  status,
  onToggle,
  disabled = false,
  className = '',
}) => {
  const isBerangkat = status === 'Berangkat';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`w-28 sm:w-28 md:w-32 py-1.5 px-3 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 text-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
        isBerangkat
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500'
          : 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500'
      } ${className}`}
    >
      {status}
    </button>
  );
};