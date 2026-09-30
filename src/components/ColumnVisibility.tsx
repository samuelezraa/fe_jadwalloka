import type { Table } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';

interface ColumnVisibilityProps<TData> {
  table?: Table<TData>;
}

export function ColumnVisibility<TData>({ table }: ColumnVisibilityProps<TData>) {
  if (!table) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <span>Kolom</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-60 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="max-h-64 overflow-y-auto space-y-0.5 py-1">
          {table.getAllLeafColumns().map((column) => {
            if (column.id === 'action') return null;

            return (
              <label
                key={column.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                />
                <span className="capitalize truncate">
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
      </PopoverContent>
    </Popover>
  );
}