import React from 'react';
import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ColumnVisibilityDropdown } from './ui/ActionButtons'; // Sesuaikan jalur impor jika berbeda

interface DataPaginationProps<T> {
  table: Table<T>;
}

export function DataPagination<T>({ table }: DataPaginationProps<T>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between py-2 px-1 text-xs text-gray-600 dark:text-gray-300">
      
      {/* --- BAGIAN KIRI --- */}
      <div className="flex items-center gap-3">
        {/* 1. Tombol Kolom Reusable (Tampil di Desktop) */}
        <div className="hidden md:block">
          <ColumnVisibilityDropdown table={table} />
        </div>

        {/* 2. Versi Desktop: Dropdown "Rows per page" / "Tampilkan" */}
        <div className="hidden md:flex items-center gap-2">
          <span>Tampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs focus:outline-none"
          >
            {[25, 50, 75, 100, 125].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>dari {totalRows} data</span>
        </div>

        {/* 3. Versi Mobile: Hanya label "Halaman" tebal di kiri */}
        <div className="md:hidden font-bold text-gray-900 dark:text-gray-100">
          Halaman
        </div>
      </div>

      {/* --- BAGIAN KANAN --- */}
      <div className="flex items-center gap-3">
        
        {/* 1. Versi Mobile: Teks "1 - 10 dari 50" */}
        <span className="md:hidden text-[11px] font-medium text-gray-500">
          {from} - {to} dari {totalRows}
        </span>

        {/* 2. Versi Desktop: Teks "Halaman 1 dari 5" */}
        <span className="hidden md:inline text-xs">
          Halaman {pageIndex + 1} dari {table.getPageCount() || 1}
        </span>

        {/* 3. Tombol Navigasi */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}