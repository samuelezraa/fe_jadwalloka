import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Grade } from '../types/grade.type';
import { DataPagination } from '@/components/DataPagination';
import { Layers } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '@/components/ui/ActionButtons';
import { DataTable } from '@/components/ui/data-table';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';
import { Badge } from '@/components/ui/badge';

interface GradeTableProps {
  data: Grade[];
  onEdit: (item: Grade) => void;
  onAdd: () => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  data = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filter & Urutkan Data berdasarkan Level Terbesar ke Terkecil
  const filteredData = useMemo(() => {
    let result = [...data];

    // Tetap urutkan berdasarkan level tertinggi di atas
    result.sort((a, b) => (Number(b.level) || 0) - (Number(a.level) || 0));

    if (statusFilter) {
      const isFilterActive = statusFilter === 'true';
      result = result.filter((item) => {
        const rawActive = (item as any).is_active ?? (item as any).status;
        const isActive = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
        return isActive === isFilterActive;
      });
    }
    return result;
  }, [data, statusFilter]);

  const isFiltered = Boolean(statusFilter);

  const columns = useMemo<ColumnDef<Grade>[]>(
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
        accessorKey: 'code',
        header: 'ID Grade',
        cell: (info) => {
          const val = info.getValue() || (info.row.original as any).id || (info.row.original as any).kode_grade;
          return (
            <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-semibold">
              {String(val || '-')}
            </span>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Nama Grade',
        cell: (info) => {
          const val = info.getValue() || (info.row.original as any).grade || (info.row.original as any).nama_grade;
          return (
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {String(val || '-')}
            </span>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const rawActive = (info.row.original as any).is_active ?? (info.row.original as any).status;
          const isAktif = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
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
        
        {/* Header Toolbar */}
        <TableToolbar
          title="Master Grade"
          subtitle="Daftar kelola level jabatan LokaHR"
          icon={<Layers className="w-6 h-6" />}
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showStatusDropdown}
          onToggleFilterDropdown={() => setShowStatusDropdown(!showStatusDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showStatusDropdown}
              onClose={() => setShowStatusDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => setStatusFilter('')}
              fields={[
                {
                  key: 'status',
                  label: 'Status',
                  render: () => (
                    <FormSelectSearch
                      value={statusFilter}
                      onChange={(val) => setStatusFilter(val)}
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

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const rawActive = (item as any).is_active ?? (item as any).status;
              const isAktif = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
              const codeVal = item.code || (item as any).id || (item as any).kode_grade;
              const nameVal = item.name || (item as any).grade || (item as any).nama_grade;

              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {codeVal}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        isAktif 
                          ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5' 
                          : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3 py-0.5'
                      }
                    >
                      {isAktif ? 'Aktif' : 'Non Aktif'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nama Grade</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{nameVal}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data grade ditemukan.
            </div>
          )}
        </div>

        {/* Desktop View */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data grade ditemukan." />

      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Grade" />
    </div>
  );
};