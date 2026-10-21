import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import { Clock } from 'lucide-react';
import type { CustomJamKerja } from '../types/custom-jam-kerja.type';

// Reusable UI Components dari LokaHR
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { Badge } from '../../../../components/ui/badge';
import { DataTable } from '../../../../components/ui/data-table';
import { DataPagination } from '../../../../components/DataPagination';

interface CustomJamKerjaTableProps {
  data: CustomJamKerja[];
  onEdit: (item: CustomJamKerja) => void;
  onAdd: () => void;
}

export const CustomJamKerjaTable: React.FC<CustomJamKerjaTableProps> = ({
  data,
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-close filter dropdown saat mengklik area luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showFilterDropdown]);

  // Filter Data berdasarkan Status
  const filteredData = useMemo(() => {
    if (!statusFilter) return data;
    return data.filter((item: any) => (item.status || 'Aktif') === statusFilter);
  }, [data, statusFilter]);

  const isFiltered = Boolean(statusFilter);

  const columns = useMemo<ColumnDef<CustomJamKerja>[]>(
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
        accessorKey: 'periode',
        header: 'Periode',
        cell: ({ row }) => (
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {`${row.original.periodeStart} ~ ${row.original.periodeEnd}`}
          </span>
        ),
      },
      {
        accessorKey: 'skemaHariKerja',
        header: 'Skema Hari kerja',
      },
      {
        accessorKey: 'jamMasuk',
        header: 'Jam Masuk',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'toleransiKeterlambatan',
        header: 'Toleransi Keterlambatan',
      },
      {
        accessorKey: 'keterangan',
        header: 'Keterangan',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue() || 'Aktif');
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <Badge 
                variant={isAktif ? 'outline' : 'destructive'} 
                className={
                  isAktif 
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3' 
                    : 'rounded-full px-3'
                }
              >
                {val}
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
  <div className="relative" ref={filterWrapperRef}>
    {/* 🌟 HAPUS overflow-hidden DI SINI AGAR POPOVER FILTER TIDAK TERPOTONG */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
      
      {/* Header TableToolbar Reusable LokaHR */}
      <TableToolbar
        title="Custom Jam Kerja"
        subtitle="Daftar kelola custom jam kerja LokaHR"
        icon={<Clock className="w-6 h-6" />}
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
                render: () => (
                  <FormSelectSearch
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Semua Status"
                    options={[
                      { id: '', label: 'Semua Status' },
                      { id: 'Aktif', label: 'Aktif' },
                      { id: 'Non Aktif', label: 'Non Aktif' },
                    ]}
                  />
                ),
              },
            ]}
          />
        }
        actionButtons={
          <AddButton onClick={onAdd} />
        }
      />

      {/* Baris Pagination */}
      <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
        <DataPagination table={table} />
      </div>

      {/* TAMPILAN MOBILE: Card View */}
      <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
        {rows.length > 0 ? (
          rows.map((row) => {
            const item = row.original;
            const statusVal = item.status || 'Aktif';
            const isAktif = statusVal === 'Aktif';
            return (
              <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    {item.id}
                  </span>
                  <Badge 
                    variant={isAktif ? 'outline' : 'destructive'} 
                    className={
                      isAktif 
                        ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5' 
                        : 'rounded-full px-3 py-0.5'
                    }
                  >
                    {statusVal}
                  </Badge>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Periode</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.periodeStart} ~ {item.periodeEnd}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Jam Masuk</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{item.jamMasuk}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Keterangan</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{item.keterangan}</p>
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
            Tidak ada data custom jam kerja ditemukan.
          </div>
        )}
      </div>

      {/* TAMPILAN DESKTOP */}
      <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data custom jam kerja ditemukan." />

    </div>

    {/* Floating Action Button (Mobile) */}
    <MobileAddFab onClick={onAdd} title="Tambah Custom Jam Kerja" />
  </div>
);
};