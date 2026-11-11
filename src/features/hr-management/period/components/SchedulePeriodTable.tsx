import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { PeriodeJadwal } from '../types/schedule-period.type';
import { DataPagination } from '@/components/DataPagination';
import { CalendarRange } from 'lucide-react';

import { TableToolbar } from '@/components/ui/TableToolbar';
import { AddButton, MobileAddFab } from '@/components/ui/ActionButtons';
import { DataTable } from '@/components/ui/data-table';

interface PeriodeJadwalTableProps {
  data: PeriodeJadwal[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
}

export const PeriodeJadwalTable: React.FC<PeriodeJadwalTableProps> = ({
  data = [],
  meta,
  setPage,
  setPageSize,
  searchQuery,
  onSearchChange,
  onAddClick,
}) => {
  const columns = useMemo<ColumnDef<PeriodeJadwal>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        cell: ({ row }) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {row.index + 1 + (meta.current_page - 1) * meta.per_page}
          </span>
        ),
      },
      {
        accessorKey: 'idPeriode',
        header: 'ID Periode',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'periode',
        header: 'Periode',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        id: 'rentangTanggal',
        header: 'Rentang Tanggal Absensi',
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {row.original.tanggalAwal} <span className="text-gray-400 dark:text-gray-500 mx-1">~</span> {row.original.tanggalAkhir}
          </span>
        ),
      },
      {
        accessorKey: 'keterangan',
        header: 'Keterangan',
        cell: (info) => (
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
            {String(info.getValue())}
          </span>
        ),
      },
    ],
    [meta]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta.current_page ?? 1) - 1,
          pageSize: meta.per_page ?? 10,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    onGlobalFilterChange: (val) =>
      onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-200 relative">
      <TableToolbar
        title="Periode Jadwal"
        subtitle="Daftar pengaturan periode kerja dan jadwal absensi"
        icon={<CalendarRange className="w-6 h-6" />}
        searchValue={searchQuery ?? ''}
        onSearchChange={onSearchChange}
        actionButtons={<AddButton onClick={onAddClick}>Tambah</AddButton>}
      />

      <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
        <DataPagination table={table} />
      </div>

      <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
        {rows.length > 0 ? (
          rows.map((row) => {
            const item = row.original;
            return (
              <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    ID: {item.idPeriode}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-semibold">
                    {item.keterangan}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.periode}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.tanggalAwal} ~ {item.tanggalAkhir}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
            Tidak ada data periode jadwal ditemukan.
          </div>
        )}
      </div>

      <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data periode jadwal ditemukan." />

      <MobileAddFab onClick={onAddClick} title="Tambah Periode Jadwal" />
    </div>
  );
};