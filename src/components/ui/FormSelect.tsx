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
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={(val) => onValueChange?.(val ?? '')}
        disabled={disabled}
      >
        <SelectTrigger
          // PERBAIKAN: Memastikan 'w-full' dan 'h-8' diterapkan pada trigger
          className={`w-full h-8 text-xs ${
            error ? 'border-red-500 aria-invalid:border-red-500' : ''
          } ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};

FormSelect.displayName = 'FormSelect';