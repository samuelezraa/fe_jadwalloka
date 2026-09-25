import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

interface ColumnVisibilityProps<TData> {
  table?: Table<TData>;
}

export function ColumnVisibility<TData>({ table }: ColumnVisibilityProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Proteksi jika objek table belum siap
  if (!table) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span>Kolom</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-64 overflow-y-auto space-y-1 py-1">
            {table.getAllLeafColumns().map((column) => {
              if (column.id === 'action') return null;

              return (
                <label
                  key={column.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                  <span className="capitalize">
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id === 'number'
                      ? '#'
                      : column.id}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}