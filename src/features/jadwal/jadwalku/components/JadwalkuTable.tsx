import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Jadwalku } from '../types/jadwalku.type';
import { DataPagination } from '../../../../components/DataPagination';
import { CalendarDays } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { ExportIconButton } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

interface JadwalkuTableProps {
  data: Jadwalku[];
  onExport?: () => void;
}

export const JadwalkuTable: React.FC<JadwalkuTableProps> = ({
  data,
  onExport,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [periodeFilter, setPeriodeFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Opsi unik untuk list Periode & Sub Departemen secara dinamis
  const uniquePeriodeList = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.periode)));
  }, [data]);

  const uniqueSubDeptList = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.sub_departemen)));
  }, [data]);

  // Filter Data berdasarkan Periode & Sub Departemen
  const filteredData = useMemo(() => {
    let result = data;
    if (periodeFilter) {
      result = result.filter((item) => item.periode === periodeFilter);
    }
    if (subDeptFilter) {
      result = result.filter((item) => item.sub_departemen === subDeptFilter);
    }
    return result;
  }, [data, periodeFilter, subDeptFilter]);

  const isFiltered = Boolean(periodeFilter || subDeptFilter);

  const columns = useMemo<ColumnDef<Jadwalku>[]>(
    () => [
      {
        accessorKey: 'nip',
        header: 'NIP',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
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
        accessorKey: 'departemen',
        header: 'Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'libur',
        header: 'Libur',
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
        accessorKey: 'izin',
        header: 'Izin',
        cell: (info) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'alfa',
        header: 'Alfa',
        cell: (info) => (
          <span className="font-medium text-red-600 dark:text-red-400">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sakit',
        header: 'Sakit',
        cell: (info) => (
          <span className="font-medium text-amber-600 dark:text-amber-400">
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
        accessorKey: 'terlambat',
        header: 'Terlambat',
        cell: (info) => (
          <span className="font-medium text-orange-600 dark:text-orange-400">
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
        accessorKey: 'total_hari',
        header: 'Total Hari',
        cell: (info) => (
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {String(info.getValue())}
          </span>
        ),
      },
    ],
    []
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
        
        {/* Header Toolbar menggunakan Reusable TableToolbar & TableFilterPopover */}
        <TableToolbar
          title="Jadwalku"
          subtitle="Ringkasan dan detail rekapitulasi jadwal kehadiran karyawan"
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
              onReset={() => {
                setPeriodeFilter('');
                setSubDeptFilter('');
              }}
              fields={[
                {
                  key: 'periode',
                  label: 'Periode',
                  value: periodeFilter,
                  onChange: setPeriodeFilter,
                  options: [
                    { value: '', label: 'Semua Periode' },
                    ...uniquePeriodeList.map((p) => ({ value: p, label: p })),
                  ],
                },
                {
                  key: 'sub_departemen',
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
            <div className="hidden md:block">
              <ExportIconButton onClick={onExport || (() => alert('Export data...'))} />
            </div>
          }
        />

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      NIP: {item.nip}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Total: {item.total_hari} Hari
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.departemen} • {item.sub_departemen}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg text-[10px] border border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="block text-gray-400 uppercase">Libur</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{item.libur}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">PH</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{item.ph}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Izin</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{item.izin}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Alfa</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{item.alfa}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Sakit</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{item.sakit}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Cuti</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{item.cuti}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Telat</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{item.terlambat}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase">Masuk</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.masuk}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data jadwalku ditemukan.
            </div>
          )}
        </div>

        {/* Desktop View: DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwalku ditemukan." />
      </div>

      {/* Floating Action Button (FAB) Export untuk Mobile di atas tombol hamburger */}
      <div className="fixed bottom-24 right-6 z-50 block md:hidden">
        <ExportIconButton
          onClick={onExport || (() => alert('Export data...'))}
          className="flex items-center justify-center w-12 h-12 bg-amber-500 text-white rounded-full shadow-2xl hover:bg-amber-600 transition-transform active:scale-95 border-2 border-white dark:border-gray-900 p-0"
          title="Export Data"
        />
      </div>
    </div>
  );
};