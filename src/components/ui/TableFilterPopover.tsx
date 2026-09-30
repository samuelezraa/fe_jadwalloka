import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  options?: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
  render?: () => React.ReactNode;
}

interface TableFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  onReset: () => void;
  isFiltered: boolean;
}

export const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  fields,
  onReset,
}) => {
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  return (
    // Berikan z-index yang aman (misal z-30) agar berada di bawah sidebar mobile/desktop
  <div className="w-full p-1 space-y-3 overflow-visible z-30 relative">
      {/* Header Popover */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
          Filter Data
        </span>
      </div>

      {/* Daftar Field Filter */}
      <div className="space-y-3 pb-1">
        {fields.map((field) => {
          if (field.render) {
            return (
              <div key={field.key} className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {field.label}
                </label>
                {field.render()}
              </div>
            );
          }

          const options = field.options || [];
          const selectedOption = options.find((opt) => opt.value === field.value);
          const isDropdownOpen = openDropdownKey === field.key;
          const searchQuery = searchQueries[field.key] || '';

          const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div key={field.key} className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {field.label}
              </label>

              {/* Trigger Select */}
              <div
                onClick={() => setOpenDropdownKey(isDropdownOpen ? null : field.key)}
                className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer focus:outline-none transition-colors"
              >
                <span className={selectedOption ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-400'}>
                  {selectedOption ? selectedOption.label : 'Semua...'}
                </span>
                {isDropdownOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md space-y-1 p-1.5">
                  {options.length > 5 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                      <Search className="w-3 h-3 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQueries({ ...searchQueries, [field.key]: e.target.value })
                        }
                        placeholder="Cari..."
                        className="w-full bg-transparent text-[11px] text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                        autoFocus
                      />
                    </div>
                  )}

                  <div className="max-h-32 overflow-y-auto space-y-0.5 pt-0.5">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            if (field.onChange) field.onChange(opt.value);
                            setOpenDropdownKey(null);
                            setSearchQueries({ ...searchQueries, [field.key]: '' });
                          }}
                          className={`px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                            field.value === opt.value
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                          }`}
                        >
                          {opt.label}
                        </div>
                      ))
                    ) : (
                      <div className="py-1.5 text-center text-xs text-gray-400">
                        Tidak ada data.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tombol Reset */}
      <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => {
            onReset();
            setSearchQueries({});
            setOpenDropdownKey(null);
          }}
          className="text-xs font-semibold text-red-500 hover:underline px-2 py-0.5"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};