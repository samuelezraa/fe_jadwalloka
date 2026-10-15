import React, { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="w-full space-y-0.5" onClick={(e) => e.stopPropagation()}>
      {label && (
        <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          className={`w-full h-8 px-2.5 py-1 border rounded-lg text-[11px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer transition-colors shadow-xs outline-none focus-visible:border-gray-400 focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800/80 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-red-500 aria-invalid:border-red-500'
              : 'border-gray-300 dark:border-gray-700'
          } ${className}`}
        >
          <span
            className={`block truncate ${
              selectedOption
                ? 'text-gray-800 dark:text-gray-100 font-medium'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1.5" />
        </PopoverTrigger>

        <PopoverContent 
          className="w-[var(--anchor-width)] min-w-[var(--anchor-width)] p-0 z-[9999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg" 
          align="start"
          sideOffset={4}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Command className="w-full">
              <CommandInput placeholder="Cari data disini..." className="text-xs h-8" />
              <CommandList className="w-full max-h-48 overflow-y-auto">
                <CommandEmpty className="p-2.5 text-center text-xs text-gray-400">
                  Tidak ada data ditemukan.
                </CommandEmpty>
                <CommandGroup className="w-full p-1">
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.id}
                      value={opt.label}
                      onMouseDown={(e) => e.stopPropagation()}
                      onSelect={() => {
                        onChange?.(opt.id);
                        setOpen(false);
                      }}
                      className={`w-full text-xs px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        value === opt.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
};

FormSelectSearch.displayName = 'FormSelectSearch';