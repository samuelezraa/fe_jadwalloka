import React, { useRef, useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface TableFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FilterField[];
  onReset: () => void;
  isFiltered: boolean;
}

export const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  isOpen,
  onClose,
  fields,
  onReset,
  isFiltered,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
        setOpenDropdownKey(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={popoverRef} className="space-y-4 max-h-[85vh] overflow-y-auto">
      {/* Header Popover */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
          Filter Data
        </span>
      </div>

      {/* Daftar Field Filter */}
      <div className="space-y-3 pb-2">
        {fields.map((field) => {
          const selectedOption = field.options.find((opt) => opt.value === field.value);
          const isDropdownOpen = openDropdownKey === field.key;
          const searchQuery = searchQueries[field.key] || '';

          const filteredOptions = field.options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div key={field.key} className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {field.label}
              </label>

              {/* Tombol Trigger Custom Select */}
              <div
                onClick={() => setOpenDropdownKey(isDropdownOpen ? null : field.key)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-between cursor-pointer focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
              >
                <span className={selectedOption ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-400'}>
                  {selectedOption ? selectedOption.label : 'Pilih...'}
                </span>
                {isDropdownOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>

              {/* Konten Dropdown Tampil Secara Inline di Dalam Popover */}
              {isDropdownOpen && (
                <div className="mt-1 bg-gray-50/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner space-y-1.5 p-2">
                  {/* Kolom Pencarian */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQueries({ ...searchQueries, [field.key]: e.target.value })
                      }
                      placeholder="Cari..."
                      className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  {/* List Opsi dengan Scrollbar Internal yang Aman */}
                  <div className="max-h-36 overflow-y-auto space-y-0.5 pt-0.5 pr-1">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            field.onChange(opt.value);
                            setOpenDropdownKey(null);
                            setSearchQueries({ ...searchQueries, [field.key]: '' });
                          }}
                          className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                            field.value === opt.value
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60'
                          }`}
                        >
                          {opt.label}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 text-center text-xs text-gray-400">
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

      {/* Tombol Reset di Bagian Bawah */}
      <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            onReset();
            setSearchQueries({});
            setOpenDropdownKey(null);
          }}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
