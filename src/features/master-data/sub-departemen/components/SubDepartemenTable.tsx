import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Building2 } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { Badge } from '../../../../components/ui/badge';

interface SubDepartemenTableProps {
  data: SubDepartemen[];
  departemenList?: Departemen[];
  onEdit: (item: SubDepartemen) => void;
  onAdd: () => void;
}

export const SubDepartemenTable: React.FC<SubDepartemenTableProps> = ({
  data,
  departemenList = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-close filter popover saat mengklik di luar area filter
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

  // Filter Data berdasarkan Departemen & Status
  const filteredData = useMemo(() => {
    let result = data;
    if (selectedDeptFilter) {
      result = result.filter((item) => item.departemen_id === selectedDeptFilter);
    }
    if (statusFilter) {
      result = result.filter((item: any) => (item.status || 'Aktif') === statusFilter);
    }
    return result;
  }, [data, selectedDeptFilter, statusFilter]);

  const isFiltered = Boolean(selectedDeptFilter || statusFilter);

  const columns = useMemo<ColumnDef<SubDepartemen>[]>(
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
        accessorKey: 'departemen_nama',
        header: 'Departemen',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID Sub Departemen',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
        ),
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        {/* Header Toolbar */}
        <TableToolbar
          title="Sub Departemen"
          subtitle="Daftar kelola sub departemen LokaHR"
          icon={<Building2 className="w-6 h-6" />}
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
                setSelectedDeptFilter('');
                setStatusFilter('');
              }}
              fields={[
                {
                  key: 'departemen',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={selectedDeptFilter}
                      onChange={(val) => setSelectedDeptFilter(val)}
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...departemenList.map((d) => ({ id: d.id, label: d.departemen })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: () => (
                    <FormSelectSearch
                      value={statusFilter}
                      onChange={(val) => setStatusFilter(val)}
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

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* TAMPILAN MOBILE: Card */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const statusVal = (item as any).status || 'Aktif';
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
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Departemen</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{item.departemen_nama}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sub Departemen</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.sub_departemen}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data sub departemen ditemukan.
            </div>
          )}
        </div>

        {/* TAMPILAN DESKTOP */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data sub departemen ditemukan." />

      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Sub Departemen" />

    </div>
  );
};