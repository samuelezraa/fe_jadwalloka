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
  data = [],
  departemenList = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' | 'true' | 'false'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-close filter popover saat mengklik di luar area filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const isPopoverContent = Boolean(
        target.closest('[data-radix-popper-content-wrapper]') ||
        target.closest('[role="dialog"]')
      );

      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(target) &&
        !isPopoverContent
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

  // Helper untuk mendapatkan Nama Departemen secara presisi
  const getDepartmentName = (item: SubDepartemen) => {
    // 1. Jika backend mengirimkan objek relasi nested (misal item.department.name)
    if ((item as any).department?.name) {
      return (item as any).department.name;
    }

    // 2. Jika ada properti langsung department_name atau departemen_nama
    if (item.department_name) return item.department_name;
    if ((item as any).departemen_nama) return (item as any).departemen_nama;

    // 3. Pencarian fallback berdasarkan department_code / departemen_id di departemenList
    const targetCode = item.department_code || (item as any).departemen_id;
    if (targetCode && Array.isArray(departemenList) && departemenList.length > 0) {
      const foundDept = departemenList.find(
        (d) => String(d.code || d.id) === String(targetCode)
      );
      if (foundDept) {
        return foundDept.name || (foundDept as any).departemen || targetCode;
      }
    }

    return '-';
  };

  // Filter Data berdasarkan Departemen Code & Status Boolean
  const filteredData = useMemo(() => {
    let result = data;
    if (selectedDeptFilter) {
      result = result.filter(
        (item) => (item.department_code || (item as any).departemen_id) === selectedDeptFilter
      );
    }
    if (statusFilter) {
      const isFilterActive = statusFilter === 'true';
      result = result.filter((item) => item.is_active === isFilterActive);
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
        id: 'department_name',
        header: 'Departemen',
        cell: ({ row }) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {getDepartmentName(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'code',
        header: 'ID Sub Departemen',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue() || (info.row.original as any).id || '')}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Sub Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {String(info.getValue() || (info.row.original as any).sub_departemen || '')}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const isAktif = Boolean(info.getValue());
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
    [onEdit, departemenList]
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
                        ...departemenList.map((d) => ({ 
                          id: d.code || (d as any).id, 
                          label: d.name || (d as any).departemen 
                        })),
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
              const isAktif = item.is_active;
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.code || (item as any).id}
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
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Departemen</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                      {getDepartmentName(item)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sub Departemen</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                      {item.name || (item as any).sub_departemen}
                    </p>
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