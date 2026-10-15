import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';
import { DataPagination } from '../../../../components/DataPagination';
import { CalendarDays } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

interface SkemaHariKerjaTableProps {
  data: SkemaHariKerja[];
  onEdit: (item: SkemaHariKerja) => void;
  onAdd: () => void;
}

export const SkemaHariKerjaTable: React.FC<SkemaHariKerjaTableProps> = ({
  data,
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // Ganti state dari skemaFilter ke statusFilter
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filter data berdasarkan status
  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter) {
      result = result.filter((item) => (item.status ?? 'Aktif') === statusFilter);
    }
    return result;
  }, [data, statusFilter]);

  const isFiltered = Boolean(statusFilter);

  const columns = useMemo<ColumnDef<SkemaHariKerja>[]>(
    () => [
      {
        id: 'number',
        header: 'NO',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1 + info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize}
          </span>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID Skema',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'skema',
        header: 'Skema',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'jumlah_hari_kerja',
        header: 'Jumlah Hari Kerja',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'jam_kerja_per_hari',
        header: 'Jam Kerja (/Hari)',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())} Jam</span>
        ),
      },
      {
        accessorKey: 'total_jam_per_minggu',
        header: 'Total Jam (/Minggu)',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())} Jam</span>
        ),
      },
      {
        accessorKey: 'total_jam_per_bulan',
        header: 'Total Jam (/Bulan)',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())} Jam</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const isAktif = String(info.getValue()) === 'Aktif';
          return (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isAktif
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }`}
            >
              {String(info.getValue() ?? 'Aktif')}
            </span>
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        {/* 1. Header Toolbar */}
        <TableToolbar
          title="Skema Hari Kerja"
          subtitle="Daftar kelola skema hari kerja LokaHR"
          icon={<CalendarDays className="w-6 h-6" />}
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
              onReset={() => setStatusFilter('')}
              fields={[
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
          actionButtons={<AddButton onClick={onAdd} />}
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
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isAktif
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {item.status ?? 'Aktif'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Skema</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.skema}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Hari Kerja</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{item.jumlah_hari_kerja} Hari</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Jam/Hari</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{item.jam_kerja_per_hari} Jam</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Jam/Minggu</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{item.total_jam_per_minggu} Jam</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Jam/Bulan</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{item.total_jam_per_bulan} Jam</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data skema hari kerja ditemukan.
            </div>
          )}
        </div>

        {/* 4. TAMPILAN DESKTOP */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data skema hari kerja ditemukan." />

      </div>

      {/* 5. FLOATING ACTION BUTTON Mobile */}
      <MobileAddFab onClick={onAdd} title="Tambah Skema Hari Kerja" />
    </div>
  );
};