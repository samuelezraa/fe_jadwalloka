import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Pos } from '../types/pos.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Building2 } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

interface PosTableProps {
  data: Pos[];
  departemenList?: Departemen[];
  subDepartemenList?: SubDepartemen[];
  onEdit: (item: Pos) => void;
  onAdd: () => void;
}

export const PosTable: React.FC<PosTableProps> = ({
  data,
  departemenList = [],
  subDepartemenList = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Filter Ganda
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('');
  const [selectedSubDeptFilter, setSelectedSubDeptFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchDept = selectedDeptFilter ? item.departemen_id === selectedDeptFilter : true;
      const matchSubDept = selectedSubDeptFilter ? item.sub_departemen_id === selectedSubDeptFilter : true;
      const matchStatus = selectedStatusFilter ? item.status === selectedStatusFilter : true;
      return matchDept && matchSubDept && matchStatus;
    });
  }, [data, selectedDeptFilter, selectedSubDeptFilter, selectedStatusFilter]);

  const isFiltered = Boolean(selectedDeptFilter || selectedSubDeptFilter || selectedStatusFilter);

  const columns = useMemo<ColumnDef<Pos>[]>(
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
        header: 'ID POS',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
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
        accessorKey: 'sub_departemen_nama',
        header: 'Sub Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
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
      {/* Kontainer utama menggunakan overflow-visible agar popover filter tidak terpotong */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        {/* Header Toolbar dengan Reusable TableFilterPopover */}
        <TableToolbar
          title="POS"
          subtitle="Daftar kelola posisi jabatan (POS) LokaHR"
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
                setSelectedSubDeptFilter('');
                setSelectedStatusFilter('');
              }}
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
                {
                  key: 'sub_departemen',
                  label: 'Sub Departemen',
                  value: selectedSubDeptFilter,
                  onChange: setSelectedSubDeptFilter,
                  options: [
                    { value: '', label: 'Semua Sub Departemen' },
                    ...subDepartemenList
                      .filter((sub) => !selectedDeptFilter || sub.departemen_id === selectedDeptFilter)
                      .map((sub) => ({ value: sub.id, label: sub.sub_departemen })),
                  ],
                },
                {
                  key: 'status',
                  label: 'Status',
                  value: selectedStatusFilter,
                  onChange: setSelectedStatusFilter,
                  options: [
                    { value: '', label: 'Semua Status' },
                    { value: 'Aktif', label: 'Aktif' },
                    { value: 'Nonaktif', label: 'Nonaktif' },
                  ],
                },
              ]}
            />
          }
          actionButtons={
            <AddButton onClick={onAdd} />
          }
        />

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Mobile Card */}
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
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">POS</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.pos}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data POS ditemukan.
            </div>
          )}
        </div>

        {/* Tampilan Desktop */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data POS ditemukan." />

      </div>

      {/* Floating Action Button Mobile (Memanggil MobileAddFab di atas tombol hamburger menu) */}
      <MobileAddFab onClick={onAdd} title="Tambah Pos" />
    </div>
  );
};