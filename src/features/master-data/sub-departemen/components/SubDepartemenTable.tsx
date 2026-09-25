import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Building2, Plus } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

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
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filteredData = useMemo(() => {
    if (!selectedDeptFilter) return data;
    return data.filter((item) => item.departemen_id === selectedDeptFilter);
  }, [data, selectedDeptFilter]);

  const isFiltered = Boolean(selectedDeptFilter);

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
      {/* Menggunakan overflow-visible agar popover filter tidak terpotong ke bawah */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        {/* 1. Header Toolbar Reusable dengan TableFilterPopover */}
        <TableToolbar
          title="Sub Departemen"
          subtitle="Daftar kelola sub departemen LokaHR"
          icon={<Building2 className="w-6 h-6" />}
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showDeptDropdown}
          onToggleFilterDropdown={() => setShowDeptDropdown(!showDeptDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showDeptDropdown}
              onClose={() => setShowDeptDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => setSelectedDeptFilter('')}
              fields={[
                {
                  key: 'departemen',
                  label: 'Departemen',
                  value: selectedDeptFilter,
                  onChange: setSelectedDeptFilter,
                  options: [
                    { value: '', label: 'Semua Departemen' },
                    ...departemenList.map((d) => ({ value: d.id, label: d.departemen })),
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

        {/* 4. TAMPILAN DESKTOP: Menggunakan Reusable DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data sub departemen ditemukan." />

      </div>

      {/* 5. FLOATING ACTION BUTTON (FAB) Mobile (Berada di atas tombol menu hamburger) */}
      <MobileAddFab onClick={onAdd} title="Tambah Sub Departemen" />

    </div>
  );
};