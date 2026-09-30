import React from 'react';
import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ColumnVisibilityDropdown, RowsPerPageSelector } from './ui/ActionButtons';

interface DataPaginationProps<T> {
  table: Table<T>;
}

export function DataPagination<T>({ table }: DataPaginationProps<T>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = table.getPageCount() || 1;

  return (
    <div className="flex items-center justify-between py-2 px-1 text-xs text-gray-600 dark:text-gray-300">
      
      {/* --- BAGIAN KIRI --- */}
      <div className="flex items-center gap-4">
        {/* Tombol Kolom (Hanya tampil di Desktop, disembunyikan di Mobile) */}
        <div className="hidden md:block">
          <ColumnVisibilityDropdown table={table} />
        </div>

        {/* Rows per page Selector Reusable (Disembunyikan di mobile) */}
        <div className="hidden md:block">
          <RowsPerPageSelector table={table} />
        </div>

        {/* Teks Halaman Aktif (Tampil di Mobile maupun Desktop dengan penyesuaian) */}
        <span className="font-bold md:font-medium text-gray-900 dark:text-gray-100">
          Page {pageIndex + 1} of {totalPages}
        </span>
      </div>

      {/* --- BAGIAN KANAN --- */}
      <div className="flex items-center gap-4">
        {/* Rentang Data */}
        <span className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
          {from} - {to} of {totalRows}
        </span>

        {/* Tombol Navigasi */}
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