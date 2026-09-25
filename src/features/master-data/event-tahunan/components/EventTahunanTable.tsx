import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { EventTahunan } from '../types/event-tahunan.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Calendar } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

interface EventTahunanTableProps {
  data: EventTahunan[];
  onEdit: (item: EventTahunan) => void;
  onAdd: () => void;
}

export const EventTahunanTable: React.FC<EventTahunanTableProps> = ({
  data,
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tanggalFilter, setTanggalFilter] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filter Data Berdasarkan Status & Tanggal
  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (tanggalFilter) {
      result = result.filter((item) => item.tanggal === tanggalFilter);
    }
    return result;
  }, [data, statusFilter, tanggalFilter]);

  const isFiltered = Boolean(statusFilter || tanggalFilter);

  const uniqueTanggalList = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.tanggal)));
  }, [data]);

  const columns = useMemo<ColumnDef<EventTahunan>[]>(
    () => [
      {
        id: 'number',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1 + info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize}
          </span>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID Event',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'event',
        header: 'Event',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'keterangan',
        header: 'Keterangan',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isAktif
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {val}
              </span>
            </div>
          );
        },
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
    data: filteredData,
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
      {/* overflow-visible agar popover filter tidak terpotong */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        {/* 1. Header Toolbar Reusable dengan TableFilterPopover */}
        <TableToolbar
          title="Event Tahunan"
          subtitle="Daftar kelola event tahunan LokaHR"
          icon={<Calendar className="w-6 h-6" />}
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => {
                setStatusFilter('');
                setTanggalFilter('');
              }}
              fields={[
                {
                  key: 'tanggal',
                  label: 'Tanggal Event',
                  value: tanggalFilter,
                  onChange: setTanggalFilter,
                  options: [
                    { value: '', label: 'Semua Tanggal' },
                    ...uniqueTanggalList.map((t) => ({ value: t, label: t })),
                  ],
                },
                {
                  key: 'status',
                  label: 'Status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: '', label: 'Semua Status' },
                    { value: 'Aktif', label: 'Aktif' },
                    { value: 'Non Aktif', label: 'Non Aktif' },
                  ],
                },
              ]}
            />
          }
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
              const isAktif = item.status === 'Aktif';
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isAktif
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Event & Tanggal</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.event}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.tanggal} • <span className="font-mono">{item.type}</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Keterangan</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{item.keterangan}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data event tahunan ditemukan.
            </div>
          )}
        </div>

        {/* 4. TAMPILAN DESKTOP: Menggunakan Reusable DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data event tahunan ditemukan." />

      </div>

      {/* 5. FLOATING ACTION BUTTON (FAB) Mobile */}
      <MobileAddFab onClick={onAdd} title="Tambah Event" />
    </div>
  );
};