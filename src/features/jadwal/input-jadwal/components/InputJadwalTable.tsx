import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { InputJadwalPeriode } from '../types/input-jadwal.type';
import { DataPagination } from '../../../../components/DataPagination';
import { CalendarCheck, Settings } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { 
  EditActionButton, 
  ImportIconButton, 
  ExportIconButton,
  MobileActionFabGroup 
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';

interface InputJadwalTableProps {
  data: InputJadwalPeriode[];
  onEdit?: (item: InputJadwalPeriode) => void;
  onSettingGlobal?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const InputJadwalTable: React.FC<InputJadwalTableProps> = ({
  data,
  onEdit,
  onSettingGlobal,
  onImport,
  onExport,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filteredData = useMemo(() => {
    let result = data;
    if (subDeptFilter) {
      result = result.filter((item) => item.sub_dept === subDeptFilter);
    }
    return result;
  }, [data, subDeptFilter]);

  const uniqueSubDeptList = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.sub_dept)));
  }, [data]);

  const isFiltered = Boolean(subDeptFilter);

  const columns = useMemo<ColumnDef<InputJadwalPeriode>[]>(
    () => [
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
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
        accessorKey: 'id_periode',
        header: 'ID Periode',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sub_dept',
        header: 'Sub Dept',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'skema_kerja',
        header: 'Skema Kerja',
        cell: (info) => (
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'total_hari',
        header: 'Total Hari',
        cell: (info) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'masuk',
        header: 'Masuk',
        cell: (info) => (
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'total_libur',
        header: 'Total Libur',
        cell: (info) => (
          <span className="font-medium text-amber-600 dark:text-amber-400">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'ph',
        header: 'PH',
        cell: (info) => (
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'cuti',
        header: 'Cuti',
        cell: (info) => (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'ref',
        header: 'Ref',
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {info.getValue() ? String(info.getValue()) : '-'}
          </span>
        ),
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <EditActionButton onClick={() => onEdit && onEdit(row.original)} />
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
          title="Input Jadwal (Periode)"
          subtitle="Kelola data jadwal kerja karyawan per periode LokaHR"
          icon={<CalendarCheck className="w-6 h-6" />}
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
              onReset={() => setSubDeptFilter('')}
              fields={[
                {
                  key: 'sub_dept',
                  label: 'Sub Departemen',
                  value: subDeptFilter,
                  onChange: setSubDeptFilter,
                  options: [
                    { value: '', label: 'Semua Sub Dept' },
                    ...uniqueSubDeptList.map((sd) => ({ value: sd, label: sd })),
                  ],
                },
              ]}
            />
          }
          actionButtons={
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={onSettingGlobal}
                className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shadow-sm"
                title="Setting Jam Mingguan (Semua Karyawan)"
              >
                <Settings className="w-4 h-4" />
              </button>
              <ImportIconButton onClick={onImport} />
              <ExportIconButton onClick={onExport} />
            </div>
          }
        />

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Mobile Card yang disamakan persis dengan halaman Jam Kerja */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const isAktif = item.status === 'Aktif';
              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.id_periode} • NIP: {item.nip}
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
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.sub_dept} • Skema: {item.skema_kerja}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit && onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data jadwal periode ditemukan.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwal periode ditemukan." />
      </div>

      {/* Floating Action Menu Khusus Mobile */}
      <MobileActionFabGroup
        onSetting={onSettingGlobal}
        onImport={onImport}
        onExport={onExport}
      />
    </div>
  );
};