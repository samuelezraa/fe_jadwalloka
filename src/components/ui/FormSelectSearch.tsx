import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './command';

interface Option {
  id: string;
  label: string;
}

interface FormSelectSearchProps {
  label?: string;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const FormSelectSearch: React.FC<FormSelectSearchProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = '-- Pilih --',
  error,
  disabled = false,
  className = '',
}) => {
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Popover murni mengontrol kondisinya sendiri */}
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          className={`w-full h-8 px-3 py-2 border rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer transition-colors shadow-sm outline-none focus-visible:border-gray-400 focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800/80 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-red-500 aria-invalid:border-red-500'
              : 'border-gray-300 dark:border-gray-700'
          } ${className}`}
        >
          <span
            className={`block truncate ${
              selectedOption
                ? 'text-gray-800 dark:text-gray-100'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1.5" />
        </PopoverTrigger>

        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] min-w-full p-0 z-[9999]" 
          align="start"
          sideOffset={4}
        >
          <Command className="w-full">
            <CommandInput placeholder="Cari data disini..." />
            <CommandList className="w-full">
              <CommandEmpty>Tidak ada data ditemukan.</CommandEmpty>
              <CommandGroup className="w-full">
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.label}
                    onSelect={() => {
                      onChange?.(opt.id);
                    }}
                    className={`w-full ${
                      value === opt.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold'
                        : ''
                    }`}
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};

FormSelectSearch.displayName = 'FormSelectSearch';