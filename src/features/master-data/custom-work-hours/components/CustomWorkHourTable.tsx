import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import { DataPagination } from '@/components/DataPagination';
import { Clock } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '@/components/ui/ActionButtons';
import { DataTable } from '@/components/ui/data-table';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';
import { Badge } from '@/components/ui/badge';

interface CustomWorkHourTableProps {
  data: CustomWorkHour[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onEdit: (item: CustomWorkHour) => void;
  onAdd: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export const CustomWorkHourTable: React.FC<CustomWorkHourTableProps> = ({
  data = [],
  meta = { current_page: 1, last_page: 1, total: 0, per_page: 10, from: null, to: null },
  setPage,
  setPageSize,
  onEdit,
  onAdd,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showStatusDropdown]);

  const isFiltered = Boolean(statusFilter);

  const columns = useMemo<ColumnDef<CustomWorkHour>[]>(
    () => [
      {
        id: 'code',
        header: 'ID',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-semibold">
            {String(info.row.original.code || info.row.original.id || `CUS00${info.row.index + 1}`)}
          </span>
        ),
      },
      {
        id: 'periode',
        header: 'Periode',
        cell: ({ row }) => (
          <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
            {row.original.start_date} ~ {row.original.end_date}
          </span>
        ),
      },
      {
        accessorKey: 'work_scheme',
        header: 'Skema Hari Kerja',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
            {String(info.getValue() || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'clock_in',
        header: 'Jam Masuk',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue() || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'tolerance',
        header: 'Toleransi Keterlambatan',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue() || '00:05:00')}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Keterangan',
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-300 text-xs">
            {String(info.getValue() || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const rawActive = (info.row.original as any).is_active ?? (info.row.original as any).status;
          const isAktif = Boolean(
            rawActive === true || 
            (rawActive as unknown as number) === 1 || 
            rawActive === 'Aktif' || 
            rawActive === 'true'
          );
          return (
            <div className="flex justify-center">
              <Badge 
                variant="outline"
                className={
                  isAktif 
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3' 
                    : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3'
                }
              >
                {isAktif ? 'Aktif' : 'Non Aktif'}
              </Badge>
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
    data: data,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 10,
      },
      columnVisibility,
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
    onGlobalFilterChange: (val) => onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative" ref={filterWrapperRef}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        <TableToolbar
          title="Custom Jam Kerja"
          subtitle="Daftar kelola custom jam kerja LokaHR"
          icon={<Clock className="w-6 h-6" />}
          searchValue={searchQuery ?? ''}
          onSearchChange={onSearchChange}
          showFilterDropdown={showStatusDropdown}
          onToggleFilterDropdown={() => setShowStatusDropdown(!showStatusDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showStatusDropdown}
              onClose={() => setShowStatusDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => onStatusFilterChange('')}
              fields={[
                {
                  key: 'status',
                  label: 'Status',
                  render: () => (
                    <FormSelectSearch
                      value={statusFilter}
                      onChange={(val) => onStatusFilterChange(val)}
                      placeholder="Semua Status"
                      showSearch={false}
                      options={[
                        { id: '', label: 'Semua Status' },
                        { id: 'true', label: 'Aktif' },
                        { id: 'false', label: 'Non Aktif' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={<AddButton onClick={onAdd} />}
        />

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data custom jam kerja ditemukan." />
      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Custom Jam Kerja" />
    </div>
  );
};