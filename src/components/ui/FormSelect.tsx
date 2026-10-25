import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select';

interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options?: FormSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  placeholder = 'Pilih opsi...',
  options = [],
  value,
  onValueChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div 
      className="w-full space-y-0.5" 
      onMouseDown={(e) => e.stopPropagation()} 
      onPointerDown={(e) => e.stopPropagation()}
    >
      {label && (
        <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={(val) => onValueChange?.(val ?? '')}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full h-8 text-[11px] px-2.5 ${
            error ? 'border-red-500 aria-invalid:border-red-500' : ''
          } ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs py-1">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
};

FormSelect.displayName = 'FormSelect';