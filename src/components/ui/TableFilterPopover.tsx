import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';

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
  isOpen?: boolean;
  onClose: () => void;
  fields: FilterField[];
  onReset: () => void;
  isFiltered?: boolean;
}

export const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  fields,
  onReset,
  onClose,
}) => {
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  // Jika jumlah field lebih dari 2, aktifkan mode 2 grid
  const isMultiColumn = fields.length > 2;

  return (
    // Lebar otomatis: 1 grid = 300px, 2 grid = 480px
    <div className={`w-full ${isMultiColumn ? 'md:w-[480px]' : 'md:w-[300px]'} p-2 space-y-3 overflow-visible z-30 relative bg-white dark:bg-gray-900 rounded-xl transition-all duration-200`}>
      {/* Header Popover */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
        <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
          Filter Data
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Field Filter */}
      <div className={`grid grid-cols-1 ${isMultiColumn ? 'md:grid-cols-2' : ''} gap-3 pb-1`}>
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
            <div key={field.key} className="space-y-1 relative">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {field.label}
              </label>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownKey(isDropdownOpen ? null : field.key);
                }}
                className="w-full px-2.5 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer focus:outline-none transition-colors"
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

              {isDropdownOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 w-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-xl p-1.5"
                >
                  {options.length > 5 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md mb-1">
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

                  <div className="max-h-32 overflow-y-auto space-y-0.5">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
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

      {/* Tombol Aksi */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 gap-2">
        <button
          type="button"
          onClick={() => {
            onReset();
            setSearchQueries({});
            setOpenDropdownKey(null);
          }}
          className="text-xs font-semibold text-red-500 hover:underline px-2 py-1"
        >
          Reset
        </button>

      
      </div>
    </div>
  );
};