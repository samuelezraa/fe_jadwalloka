import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { PeriodeJadwal } from '../types/periodeJadwal.type';
import { DataPagination } from '@/components/DataPagination';
import { CalendarRange } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { AddButton } from '@/components/ui/ActionButtons';
import { DataTable } from '@/components/ui/data-table';

interface PeriodeJadwalTableProps {
  data: PeriodeJadwal[];
  onAddClick: () => void;
  isFormOpen: boolean;
}

export const PeriodeJadwalTable: React.FC<PeriodeJadwalTableProps> = ({
  data,
  onAddClick,
  isFormOpen,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<PeriodeJadwal>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {String(info.getValue())}
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
        accessorKey: 'tanggalAwal',
        header: 'Tanggal Awal',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggalAkhir',
        header: 'Tanggal Akhir',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
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
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
      
      {/* Header Toolbar */}
      <TableToolbar
        title="Periode Jadwal"
        subtitle="Daftar pengaturan periode kerja dan jadwal absensi"
        icon={<CalendarRange className="w-6 h-6" />}
        searchValue={globalFilter ?? ''}
        onSearchChange={setGlobalFilter}
        actionButtons={
          <AddButton onClick={onAddClick}>
            {isFormOpen ? 'Tutup Form' : 'Tambah Periode'}
          </AddButton>
        }
      />

      {/* Pagination */}
      <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
        <DataPagination table={table} />
      </div>

      {/* Tampilan Mobile Card */}
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
                    {item.tanggalAwal} s/d {item.tanggalAkhir}
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

      {/* Tampilan Desktop DataTable */}
      <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data periode jadwal ditemukan." />
    </div>
  );
};