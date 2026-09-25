import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Departemen } from '../types/departemen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Building2, Plus } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';

interface DepartemenTableProps {
  data: Departemen[];
  onEdit: (item: Departemen) => void;
  onAdd: () => void;
}

export const DepartemenTable: React.FC<DepartemenTableProps> = ({
  data,
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo<ColumnDef<Departemen>[]>(
    () => [
      {
        id: 'number',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index +
              1 +
              info.table.getState().pagination.pageIndex *
                info.table.getState().pagination.pageSize}
          </span>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID Departemen',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'departemen',
        header: 'Departemen',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <EditActionButton onClick={() => onEdit(row.original)} />
          </div>
        ),
      },
    ],
    [onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="relative">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-16 md:mb-0 transition-colors duration-200">
        
        {/* 1. Header Toolbar Reusable (Hanya 1 buah di atas) */}
        <TableToolbar
          title="Master Departemen"
          subtitle="Daftar kelola induk departemen LokaHR"
          icon={<Building2 className="w-6 h-6" />}
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          actionButtons={
            <AddButton onClick={onAdd} />
          }
        />

        {/* 2. Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* 3. TAMPILAN MOBILE: Card */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">No. {row.index + 1}</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Departemen</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.departemen}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data departemen ditemukan.
            </div>
          )}
        </div>

        {/* 4. TAMPILAN DESKTOP: Menggunakan Reusable DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data departemen ditemukan." />

      </div>

      {/* 5. FLOATING ACTION BUTTON (FAB) KHUSUS MOBILE (Posisi di atas tombol menu garis 3) */}
      <div className="fixed bottom-24 right-6 z-50 block md:hidden">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center justify-center w-14 h-14 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
          title="Tambah Departemen"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};